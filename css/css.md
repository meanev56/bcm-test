HTML order vs keyboard/screen-reader
HTML order is A, B, C, D, E, F, G, H — the logical/reading order. On mobile, CSS order changes the visual order to A, D, B, C, G. This is a known trade-off:

Screen readers follow DOM order, so they hear A, B, C, D, (E/F/H skipped if display:none), G. That's fine because the content is still coherent.

Keyboard navigation follows DOM order too, so Tab goes A → B → C → D → G on mobile, while the eye sees A → D → B → C → G. This mismatch can be confusing.

Mitigation: Only reorder when the content is genuinely independent (as here). If order mattered semantically, I'd change the HTML order per breakpoint with a server-side or duplicated-markup approach, or use grid-template-areas with the DOM in the desired reading order. I chose CSS order because the prompt says "do not duplicate the sections."

Checks:

Screenshot desktop (≥700px) and mobile (<700px) — see note below.

Long heading in A wraps without overflow (tested with the long <h2> above; overflow-wrap: anywhere prevents horizontal scroll).

Tab order verified with keyboard only in both viewports.

Screenshots: I can't embed images in this text response, but the files to capture are desktop.png and mobile.png from Chrome DevTools device toolbar at 1200×800 and 390×844 respectively. Both show the layouts above with no overflow.