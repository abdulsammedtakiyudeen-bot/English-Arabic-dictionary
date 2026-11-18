(() => {
  const $ = id => document.getElementById(id);
  const status = $('notificationStatus');
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
    status.textContent = 'Notification service unavailable.';
    return;
  }

  const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
  let userId = null;
  const say = message => { status.textContent = message; };

  // Only allow destinations on this same website. This prevents a notification
  // from becoming an external/open-redirect link if its data is ever malformed.
  function safeDestination(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value.trim(), window.location.href);
      if (url.origin !== window.location.origin) return null;
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
      if (url.username || url.password) return null;
      return url.href;
    } catch (_) {
      return null;
    }
  }

  async function load() {
    say('Loading notifications…');
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) {
      say('Log in to view your notifications.');
      return;
    }
    userId = user.id;

    const { data, error } = await client
      .from('user_notifications')
      .select('id,title,message,category,is_read,created_at,action_url')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Could not load notifications:', error);
      say('Notifications could not be loaded. Please refresh or try again later.');
      return;
    }

    const list = $('notificationList');
    list.replaceChildren();
    if (!data?.length) {
      say('You have no notifications yet.');
      return;
    }

    say(data.filter(item => !item.is_read).length + ' unread notification(s).');

    data.forEach(notification => {
      const item = document.createElement('article');
      item.className = 'notice-item' + (notification.is_read ? '' : ' unread');

      const heading = document.createElement('h3');
      heading.textContent = notification.title;
      item.append(heading);

      const message = document.createElement('p');
      message.textContent = notification.message;
      item.append(message);

      const destination = safeDestination(notification.action_url);
      if (destination) {
        const openLink = document.createElement('a');
        openLink.className = 'notification-open-link';
        openLink.href = destination;
        openLink.textContent = 'Open update';
        openLink.setAttribute('aria-label', 'Open update: ' + notification.title);
        openLink.style.cssText = 'display:inline-block;margin:4px 10px 8px 0;padding:9px 14px;border-radius:9px;background:#12372a;color:#fff;text-decoration:none;font-weight:600';
        item.append(openLink);
      }

      const meta = document.createElement('p');
      meta.className = 'notice-meta';
      meta.textContent = (notification.category || 'general') + ' · ' + new Date(notification.created_at).toLocaleString();
      item.append(meta);

      if (!notification.is_read) {
        const markRead = document.createElement('button');
        markRead.className = 'secondary';
        markRead.type = 'button';
        markRead.textContent = 'Mark as read';
        markRead.addEventListener('click', async () => {
          const { error: updateError } = await client
            .from('user_notifications')
            .update({ is_read: true })
            .eq('id', notification.id)
            .eq('user_id', userId);
          if (updateError) say('Could not update this notification.');
          else await load();
        });
        item.append(markRead);
      }

      list.append(item);
    });
  }

  $('readAll').addEventListener('click', async () => {
    if (!userId) return;
    const { error } = await client
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    say(error ? 'Could not mark notifications as read.' : 'All notifications marked as read.');
    if (!error) await load();
  });

  $('refresh').addEventListener('click', () => load());
  load().catch(error => {
    console.error('Notification loading failed:', error);
    say('Could not load notifications.');
  });
})();
