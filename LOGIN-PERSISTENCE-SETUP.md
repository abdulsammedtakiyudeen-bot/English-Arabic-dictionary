# Login persistence update

This package explicitly configures the Supabase clients used by login, protected-page
session checks, and the profile page to store sessions in browser `localStorage`,
with session persistence and automatic token refresh enabled.

## Expected behaviour
- Signing in stores the Supabase session in this browser profile.
- Closing and reopening the website should normally keep the user signed in.
- Signing out deliberately clears the session.
- Clearing browser/site data, private browsing, a different browser profile/device,
  or browser storage restrictions can still remove the saved session.

## Supabase dashboard checks
1. Authentication > URL Configuration: set the Site URL to
   `https://abdulsammedtakiyudeen-bot.github.io`.
2. Add the deployed callback/redirect URLs used by the app under Redirect URLs.
3. Do not enable an application rule that signs users out on page close.
4. Do not change the Supabase project URL or publishable key in `config.js`.

## Test after publishing
1. Publish the extracted repository contents to the GitHub Pages repository root.
2. Open the website in the same normal browser profile (not Incognito).
3. Sign in, open a protected page, close the tab/browser, then reopen the site.
4. If it still asks for login, inspect browser storage for the Supabase auth key and
   the browser console/network errors. Do not send passwords, access tokens, or keys.

This change does not alter payment code, database tables, membership records, or
account-deletion backend. It does not guarantee persistence if the browser clears
site storage or the user switches browser profiles.
