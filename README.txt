ISLAMIC ARABIC LEARNING DICTIONARY — LOADING FIX

This patch contains only:
1. conversation-academy.js
2. service-worker.js

What it changes:
- Starts the Academy controls immediately instead of waiting for lesson JSON.
- Loads the 20 lessons and Supabase account status independently.
- Gives the lesson-data request a 12-second timeout and clearer failure status.
- Adds the Academy page, CSS, JavaScript and lesson JSON to the service-worker cache.
- Uses cached static files immediately and refreshes them in the background.
- Gives page navigation a short network wait before using its cached copy.

What it deliberately does NOT change:
- No lesson text, vocabulary, dialogues, quizzes or course order.
- No Tutor Takiyudeen content or Academy page layout.
- No images or image paths.
- No Supabase keys, Paystack settings, Premium settings or other site pages.

IMPORTANT:
The GitHub integration refused a direct live-repository update (HTTP 403), so these files
have NOT been deployed. Upload these two files to the repository root and replace the
existing files with the same names. Do not upload or replace learn.html with an older copy.

The earlier learn.html you supplied includes an Academy announcement popup that is absent
from the current GitHub learn.html. This patch intentionally does not overwrite learn.html
because doing so could roll back newer live page content. That popup needs a safe merge
as a separate small change.
