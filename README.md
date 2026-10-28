# Islamic Arabic Learning Dictionary
**By Dev. Takiyudeen**

A responsive English–Arabic vocabulary and Islamic Arabic learning PWA designed for mobile and desktop.

## Files in this repository root
- `index.html` — app interface and navigation
- `style.css` — responsive green-and-gold theme
- `app.js` — dictionary search, saved words, learned-word tracking, daily word, mini lessons, quiz, Arabic speech, optional online lookup
- `arabic-words.json` — bundled vocabulary data (offline dictionary)
- `manifest.json` — PWA metadata
- `service-worker.js` — offline caching and cache versioning
- `icon.svg` — app icon
- `privacy.html` — privacy notice

## Publish with GitHub Pages
1. Upload these files directly into the repository root (the same level as `index.html`).
2. In GitHub, open **Settings → Pages** and choose the `main` branch and `/ (root)` folder if Pages is not already enabled.
3. Open the published HTTPS URL. Service workers require HTTPS (or localhost); they do not run from a local `file://` path.

## Important fixes in this edition
- All references use the actual root paths. The vocabulary loads from `./arabic-words.json`; the icon is `./icon.svg`.
- The service worker cache was bumped to `iald-cache-v3` and uses the same real paths.
- The manifest uses the correct icon path and sets the app scope.
- The dictionary file is validated before rendering, and the built-in dictionary is used as a fallback if the JSON file cannot be loaded.
- HTML text from dictionary entries is escaped before being inserted into the page.
- The quiz avoids repeating the same answer within one question and tracks correct answers.
- Favourites, learned words, theme choice, quiz count, and saved online entries persist in local storage.
- Online translation is explicitly optional and marked as machine-generated and unverified.
- No active ads, subscriptions, payment service, or account system are included.

## Notes
- Offline vocabulary is bundled locally. Optional online lookup requires internet and a third-party service, so it may fail or return incorrect translations.
- Arabic speech depends on speech synthesis and the Arabic voices available on the user's device.
- Browser storage is device/browser-specific and is not cloud-synced.
- Review the privacy notice and test the published site on the devices you plan to support before a Play Store release.


## Expanded learning release v7
- Expanded Arabic-English vocabulary with word forms and practical phrases organised by category.
- 40 detailed lessons with Arabic examples, transliteration, notes, English summaries, and listening buttons.
- Offline cache version bumped to v7.
- Vocabulary includes Modern Standard Arabic and Islamic learning terms; specialised meanings should be checked against reliable references.


## Welcome page update (v8)
The site now opens at `index.html`, a welcome page with a “Continue my Arabic learning journey” button. That button opens `learn.html`, which contains the dictionary application. `welcome.css` styles the landing page. The service worker cache is `iald-cache-v8`. Upload all files in this ZIP to the repository root, replacing files with the same names.


## Welcome and guided course (v9)
- `index.html` is the welcome page. “Start learning now” opens `guide.html`, then `explore.html`, then `learn.html`.
- Mini Lessons displays a 20-section sequential course. Only the first section is available at the start.
- A learner opens a section, studies the notes and vocabulary, then taps the next-section button and confirms completion. Confirmed progress unlocks the next section and is stored in this browser.
- Section progress is local to the device/browser and is not an online account sync.
