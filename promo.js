(() => {
'use strict';
const banner=document.getElementById('premiumPromo');
const adSlots=[...document.querySelectorAll('.ad-slot')];
if(!banner)return;
banner.hidden=false;
function setAdVisibility(isPremium){
  // Ad containers are placeholders only until a compliant ad network is configured.
  adSlots.forEach(slot=>{slot.hidden=Boolean(isPremium);});
}
setAdVisibility(false);
if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_PUBLISHABLE_KEY)return;
try{
 const client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
 async function updatePromotion(){
  const {data:{user},error:authError}=await client.auth.getUser();
  if(authError||!user){banner.hidden=false;setAdVisibility(false);return;}
  const {data:profile,error}=await client.from('profiles').select('membership,premium_until').eq('id',user.id).maybeSingle();
  if(error||!profile){banner.hidden=true;return;}
  const membership=String(profile.membership||'free').toLowerCase();
  const expiry=profile.premium_until?new Date(profile.premium_until):null;
  const activePremium=membership==='premium'&&expiry&&!Number.isNaN(expiry.getTime())&&expiry.getTime()>Date.now();
  banner.hidden=Boolean(activePremium);
  setAdVisibility(Boolean(activePremium));
 }
 updatePromotion().catch(()=>{banner.hidden=false;setAdVisibility(false);});
}catch{banner.hidden=false;setAdVisibility(false);}
})();
