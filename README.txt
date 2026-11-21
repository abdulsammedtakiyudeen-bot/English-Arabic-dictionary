Arabic Video Learning — main page insertion package

Files:
- arabic-video-main-section.html: section markup
- arabic-video-main-section.css: styles
- arabic-video-main-section.js: render and embedded-player behavior

Integration:
1. In learn.html, insert the HTML section immediately after the main hero/search section and before Extra Arabic Resource Library.
2. Put the CSS contents inside the existing <style> block in learn.html (or include the CSS file).
3. Put the JS contents before </body> in learn.html (or include the JS file).
4. Keep arabic-video-banner.png in the repository root.
5. Existing resource library and green feature cards remain below the new section.

Only two video IDs are currently enabled. Lessons 3–30 remain “Video coming soon” until verified videos are assigned. Each iframe appears inside its numbered card, never in a player at the top.
