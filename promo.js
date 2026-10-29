(() => {
const banner = document.getElementById('premiumPromo');

if (!banner) return;

// Show the promotion by default for logged-out visitors.
banner.hidden = false;

if (
!window.supabase ||
!window.SUPABASE_URL ||
!window.SUPABASE_PUBLISHABLE_KEY
) {
return;
}

try {
const client = window.supabase.createClient(
window.SUPABASE_URL,
window.SUPABASE_PUBLISHABLE_KEY
);

async function updatePromotion() {
  const {
    data: { user },
    error: authError
  } = await client.auth.getUser();

  if (authError || !user) {
    banner.hidden = false;
    return;
  }

  const { data: profile, error } = await client
    .from('profiles')
    .select('membership,premium_until')
    .eq('id', user.id)
    .maybeSingle();

  // Avoid showing an upgrade offer when membership cannot be checked.
  if (error || !profile) {
    banner.hidden = true;
    return;
  }

  const membership = String(
    profile.membership || 'free'
  ).toLowerCase();

  const expiry = profile.premium_until
    ? new Date(profile.premium_until)
    : null;

  const activePremium =
    membership === 'premium' &&
    expiry &&
    !Number.isNaN(expiry.getTime()) &&
    expiry.getTime() > Date.now();

  banner.hidden = Boolean(activePremium);
}

updatePromotion().catch(() => {
  // Keep the page functional if the membership lookup fails.
  banner.hidden = false;
});

} catch {
banner.hidden = false;
}
})();
