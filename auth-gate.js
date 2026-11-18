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

    /* Add a read-only unread-notification indicator after session verification. */
    function installNotificationBell(userId) {
      const addBell = () => {
        const header = document.querySelector('header');
        if (!header || document.getElementById('notificationBell')) return;

        const style = document.createElement('style');
        style.id = 'notificationBellStyles';
        style.textContent = `
          .notification-bell {
            position:relative; display:inline-flex; align-items:center; justify-content:center;
            flex:0 0 42px; width:42px; height:42px; margin:0 10px 0 auto;
            border:1px solid rgba(18,55,42,.2); border-radius:13px;
            background:#fff; color:#12372a; text-decoration:none;
            font: 22px/1 system-ui; box-sizing:border-box;
          }
          .notification-bell:focus-visible { outline:3px solid #d5ad45; outline-offset:3px; }
          .notification-bell .notification-badge {
            position:absolute; top:-6px; right:-6px; min-width:19px; height:19px;
            padding:0 5px; display:flex; align-items:center; justify-content:center;
            border:2px solid #fff; border-radius:999px; background:#c62828; color:#fff;
            font:700 11px/1 system-ui; box-sizing:border-box;
          }
          .notification-bell .notification-badge[hidden] { display:none; }
          @media (prefers-color-scheme:dark) {
            .notification-bell { background:#173c30; color:#fff; border-color:rgba(255,255,255,.25); }
          }
        `;
        document.head.appendChild(style);

        const bell = document.createElement('a');
        bell.id = 'notificationBell';
        bell.className = 'notification-bell';
        bell.href = './notifications.html';
        bell.title = 'Notifications';
        bell.setAttribute('aria-label', 'Notifications');
        bell.innerHTML = '<span aria-hidden="true">🔔</span><span class="notification-badge" aria-hidden="true" hidden></span>';

        /* Keep existing header controls and content; add the bell at the end. */
        header.appendChild(bell);
        const badge = bell.querySelector('.notification-badge');

        async function refreshUnreadCount() {
          try {
            const { count, error } = await client
              .from('user_notifications')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('is_read', false);

            if (error) throw error;
            const unread = Number(count || 0);
            badge.textContent = unread > 99 ? '99+' : String(unread);
            badge.hidden = unread === 0;
            bell.setAttribute('aria-label', unread
              ? 'Notifications, ' + unread + ' unread'
              : 'Notifications');
          } catch (error) {
            /* A count failure must not interfere with sign-in or page functionality. */
            console.warn('Unread notification count could not be refreshed:', error);
          }
        }

        refreshUnreadCount();
        window.setInterval(refreshUnreadCount, 45000);
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) refreshUnreadCount();
        });
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBell, { once: true });
      } else {
        addBell();
      }
    }

    installNotificationBell(result.data.session.user.id);
  } catch (error) {
    clearTimeout(timeout);
    console.warn('Session check was interrupted:', error);
    showNotice('We could not verify your saved session right now. Your account has not been deleted. Check your connection and refresh this page.');
  }
})();
