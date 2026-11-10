# Arabic Conversation Academy — additive package

This package is designed for the existing live Islamic Arabic Learning Dictionary website. It replaces/adds only the Conversation Academy page and adds its own assets. It does not replace the main dictionary, existing academy, login pages, profile, payment pages, Paystack Edge Function, or Supabase configuration.

## Files to add to the repository root

- `conversation-academy.html` — replacement for the existing Conversation Academy page
- `conversation-academy.css` — Academy styling
- `conversation-academy.js` — lessons, speech controls, quizzes, progress and certificate
- `conversation-lessons.json` — all 20 lesson datasets
- `conversation-academy-hero.png` — new main welcome/hero image
- `conversation-academy-setup.sql` — additive progress table and row-level security policies
- `supabase/functions/conversation-tutor/index.ts` — optional secure AI tutor function
- `PREMIUM-VIDEO-LESSON-SCRIPTS.md` — narration/storyboard outlines for the 13 Premium visual lessons

## Safe installation

1. Download and extract this ZIP.
2. In your GitHub repository, upload the five root files listed above. Replace only the existing `conversation-academy.html`; add the other four root assets. Do not replace `config.js`, `auth.js`, `profile.js`, `premium.html`, `payment.html`, `academy.html`, `academy.js`, `index.html`, or `service-worker.js`.
3. In Supabase Dashboard → SQL Editor, run `conversation-academy-setup.sql`. It creates one new table and its user-scoped RLS policies. It does not alter existing tables.
4. Commit the new files to `main`.
5. Open `https://arabiclearningdictionary.com/conversation-academy.html` and test the free lessons while signed out, then test account progress while signed in.

## What works in this package

- 20 structured lessons with Arabic vocabulary, objectives, model phrases, short dialogues, grammar guidance and quizzes.
- Lessons 1–7 free; lessons 8–20 are shown as Premium and require an active `profiles.membership = 'premium'` and a future `premium_until`.
- Sequential unlocking: complete the previous lesson to open the next.
- Device Arabic speech playback using Web Speech synthesis when an Arabic voice is installed.
- Optional microphone speech recognition where the browser supports it.
- Daily vocabulary and revision cards.
- Progress stored in local browser storage, with account synchronisation through the new `conversation_academy_progress` table when the SQL setup has been applied and the student is signed in.
- A printable course certificate unlocks after all 20 lessons are completed. The browser's print dialog can save it as PDF.
- Tutor Takiyudeen's prepared dialogues and guided lesson prompts.
- Main welcome image is displayed in the hero section.

## AI tutor setup (optional external service)

The prepared tutor dialogues and course work without AI. For genuinely open-ended AI responses, deploy the included Supabase Edge Function named `conversation-tutor` and set the provider key as a Supabase Function Secret. Never put the provider key in `config.js` or any browser file.

Using Supabase CLI from a trusted computer:
```bash
supabase functions deploy conversation-tutor
supabase secrets set OPENAI_API_KEY=YOUR_PROVIDER_KEY
supabase secrets set OPENAI_MODEL=gpt-4o-mini
```
The AI provider may charge for usage. Check its current pricing and obtain the account owner's/parent or guardian's approval before enabling paid API usage. The key is not included in this ZIP. Until configured, the page shows a clear message and the prepared lessons continue to work.

## Important media and browser limitations

- The welcome image is included.
- The course contains guided visual/narrated lesson content and the 13 Premium video lesson scripts. It does **not** contain 13 prerecorded MP4 video files. No approved video files or hosting URLs were supplied, so this package does not display fake video buttons or claim that videos are already hosted. The scripts can be used to produce or record the videos later.
- Arabic playback depends on voices installed on the student's device. The page tries `ar-SA`, but the exact voice and quality vary by device.
- Microphone speech recognition is not supported in every browser and may require internet access. The page does not claim to provide a certified pronunciation score.
- Progress sync requires the SQL setup. If it has not been applied, browser-local progress still works.
- The AI tutor requires the separate Edge Function and a provider key. It is not active just because the files are uploaded.

## Protection of the existing live site

No existing dictionary, login, profile, payment, Paystack, or other course files are included as replacements in this ZIP. Do not upload this ZIP using an option that deletes files not present in the archive.
