Q3 — Slow article page on mobile
Three improvements I'd consider:

Image optimisation / responsive images.

Measure first: Lighthouse mobile "Largest Contentful Paint" and total image bytes in DevTools Network. Check whether srcset/sizes are present.

Fix: Generate WebP/AVIF, add srcset, lazy-load below-the-fold images, set explicit width/height.

Render-blocking CSS/JS and third-party scripts (ads, analytics).

Measure first: Lighthouse "Eliminate render-blocking resources" and Coverage tab to see unused CSS/JS. Check ad/analytics script timing in the Performance panel.

Fix: Defer non-critical JS, inline critical CSS, load ads/analytics after DOMContentLoaded or via a consent-aware loader.

Server response time / caching.

Measure first: TTFB in WebPageTest (mobile profile). Check whether page cache and object cache are active.

Fix: Full-page cache for anonymous users, object cache (Redis), opcache.

Chosen improvement: Image optimisation / responsive images.

How I'd verify it helped without breaking ads, analytics, or signed-in behaviour:

Run Lighthouse mobile before/after on the same URL and same throttling; compare LCP and image bytes.

Use a staging copy with the same ad tags and analytics ID. Confirm in DevTools that ad iframes still load and GA/GTM events fire (check Network + dataLayer).

Log in as a subscriber/editor and confirm the page still renders, personalised content is correct, and no cache serves one user's page to another. Check Vary: Cookie or exclude logged-in users from full-page cache.

Keep a rollback (feature flag / revert commit) ready.