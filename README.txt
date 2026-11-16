ISLAMIC ARABIC LEARNING DICTIONARY — SAFE AMENDMENT PACK
========================================================

Included replacement files:
1. intro.html
   - Preserves the existing introduction page layout, text, styles,
     continue link, localStorage flag and install-app.js reference.
   - Adds the site's existing AdSense publisher tag to the public
     introduction page, which is the first page shown to new visitors.
   - Keeps the existing Google Analytics tag.

2. privacy.html
   - Preserves the existing policy content and styling.
   - Corrects section numbering: Google Analytics 6, Offline access 7,
     Data choices 8, Children 9, Changes 10, Contact 11.
   - Updates the revision date to 16 November 2026.

SAFETY SCOPE
------------
This pack does NOT contain or replace:
- Supabase configuration, authentication, database or Edge Functions
- Paystack configuration, payment handlers or payment verification
- profiles or payments tables
- premium membership logic
- ads-config.js or ads.js
- service worker files
- any lesson, course, exam or certificate files

IMPORTANT
---------
Before replacing, download a backup of your current intro.html and
privacy.html from GitHub.

Upload/replace ONLY these two files in the repository root, keeping
their exact filenames. Do not replace the entire repository or upload
the ZIP itself as the website.

The AdSense publisher script only adds the publisher tag to intro.html.
It does not enable manual ad units or guarantee that ads will appear.
Ad delivery also depends on the AdSense account and site settings.

After publishing, test:
- Open the site in a private/incognito window.
- Confirm the introduction page and Continue button work.
- Confirm privacy.html opens and displays sections 1 through 11.
- Sign in and verify the learning area still works.
- Do not run payment tests or alter payment settings as part of this pack.
