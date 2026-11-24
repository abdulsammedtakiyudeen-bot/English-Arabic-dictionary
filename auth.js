
(() => {
  const show = (msg, type = 'ok') => {
    const el = document.getElementById('message');
    if (!el) return;
    el.textContent = msg;
    el.className = `message show ${type}`;
  };

  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
    show('The account service could not load. Check your internet connection and config.js.', 'error');
    return;
  }

  const client = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        storage: window.localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  // Add accessible Show/Hide Password buttons.
  function addPasswordToggle() {
    const fields = document.querySelectorAll('input[type="password"]');

    fields.forEach(input => {
      if (input.dataset.visibilityToggle === 'ready') return;
      input.dataset.visibilityToggle = 'ready';

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:relative;width:100%;';

      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      input.style.paddingRight = '52px';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Show password');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.title = 'Show password';
      toggle.style.cssText = `
        position:absolute;
        right:8px;
        top:50%;
        transform:translateY(-50%);
        width:38px;
        height:38px;
        margin:0;
        padding:0;
        border:0;
        border-radius:8px;
        background:transparent;
        color:#24445f;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
        font-size:21px;
      `;
      toggle.innerHTML = '<span aria-hidden="true">👁</span>';

      toggle.addEventListener('click', () => {
        const showing = input.type === 'password';
        input.type = showing ? 'text' : 'password';
        toggle.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
        toggle.setAttribute('aria-pressed', String(showing));
        toggle.title = showing ? 'Hide password' : 'Show password';
        toggle.innerHTML = showing
          ? '<span aria-hidden="true">◉</span>'
          : '<span aria-hidden="true">👁</span>';
      });

      wrapper.appendChild(toggle);
    });
  }

  addPasswordToggle();

  function safeNext() {
    const raw = new URLSearchParams(location.search).get('next') || 'dashboard.html';
    const allowed = new Set([
      'learn.html', 'courses.html', 'dashboard.html',
      'profile.html', 'premium.html', 'payment.html',
      'certificate.html'
    ]);
    const page = raw.split(/[?#]/)[0];
    return allowed.has(page) ? './' + raw : './dashboard.html';
  }

  const signup = document.getElementById('signupForm');

  if (signup) signup.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Creating account…';

    const display_name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { display_name },
          emailRedirectTo: location.origin +
            location.pathname.replace(/[^/]*$/, '') + 'login.html'
        }
      });

      if (error) throw error;

      if (data.session) {
        show('Account created successfully. Opening your account…');
        location.href = safeNext();
      } else {
        show('Registration submitted. Check your email for a confirmation message, then return here and log in. If no email arrives, check spam and your Supabase email settings.');
        signup.reset();
      }
    } catch (err) {
      show(err.message || 'Could not create the account. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Create account';
    }
  });

  const login = document.getElementById('loginForm');

  if (login) login.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Logging in…';

    try {
      const { error } = await client.auth.signInWithPassword({
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      });

      if (error) throw error;
      location.href = safeNext();
    } catch (err) {
      show(err.message || 'Login failed. Check your details.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Log in';
    }
  });

  const reset = document.getElementById('resetBtn');

  if (reset) reset.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();

    if (!email) {
      show('Enter your email address first, then tap this button again.', 'error');
      return;
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: location.origin +
          location.pathname.replace(/[^/]*$/, '') + 'reset-password.html'
      });

      if (error) throw error;
      show('If this email is registered, a password-reset email will be sent. Check your inbox and spam folder.');
    } catch (err) {
      show(err.message || 'Could not send reset email. Please try again.', 'error');
    }
  });

  const profile = document.getElementById('profile');

  if (profile) (async () => {
    const { data: { user }, error } = await client.auth.getUser();

    if (error || !user) {
      location.href = './login.html';
      return;
    }

    let membership = 'free';
    let displayName = user.user_metadata?.display_name || 'Learner';

    const { data } = await client
      .from('profiles')
      .select('email,display_name,membership,created_at')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      membership = data.membership || 'free';
      displayName = data.display_name || displayName;
    }

    profile.innerHTML = '';

    const rows = [
      ['Name', displayName],
      ['Email', user.email || 'Not available'],
      ['Membership', membership.toUpperCase()],
      ['Account created', user.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : 'Available']
    ];

    rows.forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'profile-row';

      const strong = document.createElement('strong');
      strong.textContent = label + ': ';

      row.append(strong, document.createTextNode(value));

      if (label === 'Membership') {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = ' ' + value;
        row.append(tag);
      }

      profile.append(row);
    });
  })().catch(() => {
    profile.textContent = 'Could not load account details. Please log in again.';
  });

  const logout = document.getElementById('logoutBtn');

  if (logout) logout.addEventListener('click', async () => {
    const { error } = await client.auth.signOut();

    if (error) {
      show(error.message, 'error');
      return;
    }

    location.href = './login.html';
  });
})();
        
