ISLAMIC ARABIC LEARNING DICTIONARY — PROFILE NAVIGATION ADD-ON

Files in this package:
- profile.html: account profile page
- profile.js: loads profile details, updates display name, and logs out
- profile.css: responsive styling with bottom navigation
- config.js: Supabase URL and browser-safe publishable key

IMPORTANT: These files do not automatically modify your existing learn.html. To show Profile in BOTH the top and bottom navigation, add the snippets below to learn.html.

1) TOP NAVIGATION
In learn.html, find the <header class="topbar"> area. After the existing theme button, add:
<a class="profile-top-link" href="./profile.html" aria-label="My profile">♙ Profile</a>

2) BOTTOM NAVIGATION
In learn.html, find <nav class="bottom-nav" aria-label="Main navigation">. Add this anchor before </nav>:
<a class="nav-item" href="./profile.html"><span>♙</span>Profile</a>

3) STYLE THE TOP LINK
Add this CSS to the end of style.css:
.profile-top-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 12px;border:1px solid #b28b3b;border-radius:12px;color:inherit;text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap}

4) UPLOAD all four files to the ROOT of the same GitHub repository, alongside learn.html, login.html, signup.html and config.js. If config.js already exists from the account-system package, keep one config.js only; use the values in this package.

5) Supabase must have the public.profiles table and RLS policies previously created. The profile page lets a signed-in user update only their own display_name. It does not allow changing membership status.

6) Set Supabase Authentication > URL Configuration Site URL to:
https://abdulsammedtakiyudeen-bot.github.io/English-Arabic-dictionary/

This is an add-on, not a full website replacement. Do not replace index.html, learn.html, app.js, or service-worker.js with files from another project.
