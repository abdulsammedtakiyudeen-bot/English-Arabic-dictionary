/* Free-only manual ad loader.
   Ads are disabled until approval and valid publisher/slot IDs are configured.
   If membership cannot be verified, no ad request is made. */
(async function () {
  "use strict";
  const cfg = window.IALD_ADS_CONFIG || {};
  if (!cfg.enabled || !/^ca-pub-\d+$/.test(cfg.publisherId || "")) return;
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) return;

  let eligibleForAds = false;
  try {
    const client = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_PUBLISHABLE_KEY,
      { auth: { storage: window.localStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
    );
    const authResult = await client.auth.getUser();
    if (authResult.error) return;
    const user = authResult.data && authResult.data.user;

    // A confirmed anonymous visitor is a free visitor.
    if (!user) {
      eligibleForAds = true;
    } else {
      const profileResult = await client.from("profiles")
        .select("membership,premium_until")
        .eq("id", user.id)
        .maybeSingle();
      if (profileResult.error || !profileResult.data) return;

      const membership = String(profileResult.data.membership || "").toLowerCase();
      const expiry = profileResult.data.premium_until
        ? new Date(profileResult.data.premium_until).getTime()
        : 0;
      const activePremium = membership === "premium" && Number.isFinite(expiry) && expiry > Date.now();
      eligibleForAds = !activePremium;
    }
  } catch (error) {
    console.warn("Ad eligibility could not be verified; ads remain disabled.", error);
    return;
  }

  if (!eligibleForAds) return;
  const slots = document.querySelectorAll("[data-iald-ad]");
  if (!slots.length) return;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.publisherId);
  script.onload = () => {
    slots.forEach(slot => {
      const key = slot.getAttribute("data-iald-ad");
      const slotId = cfg.slots && cfg.slots[key];
      if (!/^\d+$/.test(slotId || "")) return;
      const ad = document.createElement("ins");
      ad.className = "adsbygoogle";
      ad.style.display = "block";
      ad.setAttribute("data-ad-client", cfg.publisherId);
      ad.setAttribute("data-ad-slot", slotId);
      ad.setAttribute("data-ad-format", "auto");
      ad.setAttribute("data-full-width-responsive", "true");
      slot.replaceChildren(ad);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
      catch (e) { console.warn("Ad unit could not be requested.", e); }
    });
  };
  document.head.appendChild(script);
})();
