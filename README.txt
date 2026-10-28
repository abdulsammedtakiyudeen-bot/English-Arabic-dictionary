ISLAMIC ARABIC LEARNING DICTIONARY — ACCOUNT PAGES (INITIAL VERSION)

Files:
- config.js: Supabase project URL and browser publishable key
- signup.html: email/password registration
- login.html: email/password login and password reset email
- dashboard.html: signed-in account and membership display
- auth.js: Supabase Auth logic
- auth.css: responsive styling

INSTALLATION ON GITHUB MOBILE:
1. Open repository abdulsammedtakiyudeen-bot/English-Arabic-dictionary.
2. Upload these six files to the repository root (same level as index.html and learn.html).
3. Commit changes to main and wait for GitHub Pages to publish.
4. Visit /signup.html to test registration, then confirm the email if prompted, and visit /login.html.

SUPABASE SETTINGS:
- Authentication > URL Configuration: set Site URL to https://abdulsammedtakiyudeen-bot.github.io/English-Arabic-dictionary/
- Add this exact URL to Redirect URLs if required: https://abdulsammedtakiyudeen-bot.github.io/English-Arabic-dictionary/**
- Keep email confirmation enabled. If confirmation emails do not arrive, review Supabase email/SMTP configuration.

IMPORTANT LIMITS:
- This is the first account/authentication stage. Existing home/learning pages have not been replaced or automatically linked; add links to signup.html/login.html in those pages after testing.
- Membership defaults to FREE. Do not manually change a user's membership to premium as a payment process. Paid membership requires a trusted server-side payment verification flow and protected entitlement updates; static GitHub Pages alone cannot safely verify payments.
- The publishable key is designed for browser use; never put a service_role/secret key or database password in these files.
- Supabase CDN use requires an internet connection for account features. Existing dictionary content should remain available as currently built.
