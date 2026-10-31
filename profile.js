(() => {
const $ = id => document.getElementById(id);
const status = $('status');

if (
!window.supabase ||
!window.SUPABASE_URL ||
!window.SUPABASE_PUBLISHABLE_KEY
) {
status.textContent =
'Account service unavailable. Check config.js and your internet connection.';
return;
}

const client = window.supabase.createClient(
window.SUPABASE_URL,
window.SUPABASE_PUBLISHABLE_KEY
);

let currentUserId = null;
const AVATAR_BUCKET = 'avatars';
const avatarInput = $('avatarInput');
const avatarImage = $('avatarImage');
const avatarFallback = $('avatarFallback');

function showAvatar(url) {
  if (url) {
    avatarImage.src = url;
    avatarImage.hidden = false;
    avatarFallback.hidden = true;
  } else {
    avatarImage.hidden = true;
    avatarImage.removeAttribute('src');
    avatarFallback.hidden = false;
  }
}

async function loadAvatar(user) {
  const path = user.user_metadata?.avatar_path;
  if (!path) { showAvatar(''); return; }
  const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  showAvatar(data?.publicUrl || '');
}

async function uploadAvatar(file) {
  if (!file || !currentUserId) return;
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    status.textContent = 'Choose a JPG, PNG or WebP image.';
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    status.textContent = 'The image must be 3 MB or smaller.';
    return;
  }

  avatarInput.disabled = true;
  status.textContent = 'Uploading your profile picture…';
  try {
    const extension = file.type === 'image/png' ? 'png' :
      file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = currentUserId + '/avatar.' + extension;
    const { error: uploadError } = await client.storage
      .from(AVATAR_BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' });
    if (uploadError) throw uploadError;

    const { data: updateData, error: updateError } = await client.auth.updateUser({
      data: { ...( (await client.auth.getUser()).data.user?.user_metadata || {} ), avatar_path: path }
    });
    if (updateError) throw updateError;

    const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl(path);
    showAvatar(data?.publicUrl ? data.publicUrl + '?v=' + Date.now() : '');
    status.textContent = 'Profile picture updated successfully.';
  } catch (error) {
    console.error('Avatar upload failed:', error);
    status.textContent = 'Could not upload the picture. Check the Supabase Storage setup guide and try again.';
  } finally {
    avatarInput.disabled = false;
    avatarInput.value = '';
  }
}

function addDetail(container, label, value) {
const row = document.createElement('div');
row.className = 'detail-row';

const heading = document.createElement('strong');
heading.textContent = label;

const text = document.createElement('span');
text.textContent = value;

row.append(heading, text);
container.append(row);

}

function hideAccount() {
currentUserId = null;
$('loginLink').hidden = false;
$('signupLink').hidden = false;
$('logoutBtn').hidden = true;
$('editForm').hidden = true;
$('profileDetails').hidden = true;
$('membershipCard').hidden = true;
}

async function init() {
status.textContent = 'Loading your profile…';

const {
  data: { user },
  error: authError
} = await client.auth.getUser();

if (authError || !user) {
  hideAccount();
  status.textContent =
    'You are not logged in. Log in or create an account to view your profile.';
  return;
}

currentUserId = user.id;
await loadAvatar(user);
$('loginLink').hidden = true;
$('signupLink').hidden = true;
$('logoutBtn').hidden = false;
$('editForm').hidden = false;

const { data: profile, error } = await client
  .from('profiles')
  .select('email,display_name,membership,premium_until,created_at')
  .eq('id', user.id)
  .maybeSingle();

if (error) {
  $('profileDetails').hidden = true;
  $('membershipCard').hidden = true;
  status.textContent =
    'Your account is signed in, but profile details could not be loaded.';
  return;
}

if (!profile) {
  $('profileDetails').hidden = true;
  $('membershipCard').hidden = true;
  status.textContent =
    'Your profile record was not found. Please contact support.';
  return;
}

const name = (
  profile.display_name ||
  user.user_metadata?.display_name ||
  ''
).trim();

$('displayName').value = name;

const details = $('profileDetails');
details.replaceChildren();
details.hidden = false;

addDetail(details, 'Name', name || 'Not set');
addDetail(details, 'Email', user.email || profile.email || 'Not available');

const joined = user.created_at || profile.created_at;
addDetail(
  details,
  'Joined',
  joined && !Number.isNaN(new Date(joined).getTime())
    ? new Date(joined).toLocaleDateString()
    : 'Not available'
);

const membership = String(profile.membership || 'free').toLowerCase();
const expiry = profile.premium_until
  ? new Date(profile.premium_until)
  : null;

const validExpiry = expiry && !Number.isNaN(expiry.getTime());
const premiumActive =
  membership === 'premium' &&
  validExpiry &&
  expiry.getTime() > Date.now();

const title = $('membershipTitle');
const message = $('membershipMessage');
const expiryDetails = $('expiryDetails');
const premiumLink = $('premiumLink');

$('membershipCard').hidden = false;
expiryDetails.hidden = true;
premiumLink.hidden = false;

let membershipLabel;

if (premiumActive) {
  membershipLabel = 'Premium — Active';
  title.textContent = '⭐ Premium Active';
  message.textContent =
    'Your account currently has an active Premium membership.';
  expiryDetails.textContent =
    'Membership expires: ' + expiry.toLocaleDateString();
  expiryDetails.hidden = false;
  premiumLink.textContent = 'View Premium Plans';
} else if (membership === 'premium' && !validExpiry) {
  membershipLabel = 'Premium — Needs checking';
  title.textContent = 'Premium Status Needs Checking';
  message.textContent =
    'Your profile says Premium, but its expiry date is missing or invalid. Please contact support to check your membership.';
  premiumLink.textContent = 'View Premium Plans';
} else if (
  membership === 'premium' &&
  validExpiry &&
  expiry.getTime() <= Date.now()
) {
  membershipLabel = 'Premium — Expired';
  title.textContent = 'Premium Expired';
  message.textContent =
    'Your recorded Premium membership has expired. You can review the available plans to renew.';
  expiryDetails.textContent =
    'Expiry date: ' + expiry.toLocaleDateString();
  expiryDetails.hidden = false;
  premiumLink.textContent = 'Renew Premium';
} else {
  membershipLabel = 'Free';
  title.textContent = 'Free Membership';
  message.textContent =
    'You currently have free membership. Explore the Premium plans for additional learning access.';
  premiumLink.textContent = 'Explore Premium Plans';
}

addDetail(details, 'Membership', membershipLabel);
status.textContent = 'Your profile loaded successfully.';

}

$('editForm').addEventListener('submit', async event => {
event.preventDefault();

const {
  data: { user },
  error: authError
} = await client.auth.getUser();

if (authError || !user || user.id !== currentUserId) {
  status.textContent = 'Please log in again before saving your name.';
  return;
}

const name = $('displayName').value.trim();

if (name.length > 80) {
  status.textContent = 'Your name must be 80 characters or fewer.';
  return;
}

const button = $('editForm').querySelector('button[type="submit"]');
button.disabled = true;
status.textContent = 'Saving your name…';

try {
  const { error } = await client
    .from('profiles')
    .update({ display_name: name })
    .eq('id', user.id);

  if (error) {
    status.textContent =
      'Could not save your name. Please try again.';
    return;
  }

  const { error: metadataError } = await client.auth.updateUser({
    data: { display_name: name }
  });

  status.textContent = metadataError
    ? 'Name saved to your profile, but account metadata could not be updated.'
    : 'Profile updated successfully.';

  await init();
} finally {
  button.disabled = false;
}

});

avatarInput?.addEventListener('change', event => {
  uploadAvatar(event.target.files?.[0]);
});

$('logoutBtn').addEventListener('click', async () => {
const button = $('logoutBtn');
button.disabled = true;
status.textContent = 'Logging out…';

const { error } = await client.auth.signOut();

if (error) {
  button.disabled = false;
  status.textContent = 'Could not log out. Please try again.';
  return;
}

location.href = './login.html';

});

init().catch(() => {
status.textContent =
'Could not load your profile. Check your internet connection and try again.';
});
})();

\n// If a stored image cannot be loaded, show the default avatar rather than a broken image.
avatarImage?.addEventListener('error', () => {
  avatarImage.hidden = true;
  avatarFallback.hidden = false;
});
