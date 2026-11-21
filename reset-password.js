(() => {
  const messageEl = document.getElementById('message');
  const show = (msg, type='ok') => { messageEl.textContent=msg; messageEl.className=`message show ${type}`; };
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
    show('The account service could not load. Check your connection and config.js.', 'error'); return;
  }
  const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY, {
    auth: { storage: localStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  let recoveryReady = false;
  const checkSession = async () => {
    const { data, error } = await client.auth.getSession();
    if (error) { show('This reset link may be invalid or expired. Request a new reset email from the login page.', 'error'); return; }
    if (data.session) { recoveryReady = true; show('Reset link accepted. Choose your new password.'); }
    else show('Open this page using the password-reset link sent to your email. If the link has expired, request another from the login page.', 'error');
  };
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY' && session) { recoveryReady=true; show('Reset link accepted. Choose your new password.'); }
  });
  checkSession();
  document.getElementById('passwordForm').addEventListener('submit', async e => {
    e.preventDefault();
    const password=document.getElementById('password').value;
    const confirm=document.getElementById('confirmPassword').value;
    const btn=document.getElementById('submitBtn');
    if(password.length < 8){show('Please use at least 8 characters for your new password.','error');return;}
    if(password!==confirm){show('The two passwords do not match. Please check them.','error');return;}
    if(!recoveryReady){show('Your reset link is not ready or has expired. Request a new reset email first.','error');return;}
    btn.disabled=true;btn.textContent='Updating…';
    try {
      const {error}=await client.auth.updateUser({password});
      if(error) throw error;
      show('Your password has been updated. You can now log in with your new password.');
      e.target.reset();
      setTimeout(()=>location.href='./login.html',1800);
    } catch(err) { show(err.message||'Could not update password. Please request a new reset link.','error'); }
    finally { btn.disabled=false;btn.textContent='Update password'; }
  });
})();
