Q10 — Review the "safe because button is only visible to editors" claim
Review of the claim:

The claim is wrong. UI visibility is not a security control. Anyone can craft a request to the endpoint (curl, Postman, browser console) regardless of what the button shows. Authorisation must be enforced server-side.

Server-side checks required (in order):

Authentication — is the request from a logged-in user? (is_user_logged_in() / nonce / application password).

Capability check — does the user have the right capability for this action? For changing post status, typically edit_post for that specific post (and possibly publish_posts if moving to publish).

Nonce / CSRF check — verify wp_verify_nonce (or REST nonce) to prevent CSRF.

Input validation — article ID is a positive integer; status is in the allowed set (draft, pending, publish, private, etc.).

Ownership/context check — current_user_can('edit_post', $post_id) ensures the user can edit that post.

Rate limiting / audit log — optional but good practice.

Pseudocode:

php
function handle_update_status(WP_REST_Request $req) {
    // 1. Auth
    if (!is_user_logged_in()) {
        return new WP_Error('unauth', 'Login required', ['status' => 401]);
    }

    // 2. CSRF / nonce
    $nonce = $req->get_header('X-WP-Nonce');
    if (!$nonce || !wp_verify_nonce($nonce, 'wp_rest')) {
        return new WP_Error('bad_nonce', 'Invalid nonce', ['status' => 403]);
    }

    // 3. Validate inputs
    $post_id = (int) $req->get_param('id');
    $status  = sanitize_key($req->get_param('status'));
    $allowed = ['draft', 'pending', 'publish', 'private'];

    if ($post_id <= 0 || !in_array($status, $allowed, true)) {
        return new WP_Error('bad_input', 'Invalid id or status', ['status' => 400]);
    }

    // 4. Capability check for THIS post
    if (!current_user_can('edit_post', $post_id)) {
        return new WP_Error('forbidden', 'Not allowed', ['status' => 403]);
    }

    // 5. Extra check for publishing
    if ($status === 'publish' && !current_user_can('publish_posts')) {
        return new WP_Error('forbidden', 'Cannot publish', ['status' => 403]);
    }

    // 6. Perform update
    $result = wp_update_post(['ID' => $post_id, 'post_status' => $status], true);
    if (is_wp_error($result)) {
        return new WP_Error('update_failed', 'Update failed', ['status' => 500]);
    }

    return ['ok' => true, 'id' => $post_id, 'status' => $status];
}
Two tests that should be rejected:

Logged-out request with a valid-looking body → expect 401.

Logged-in subscriber (no edit capability) trying to change another user's post to publish → expect 403.

I'd also test: missing nonce → 403; invalid status → 400; editor changing their own draft → 200; editor trying to publish someone else's post → 403.

How I'd raise it with the developer:

Privately, with the concrete test cases above and the pseudocode. Frame it as "here's what I'd expect the server to enforce" rather than "you're wrong."

Emphasise the risk: a subscriber could publish or unpublish content via curl.

Must be fixed before release:

Server-side auth, nonce, input validation, and per-post capability check. The UI can stay as-is; it's just not the security boundary.