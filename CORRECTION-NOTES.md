# Islamic Arabic Learning Dictionary — correction package

This ZIP contains only files changed by this correction pass. Upload each file to the same path in the GitHub repository, replacing that file only.

## Included corrections
- `service-worker.js`: fixes the offline navigation fallback URL construction, increments the cache version, and adds the Conversation Academy page, CSS, JavaScript, lesson data, and hero image to the core offline cache.
- SEO metadata: adds missing meta descriptions to pages that lacked them; adds canonical URLs to public pages that lacked them.
- Private/account pages: adds `noindex, nofollow` to account-specific pages so login, payment, profile, dashboard, notifications, signup, and personal certificate pages are not intended as search results.
- `sitemap.xml`: lists the public learning pages on the custom domain and excludes private/account pages.

## Preserved
No existing page content, vocabulary data, images, PDFs, Supabase settings, authentication code, payment code, Paystack function, or analytics tags were intentionally changed. `index.html` and `index-1.html` are both preserved in your repository; this package updates `index.html` only.

## Upload
Extract the ZIP and upload the included files into the repository root, keeping their filenames. Do not delete any other files.

## Important testing
After GitHub Pages deploys, open the website once while online, then test the Conversation Academy and reload it. Offline availability depends on the browser allowing service workers and on the assets having been successfully cached while online. Microphone speech recognition still depends on browser/device support and may require internet.
