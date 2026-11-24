import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function answerQuestion(raw: string): string {
  const q = raw.toLowerCase().trim();

  const entries: Array<[RegExp, string]> = [
    [/\b(hello|hi|hey|assalamu|salaam|salam)\b|السلام عليكم/, "Wa ʿalaykum as-salām! أهلاً وسهلاً — welcome. What Arabic word or topic shall we learn today?"],
    [/\b(thank you|thanks|shukran)\b|شكرا/, "You’re welcome! عَفْوًا (ʿafwan) means “you’re welcome.”"],
    [/\b(good morning)\b/, "صَبَاحُ الْخَيْرِ (ṣabāḥ al-khayr) — Good morning. A common reply is صَبَاحُ النُّورِ (ṣabāḥ an-nūr)."],
    [/\b(goodbye|bye|ma.?a.?salam)\b/, "مَعَ السَّلَامَةِ (maʿa as-salāmah) — Goodbye / go in peace."],
    [/\b(what is|meaning of|translate)\s+(kitab|كتاب)\b|كتاب/, "كِتَاب (kitāb) means “book.” Example: هٰذَا كِتَابٌ — This is a book."],
    [/\b(what is|meaning of|translate)\s+(salam|سلام)\b|سلام/, "سَلَام (salām) means “peace.” السَّلَامُ عَلَيْكُمْ means “Peace be upon you.”"],
    [/\b(what is|meaning of|translate)\s+(ilm|علم)\b|علم/, "عِلْم (ʿilm) means “knowledge.” طَلَبُ الْعِلْمِ means “seeking knowledge.”"],
    [/\b(pronoun|ana|anta|anti|huwa|hiya)\b|أنا|أنت|هو|هي/, "Some Arabic pronouns:\n• أَنَا (anā) — I\n• أَنْتَ (anta) — you (masculine)\n• أَنْتِ (anti) — you (feminine)\n• هُوَ (huwa) — he\n• هِيَ (hiya) — she\nTry making a short sentence with أَنَا."],
    [/\b(verb|past tense|present tense|grammar)\b/, "A beginner grammar tip: Arabic verbs change according to the subject and tense. For example كَتَبَ (kataba) means “he wrote”; يَكْتُبُ (yaktubu) means “he writes / is writing.”"],
    [/\b(numbers?|count|one to ten)\b|الأرقام/, "Arabic numbers 1–10:\n١ وَاحِد (wāḥid)\n٢ اِثْنَان (ithnān)\n٣ ثَلَاثَة (thalāthah)\n٤ أَرْبَعَة (arbaʿah)\n٥ خَمْسَة (khamsah)\n٦ سِتَّة (sittah)\n٧ سَبْعَة (sabʿah)\n٨ ثَمَانِيَة (thamāniyah)\n٩ تِسْعَة (tisʿah)\n١٠ عَشَرَة (ʿasharah)"],
    [/\b(five pillars|pillars of islam)\b/, "The five pillars of Islam are: (1) Shahādah, (2) Ṣalāh, (3) Zakāh, (4) Ṣawm in Ramadan, and (5) Ḥajj for those who are able. This is a basic summary; study each pillar with a trusted teacher."],
    [/\b(dua|du'a|supplication|before eating)\b|دعاء/, "A commonly taught supplication before eating is: بِسْمِ اللَّهِ (Bismillāh) — “In the name of Allah.” Say it before beginning a meal."],
    [/\b(bismillah|basmala)\b|بسم الله/, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (Bismillāhi r-raḥmāni r-raḥīm) — “In the name of Allah, the Most Compassionate, the Most Merciful.” It is the opening phrase of most Qur’an chapters."],
    [/\b(quran|qur'an|hadith|fatwa|ruling|halal|haram)\b|القرآن|حديث/, "I can give simple learning notes, but I’m not a mufti and may not settle religious differences. For a precise Qur’an or Hadith reference, or a personal halal/haram ruling, please check the original source with a qualified teacher or scholar. You can ask me about a general beginner topic."],
    [/\b(lesson|start arabic|learn arabic|alphabet|letters)\b|الحروف/, "Let’s begin with three Arabic letters:\nا — Alif\nب — Bā’\nت — Tā’\nRead them from right to left. Would you like to practise letter sounds or learn greetings next?"],
    [/\b(who are you|your name|takiyudeen)\b/, "I’m TAKIYUDEEN, the programmed Arabic and Islamic learning assistant for Arabic Learning Dictionary. I help with beginner vocabulary, simple grammar and general learning questions."]
  ];

  for (const [pattern, response] of entries) {
    if (pattern.test(q)) return response;
  }
  return "I’m still learning this topic. I can currently help with beginner Arabic greetings, vocabulary, pronouns, numbers, simple grammar and basic Islamic learning. Try asking: “What does kitāb mean?” or “Teach me Arabic pronouns.”";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Please sign in before using TAKIYUDEEN." }, 401);

  let payload: { question?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Please send a valid question." }, 400);
  }

  const question = typeof payload.question === "string" ? payload.question.trim() : "";
  if (!question || question.length > 1000) {
    return json({ error: "Your question must be between 1 and 1000 characters." }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ error: "The chatbot server is not fully configured." }, 500);
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) return json({ error: "Your session is invalid or expired. Please sign in again." }, 401);

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("membership,premium_until")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError) return json({ error: "Could not verify your membership. Please try again later." }, 500);

  const membership = String(profile?.membership || "free").toLowerCase();
  const premiumUntil = profile?.premium_until ? new Date(profile.premium_until).getTime() : null;
  const premium = membership === "premium" && (premiumUntil === null || premiumUntil > Date.now());

  if (premium) return json({ answer: answerQuestion(question), premium: true });

  const { data: usage, error: usageError } = await admin.rpc("consume_chatbot_question", {
    p_user_id: userData.user.id,
    p_limit: 10,
  });

  if (usageError || !usage || !usage.length) {
    return json({ error: "Could not check your daily question allowance. Please try again later." }, 500);
  }
  const result = usage[0];
  if (!result.allowed) {
    return json({
      error: "You’ve used your 10 free TAKIYUDEEN questions for today. You can continue tomorrow or upgrade to Premium for unlimited access.",
      remaining: 0,
      premium: false,
    }, 429);
  }

  return json({
    answer: answerQuestion(question),
    premium: false,
    used: result.used,
    remaining: result.remaining,
  });
});
