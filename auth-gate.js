/* Restore the existing Supabase session without forcing a fresh network user lookup.
   Protected pages remain visible if the network is temporarily unavailable. */
(async function () {
  const protectedPages = new Set([
    'learn.html','courses.html','dashboard.html','profile.html',
    'premium.html','payment.html','certificate.html','intelligence.html'
  ]);
  const page = location.pathname.split('/').pop() || 'index.html';
  if (!protectedPages.has(page)) return;

  function showNotice(message) {
    document.documentElement.style.visibility = 'visible';
    const note = document.createElement('p');
    note.setAttribute('role', 'alert');
    note.style.cssText = 'margin:12px;padding:12px;border-radius:10px;background:#fff4d8;color:#49370b;font:14px/1.5 system-ui';
    note.textContent = message;
    document.body.prepend(note);
  }
  function redirect() {
    const next = page + location.search + location.hash;
    location.replace('./login.html?next=' + encodeURIComponent(next));
  }
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
    showNotice('Account access could not load. Check your connection and config.js, then refresh.');
    return;
  }

  let timeout;
  try {
    const client = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_PUBLISHABLE_KEY,
      { auth: {
          storage: window.localStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        } }
    );
    const result = await Promise.race([
      client.auth.getSession(),
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), 8000); })
    ]);
    clearTimeout(timeout);
    if (!result?.data?.session?.user) { redirect(); return; }
    document.documentElement.dataset.authenticated = 'true';
    document.documentElement.style.visibility = 'visible';
  } catch (error) {
    clearTimeout(timeout);
    console.warn('Session check was interrupted:', error);
    showNotice('We could not verify your saved session right now. Your account has not been deleted. Check your connection and refresh this page.');
  }
})();
