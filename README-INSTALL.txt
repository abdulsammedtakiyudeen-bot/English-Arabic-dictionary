NOTIFICATION BELL — SAFE REPLACEMENT PACKAGE

Included:
- auth-gate.js (complete replacement)

What it does:
- Preserves the existing protected-page session check and redirect behavior.
- After an existing signed-in session is confirmed, adds a notification bell to the page header.
- Reads only the signed-in user's unread count from public.user_notifications.
- Refreshes the count every 45 seconds and when the page becomes visible again.
- Clicking the bell opens ./notifications.html.
- If the count request fails, the rest of the page continues to work.

Pages covered by the existing auth-gate.js:
learn.html, courses.html, dashboard.html, profile.html, premium.html,
payment.html, certificate.html and intelligence.html.

IMPORTANT:
1. Make a backup copy of your current auth-gate.js first.
2. Replace ONLY auth-gate.js in the repository root with the file in this ZIP.
3. Do not replace any HTML, CSS, config.js, auth.js, notifications.js, SQL,
   Supabase settings, payment files or other files.
4. Commit/publish the change only after reviewing it.
5. Test while signed in, then test a signed-out session to confirm the existing
   login redirect still behaves as before.

The bell displays a count only when unread notification rows already exist.
It does not create notifications or change notification records.
