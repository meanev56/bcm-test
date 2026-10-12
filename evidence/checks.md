
## Summary of Checks & Evidence

| Area | Check | Evidence |
|---|---|---|
| PHP Q1 | 5 scenarios, `WP_DEBUG` log empty | Local WP install, 25 posts |
| PHP Q2 | Role/capability comparison | `current_user_can` test + admin UI |
| PHP Q3 | Lighthouse before/after | Mobile preset, same URL |
| CSS Q4 | Desktop + mobile screenshots, long heading | Chrome DevTools 1200×800 / 390×844 |
| HTML Q5 | W3C Nu validator | "Document validates" |
| JS Q6 | Repeated clicks, toggling, counts | Console logs + DOM inspection |
| Q7 | `curl` headers, DB vs page | `curl -I`, wp-admin, REST |
| Q8 | 30-minute editor session | Timed task, error count |
| Q9 | Mock service retry | Same idempotency key, one record |
| Q10 | 5 request tests | 401/403/400/200 as expected |

**AI use note:** AI was used only to double-check the W3C validator phrasing and the `preg_replace_callback` signature. All code was written and run locally; AI output was verified by executing the code and validating the HTML with the real validator.
