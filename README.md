# TAKIYUDEEN — Arabic Learning Dictionary chatbot add-on

This package adds a small, programmed (not AI-powered) Arabic and basic Islamic learning chatbot. It is intentionally separate from your existing website files so it does not replace your login, lessons, payment pages, or other features.

## Included

- Floating **Ask TAKIYUDEEN** button and responsive chat panel.
- English and Arabic starter questions.
- Greetings, vocabulary, pronouns, numbers and beginner grammar.
- Basic Islamic learning notes and cautious handling of religious rulings.
- Signed-in Supabase users only.
- Free members: 10 questions per Ghana-local calendar day.
- Premium members: unlimited questions while their Premium membership is active.
- Server-side membership and daily-limit checks.

## Important: this is a programmed chatbot

It uses a small built-in answer bank. It does not use an AI model, browse the internet, or understand every possible question. Unknown questions receive a helpful fallback message.

## 1. Supabase database

You already ran the SQL that creates `chatbot_daily_usage` and `consume_chatbot_question(UUID, INTEGER)`. This Edge Function expects that function to exist and be executable by `service_role`.

The function checks your existing `profiles` table for `membership` and `premium_until`. It assumes Premium membership is stored as `membership = 'premium'` and that `premium_until` is either NULL (no expiry recorded) or a future timestamp. If your actual values differ, adjust the check in `index.ts` before deploying.

## 2. Add the Edge Function

Copy this folder into your existing Supabase project:

`supabase/functions/takiyudeen-chat/`

Deploy it using your normal Supabase deployment process. The function uses the Supabase environment variables available to Edge Functions. The service-role key stays on the server and is never placed in browser JavaScript.

If your project has changed to the newer API-key setup, verify the legacy `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` variables are available, or update the function to use your project's current key environment variables.

## 3. Add the widget to the website

Copy these two files into a new folder in your website, for example:

- `assets/takiyudeen/takiyudeen.css`
- `assets/takiyudeen/takiyudeen.js`

Then add this just before `</body>` on the page where you want the assistant to appear:

```html
<div id="takiyudeen-root"></div>
<link rel="stylesheet" href="/assets/takiyudeen/takiyudeen.css">

<script>
  window.TAKIYUDEEN_CONFIG = {
    supabaseUrl: "https://YOUR_PROJECT_REF.supabase.co",
    getAccessToken: async () => {
      // Replace `supabase` below with the name of the Supabase client
      // already initialized by your website's existing JavaScript.
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    }
  };
</script>
<script src="/assets/takiyudeen/takiyudeen.js" defer></script>
```

Use your existing Supabase client. Do not create a second auth system just for the chatbot. If your client variable is not named `supabase`, change that one reference to the actual variable name.

The project URL is not a secret. Never paste a service-role key into HTML, JavaScript, GitHub Pages, or any browser-visible file.

## 4. Membership and testing

1. Sign in to the website with a normal Free account.
2. Open the chat and ask a simple question, such as `What does kitāb mean?`.
3. Confirm the status line shows the remaining daily allowance.
4. Test with a Premium account whose `profiles.membership` is `premium` and whose `premium_until` is NULL or in the future.
5. Confirm Premium users are not charged against the daily counter.

Do not test by changing real customer membership records. Use your own test account.

## 5. Before going live

- Confirm the exact Premium values in your `profiles` table.
- Confirm the Edge Function deploys successfully.
- Test logged-out, Free, expired Premium, and active Premium states.
- Add the widget to one page first. After it works, add it to other pages if desired.
- Keep a backup of the current website ZIP before changing any live files.

## Folder layout

```text
TAKIYUDEEN-chatbot/
  README.md
  widget/
    takiyudeen.css
    takiyudeen.js
  supabase/
    functions/
      takiyudeen-chat/
        index.ts
```
