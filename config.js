// Browser-safe Supabase project settings. Never put service_role or secret keys here.
window.SUPABASE_URL = 'https://ivnxhisezpxamutweifl.supabase.co';
window.SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ZzyqOOVjmrrO0JIJBmpvwA_KEFB-WBA';


// Shared authentication policy for every page in this application.
// sessionStorage keeps the session across page navigation/reloads in this tab,
// but normally clears it when the tab/app window is closed. Browser restore
// behaviour varies, so this is best-effort rather than a guaranteed close event.
(function () {
  if (!window.supabase || window.__ialdSessionPolicyApplied) return;
  const originalCreateClient = window.supabase.createClient.bind(window.supabase);
  window.supabase.createClient = function (url, key, options) {
    const supplied = options || {};
    const auth = Object.assign({}, supplied.auth || {}, {
      storage: window.sessionStorage,
      storageKey: 'iald-auth-session',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    });
    return originalCreateClient(url, key, Object.assign({}, supplied, { auth }));
  };
  window.__ialdSessionPolicyApplied = true;
})();
