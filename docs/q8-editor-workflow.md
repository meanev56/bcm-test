Q8 — Make editorial copy/paste easier in one engineering day
What I'd ask/observe first:

Watch one editor do the task end-to-end. Time each step. Note which tools they paste into (CMS, social scheduler, newsletter, Slack, etc.) and what fields they copy (title, URL, image, excerpt).

Ask: "Which part is most error-prone?" and "What would 'good' look like?"

Check if the CMS already has a "Copy for social" or similar feature, and whether the tools have APIs.

Smallest useful improvement:

A "Copy for publishing" button in the editor that puts a pre-formatted block on the clipboard: title, canonical URL, and a suggested excerpt — one click, no new service.

Simpler alternative with little/no new code:

A documented checklist + browser bookmarklet that copies the same fields using existing DOM. Zero backend changes, can ship today.

Why this choice:

The button removes the most repetitive step (assembling the same info repeatedly) without integrating with every downstream tool. The bookmarklet is the fallback if engineering time is tighter than expected.

What remains under editorial control:

The final wording of the excerpt/social copy.

Which image to use.

Whether to publish now or schedule.

How I'd test with one editor:

30-minute session: give them a real article, ask them to publish it using the new button, and time it vs the old way.

Observe errors and ask for one improvement.

How I'd judge success:

Time to complete the task down by ≥30%.

Zero copy/paste errors in a week of use.

Editor says they'd keep using it.

Similar improvement (≤100 words):

In a previous role, our team manually copied release notes into three places. I built a small script that read the Git tag and posted a formatted summary to Slack and the changelog. My contribution was the script and the template. Outcome: release notes went from ~15 minutes to ~2, and we stopped missing entries. I learned that the biggest win was agreeing on a single source of truth before writing any code.