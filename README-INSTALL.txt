ISLAMIC ARABIC LEARNING DICTIONARY — CLICKABLE NOTIFICATIONS UPDATE

WHAT THIS UPDATE DOES
- Adds an optional action_url field to user_notifications.
- Shows an "Open update" link when a notification has a valid destination.
- Allows only same-site destinations; external URLs are not rendered as links.
- Preserves existing notification loading, unread state, mark-as-read and mark-all-as-read behaviour.
- Does not modify login, auth-gate.js, Paystack, Premium, lessons, courses or certificates.

INSTALLATION
1. Back up the current notifications.js from the repository.
2. In Supabase Dashboard > SQL Editor, run the complete file:
   20261118_notification_action_url.sql
3. Replace the repository's notifications.js with the notifications.js in this ZIP.
4. Commit/deploy those two changes to the existing site.
5. Refresh notifications.html and confirm the page still loads.

HOW FUTURE NOTIFICATIONS GET A DESTINATION
When a trusted server-side workflow inserts a notification, it should set action_url to a page on this website, for example:
- ./courses.html
- ./learn.html
- ./islamic-knowledge.html
- ./profile.html
- ./premium.html

Use the exact lesson/course page URL (including its existing query string or hash) when a specific lesson/course is published. Do not let ordinary browser clients insert notifications or expose a Supabase service-role key.

IMPORTANT CURRENT LIMITATION
This package adds the clickable destination support only. It does NOT yet create/send live announcements, course/lesson release notifications, account/Premium event notifications, or the scheduled Friday 8:00 AM Ghana-time Surah Al-Kahf reminder. Those require a trusted server-side notification sender and scheduler. No test notifications are inserted by this package.
