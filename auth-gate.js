/* Require a signed-in Supabase account before showing protected app pages. */
(async function () {
  const protectedPages = new Set(['learn.html','courses.html','dashboard.html','profile.html','premium.html','payment.html','certificate.html']);
  const page = location.pathname.split('/').pop() || 'index.html';
  if (!protectedPages.has(page)) return;
  document.documentElement.style.visibility = 'hidden';
  function redirect() {
    const next = page + location.search + location.hash;
    location.replace('./login.html?next=' + encodeURIComponent(next));
  }
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
    document.documentElement.style.visibility = 'visible';
    const note = document.createElement('p'); note.setAttribute('role','alert');
    note.textContent = 'Account access could not be checked. Please check your connection and refresh.';
    document.body.prepend(note); return;
  }
  try {
    const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) { redirect(); return; }
    document.documentElement.dataset.authenticated = 'true';
    document.documentElement.style.visibility = 'visible';
  } catch (_) { redirect(); }
})();
