/* Free-only manual ad loader. Premium users never load the AdSense script.
   Empty configuration means no ad requests are made. */
(async function () {
  const cfg = window.IALD_ADS_CONFIG || {};
  if (!cfg.enabled || !/^ca-pub-\d+$/.test(cfg.publisherId || "")) return;

  let premium = false;
  try {
    if (window.supabase && window.SUPABASE_URL && window.SUPABASE_PUBLISHABLE_KEY) {
      const client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY);
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        const { data } = await client.from("profiles")
          .select("membership,premium_until").eq("id", user.id).maybeSingle();
        const expiry = data?.premium_until ? new Date(data.premium_until).getTime() : 0;
        premium = String(data?.membership || "").toLowerCase() === "premium" && expiry > Date.now();
      }
    }
  } catch (error) {
    console.warn("Ad eligibility could not be checked; ads remain disabled on this page.", error);
    return;
  }
  if (premium) return;

  const slots = document.querySelectorAll("[data-iald-ad]");
  if (!slots.length) return;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.publisherId);
  script.onload = () => {
    slots.forEach(slot => {
      const key = slot.getAttribute("data-iald-ad");
      const slotId = cfg.slots?.[key];
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
