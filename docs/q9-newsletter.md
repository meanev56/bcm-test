Q9 — Newsletter signup: timeout, rate limit, invalid email
Assumptions: The newsletter service accepts POST /subscribers with {email}. It may return 202 Accepted or 200 OK. It supports an idempotency key. We store signups locally in a signups table.

Small function (pseudocode)
php
function subscribe(string $email, string $idempotencyKey): array {
    // 1. Validate locally first — no network call for invalid emails.
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        log_info('signup.invalid_email', ['email_hash' => hash('sha256', $email)]);
        return ['status' => 'invalid'];
    }

    // 2. Insert (or find) a pending row keyed by idempotency key.
    //    UNIQUE(idempotency_key) prevents duplicates on retry.
    $row = db_upsert_pending($email, $idempotencyKey);

    if ($row['state'] === 'confirmed') {
        return ['status' => 'already_subscribed'];
    }

    // 3. Call the service with the idempotency key.
    try {
        $res = http_post('/subscribers', [
            'email'            => $email,
            'idempotency_key'  => $idempotencyKey,
        ], timeout: 5);
    } catch (TimeoutException $e) {
        // We don't know if it was accepted. Mark for retry; do NOT delete.
        db_mark_retry($idempotencyKey, 'timeout');
        log_warn('signup.timeout', ['key' => $idempotencyKey]);
        return ['status' => 'pending_retry'];
    } catch (RateLimitException $e) {
        // Honour Retry-After; schedule a retry with backoff.
        $retryAfter = $e->getRetryAfter() ?? 30;
        db_mark_retry($idempotencyKey, 'rate_limited', $retryAfter);
        log_warn('signup.rate_limited', ['key' => $idempotencyKey, 'retry_after' => $retryAfter]);
        return ['status' => 'pending_retry'];
    }

    // 4. Success
    db_mark_confirmed($idempotencyKey);
    log_info('signup.confirmed', ['key' => $idempotencyKey]);
    return ['status' => 'subscribed'];
}
What I'd store/log:

idempotency_key (unique), email hash (not raw), state (pending, retry, confirmed), attempt count, last error type, timestamps.

Log: event name, idempotency key, error type, retry-after. Never log raw email or full request bodies.

What I'd avoid logging:

Raw email addresses, auth tokens, full HTTP bodies, PII.

How I'd test retry after the service already accepted:

Mock the service so the first call accepts but the client times out. Re-run subscribe with the same idempotency key. Confirm the mock receives the same key and does not create a second record. Assert the local DB shows one confirmed row.