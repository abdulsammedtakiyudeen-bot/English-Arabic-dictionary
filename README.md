# Islamic Arabic Learning Dictionary
By Dev. Takiyudeen

## Files
- `index.html`: app interface
- `style.css`: responsive green-and-gold design
- `app.js`: search, favourites, learned words, daily word, lessons, quiz, speech synthesis, and optional online translation
- `data/arabic-words.json`: starter vocabulary collection
- `manifest.json`: PWA installation metadata
- `service-worker.js`: offline cache
- `privacy.html`: starter privacy notice
- `assets/icons/icon.svg`: app icon

## Run it
For best results, upload the complete contents to the root of a GitHub repository and enable GitHub Pages for the main branch/root folder. Then open the published HTTPS site. Service workers do not work from a local `file://` URL.

## Notes before public launch
- This is a functional starter, not a finished commercial release.
- Online translation uses MyMemory's public endpoint and is not guaranteed to be available or accurate. Machine translations must not be treated as verified Qur'anic interpretation.
- Speech uses the browser/device speech synthesis engine; Arabic voice availability varies by device.
- No ad SDK or Premium payments are implemented. The advertisement area is only a placeholder.
- Local storage is device/browser-specific. Data is not synced between devices.
- Check third-party service terms and privacy policies, and update privacy disclosures before public launch.
- Test on mobile and desktop. A production Android/Play Store release needs further testing, store assets, policy review, and packaging.
