Q7 — Stale article version after theme release
First three checks:

Reproduce with cache-busting.

Ask the reader to hard-refresh / open incognito, and append ?v=timestamp to the URL.

If the new version appears, it's caching. If not, it's code/content.

Check the origin (server) response.

curl -I the article URL and look for X-Cache, Age, CF-Cache-Status, Cache-Control, Vary.

If Age is high or X-Cache: HIT, it's a CDN/page-cache issue.

Check the database vs the rendered page.

In wp-admin, confirm the article content in the editor. Then check the REST API (/wp-json/wp/v2/posts/<id>) and the raw DB row.

If DB/REST show the new content but the page shows old, it's a caching layer. If DB shows old, it's a content/revision problem.

Distinguishing caching from code/content:

Caching: new content appears in incognito/with cache-bust; Age/X-Cache headers indicate a hit; different readers see different versions depending on edge node.

Code/content: all readers see the same old version; DB/REST also show old; no cache headers involved.

When I'd roll back:

If the release broke signed-in behaviour, ads, analytics, or caused errors (not just stale content), roll back immediately.

If it's purely stale content and the origin is correct, I'd purge cache first rather than roll back.

How I'd verify recovery:

Purge CDN + page cache, then re-check curl -I for Age: 0 / MISS then HIT with new content.

Ask the editor to confirm in incognito.

Check error logs and Lighthouse/analytics for anomalies for 15 minutes.

Two-sentence update to the editor:

"We've identified that the corrected article is live on the server, but some readers are still being served a cached copy. We're purging the cache now and will confirm within 15 minutes that everyone sees the update."

Assumptions: I don't know the cause yet. I'd state that the above is a diagnostic plan, not a confirmed diagnosis.