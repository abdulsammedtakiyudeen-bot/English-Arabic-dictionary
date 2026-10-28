(() => {
 const $ = id => document.getElementById(id);
 const status = $('status');
 if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) { status.textContent='Account service unavailable. Check config.js and your internet connection.'; return; }
 const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
 async function init(){
  const {data:{user},error}=await client.auth.getUser();
  if(error || !user){status.textContent='You are not logged in. Log in or create an account to view your profile.';return;}
  $('loginLink').hidden=true; $('signupLink').hidden=true; $('logoutBtn').hidden=false; $('editForm').hidden=false;
  let row=null; const result=await client.from('profiles').select('email,display_name,membership,created_at').eq('id',user.id).maybeSingle();
  if(result.error){status.textContent='Signed in, but profile details could not be loaded: '+result.error.message;return;} row=result.data;
  const name=(row?.display_name || user.user_metadata?.display_name || '').trim(); $('displayName').value=name;
  const details=$('profileDetails'); details.hidden=false; details.replaceChildren();
  const items=[['Name',name||'Not set'],['Email',user.email||'Not available'],['Membership',(row?.membership||'free').toUpperCase()],['Joined',user.created_at?new Date(user.created_at).toLocaleDateString():'Not available']];
  for(const [label,value] of items){const div=document.createElement('div');div.className='detail-row';const b=document.createElement('strong');b.textContent=label;const span=document.createElement('span');span.textContent=value;div.append(b,span);details.append(div);}
  status.textContent='You are logged in.';
 }
 $('editForm').addEventListener('submit',async e=>{e.preventDefault();const {data:{user}}=await client.auth.getUser();if(!user)return;const name=$('displayName').value.trim();status.textContent='Saving…';
  const {error}=await client.from('profiles').update({display_name:name}).eq('id',user.id);
  if(error){status.textContent='Could not save name: '+error.message;return;}
  const {error:metaError}=await client.auth.updateUser({data:{display_name:name}}); status.textContent=metaError?'Name saved to profile, but account metadata did not update.':'Profile updated successfully.'; await init();
 });
 $('logoutBtn').addEventListener('click',async()=>{const {error}=await client.auth.signOut();if(error){status.textContent='Could not log out: '+error.message;return;}location.href='./login.html';});
 init().catch(e=>status.textContent='Could not load profile: '+e.message);
})();
