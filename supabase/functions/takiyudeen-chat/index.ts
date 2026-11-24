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
    // TAKIYUDEEN introduction
    [/\b(who are you|your name|what is your name|takiyudeen)\b/,
      "I am TAKIYUDEEN, your Arabic and Islamic learning assistant from Arabic Learning Dictionary. I can help you learn Arabic vocabulary, grammar, greetings and basic Islamic knowledge. What would you like to learn?"],

    // Greetings
         [/\\b(islamic greetings|arabic greetings|teach me.*greetings|greetings in arabic|how to greet in arabic)\\b/,
      "Here are some common Arabic and Islamic greetings:\\n\\n1. السَّلَامُ عَلَيْكُمْ (As-salāmu ʿalaykum) — Peace be upon you.\\n2. وَعَلَيْكُمُ السَّلَامُ (Wa ʿalaykumu s-salām) — And peace be upon you too.\\n3. صَبَاحُ الْخَيْرِ (Ṣabāḥ al-khayr) — Good morning.\\n4. صَبَاحُ النُّورِ (Ṣabāḥ an-nūr) — Good morning (reply).\\n5. مَسَاءُ الْخَيْرِ (Masāʾ al-khayr) — Good evening.\\n6. مَعَ السَّلَامَةِ (Maʿa as-salāmah) — Goodbye.\\n\\nRemember: Muslims commonly greet one another with As-salāmu ʿalaykum."],

    // Five Pillars
    [/\b(five pillars|pillars of islam)\b/,
      "The Five Pillars of Islam are:\n1. Shahādah – declaration of faith.\n2. Ṣalāh – the five daily prayers.\n3. Zakāh – obligatory charity for those who qualify.\n4. Ṣawm – fasting in Ramadan.\n5. Ḥajj – pilgrimage to Makkah for those able to perform it.\n\nWould you like to learn about one of these pillars?"],
    [/\b(shahada|shahādah|declaration of faith)\b|الشهادة/,
      "The Shahādah is the declaration of faith: لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ. It means: There is no deity worthy of worship except Allah, and Muhammad is the Messenger of Allah."],

    // Salah and Wudu
    [/\b(salah|salat|prayer|five daily prayers)\b|الصلاة/,
      "Ṣalāh (الصَّلَاةُ) is the obligatory Muslim prayer. Muslims perform five daily prayers: Fajr, Dhuhr, Asr, Maghrib and Isha. Would you like to learn their names and prayer times?"],
    [/\b(fajr|dhuhr|zuhr|asr|maghrib|isha)\b/,
      "The five daily prayers are Fajr, Dhuhr, Asr, Maghrib and Isha. Each has its own prescribed time. Would you like a simple lesson about the five prayers?"],
    [/\b(wudu|wudhu|ablution)\b|الوضوء/,
      "Wuḍū' (الْوُضُوءُ) is the washing performed before Ṣalāh. It includes washing the face, arms, wiping the head and washing the feet, with the required order and details taught in Islamic practice. Would you like a beginner lesson about Wudu?"],
    [/\b(qibla|qiblah)\b/,
      "The Qiblah (الْقِبْلَةُ) is the direction Muslims face when performing Ṣalāh. It is towards the Ka'bah in Makkah."],

    // Ramadan, Zakat and Hajj
    [/\b(ramadan|ramadhan)\b|رمضان/,
      "Ramadan (رَمَضَان) is the ninth month of the Islamic lunar calendar. Muslims who are required to fast abstain from food and drink from dawn until sunset. Ramadan is also a month of Qur'an, prayer and charity."],
    [/\b(fasting|sawm|siyam)\b|الصيام/,
      "Ṣawm (الصَّوْمُ) means fasting. Muslims fast during Ramadan from dawn until sunset, with exemptions and detailed rules in Islamic teachings."],
    [/\b(zakat|zakah|charity)\b|الزكاة/,
      "Zakāh (الزَّكَاةُ) is an obligatory form of charity for Muslims who meet its conditions. It helps eligible people in need. Its calculation depends on the type of wealth and applicable rules."],
    [/\b(hajj|pilgrimage)\b|الحج/,
      "Ḥajj (الْحَجُّ) is the pilgrimage to Makkah. It is an obligation once in a lifetime for Muslims who are physically and financially able to perform it."],
    [/\b(kaaba|ka'bah|kabah)\b/,
      "The Ka'bah (الْكَعْبَةُ) is the sacred building in Masjid al-Haram in Makkah. Muslims face its direction during prayer."],

    // Qur'an, Hadith and Duas
    [/\b(what is the quran|quran|qur'an)\b|القرآن/,
      "The Qur'an (الْقُرْآنُ) is the holy book of Islam, revealed to Prophet Muhammad ﷺ. Muslims recite, study and reflect on its teachings. Would you like to learn about the Qur'an?"],
    [/\b(what is hadith|hadith)\b|الحديث/,
      "Hadith (الْحَدِيثُ) refers to reports about the sayings, actions and approvals of Prophet Muhammad ﷺ. Hadith are studied with attention to their authenticity and scholarly explanations."],
    [/\b(dua|du'a|supplication)\b|دعاء/,
      "Duʿā' (الدُّعَاءُ) means calling upon Allah and asking Him for help, guidance or blessings. Would you like to learn a simple everyday du'a?"],
    [/\b(bismillah|basmala)\b|بسم الله/,
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ means 'In the name of Allah, the Most Compassionate, the Most Merciful.' بِسْمِ اللَّهِ (Bismillah) means 'In the name of Allah.'"],
    [/\b(inshallah|in sha allah)\b|إن شاء الله/,
      "إِنْ شَاءَ اللَّهُ (In shā' Allāh) means 'If Allah wills.'"],
    [/\b(alhamdulillah|al hamdulillah)\b|الحمد لله/,
      "الْحَمْدُ لِلَّهِ (Alḥamdulillāh) means 'All praise belongs to Allah.'"],
    [/\b(allahu akbar)\b|الله أكبر/,
      "اللَّهُ أَكْبَرُ (Allāhu Akbar) means 'Allah is the Greatest.'"],

    // Arabic vocabulary
    [/\b(kitab|kitaab|book)\b|كتاب/,
      "كِتَابٌ (kitābun) means 'a book.' Example: هٰذَا كِتَابٌ — This is a book."],
    [/\b(salam|salaam|peace)\b|سلام/,
      "سَلَامٌ (salāmun) means 'peace.' السَّلَامُ عَلَيْكُمْ means 'Peace be upon you.'"],
    [/\b(ilm|knowledge)\b|علم/,
      "عِلْمٌ (ʿilmun) means 'knowledge.' طَلَبُ الْعِلْمِ means 'seeking knowledge.'"],
    [/\b(madrasah|school)\b|مدرسة/,
      "مَدْرَسَةٌ (madrasatun) means 'school.'"],
    [/\b(masjid|mosque)\b|مسجد/,
      "مَسْجِدٌ (masjidun) means 'mosque.'"],
    [/\b(teacher|muallim)\b|معلم/,
      "مُعَلِّمٌ (muʿallimun) means 'male teacher.' مُعَلِّمَةٌ (muʿallimatun) means 'female teacher.'"],
    [/\b(student|talib|taliba)\b|طالب/,
      "طَالِبٌ (ṭālibun) means 'male student.' طَالِبَةٌ (ṭālibatun) means 'female student.'"],
    [/\b(mother)\b|أم/,
      "أُمٌّ (ummun) means 'mother.'"],
    [/\b(father)\b|أب/,
      "أَبٌ (abun) means 'father.'"],

    // Arabic alphabet and numbers
    [/\b(alphabet|arabic letters|letters)\b|الحروف/,
      "Arabic has 28 basic letters and is written from right to left. Let's begin:\nا — Alif\nب — Bā'\nت — Tā'\nث — Thā'\nج — Jīm\nح — Ḥā'\nخ — Khā'\n\nWould you like to continue with the next letters?"],
    [/\b(numbers?|count|one to ten)\b|الأرقام/,
      "Arabic numbers 1–10:\n١ — وَاحِد (wāḥid)\n٢ — اِثْنَان (ithnān)\n٣ — ثَلَاثَة (thalāthah)\n٤ — أَرْبَعَة (arbaʿah)\n٥ — خَمْسَة (khamsah)\n٦ — سِتَّة (sittah)\n٧ — سَبْعَة (sabʿah)\n٨ — ثَمَانِيَة (thamāniyah)\n٩ — تِسْعَة (tisʿah)\n١٠ — عَشَرَة (ʿasharah)"],
    [/\b(pronoun|ana|anta|anti|huwa|hiya)\b|أنا|أنت|هو|هي/,
      "Here are some Arabic pronouns:\nأَنَا (anā) — I\nأَنْتَ (anta) — You (masculine)\nأَنْتِ (anti) — You (feminine)\nهُوَ (huwa) — He\nهِيَ (hiya) — She\nنَحْنُ (naḥnu) — We\nTry making a short sentence with أَنَا."],
    [/\b(verb|past tense|present tense|grammar)\b/,
      "Arabic verbs change according to the subject and tense. For example:\nكَتَبَ (kataba) — He wrote.\nيَكْتُبُ (yaktubu) — He writes or is writing.\nWould you like another simple grammar example?"],

    // General Islamic questions
    [/\b(prophet muhammad|muhammad|prophet)\b|محمد/,
      "Prophet Muhammad ﷺ is the final Messenger of Allah in Islam. Muslims learn about his life, character and teachings through the Seerah and authentic Sunnah."],
    [/\b(halal|haram|fatwa|religious ruling)\b/,
      "I can explain general Islamic learning topics, but I cannot issue personal religious rulings. Questions about halal, haram or differences between scholarly opinions should be checked with a qualified and trusted Islamic scholar."],

    // Help and fallback topics
    [/\b(what can you do|help|topics|what do you know)\b/,
      "I can help you learn:\n• Arabic greetings and vocabulary\n• Arabic letters and numbers\n• Pronouns and beginner grammar\n• The Five Pillars of Islam\n• Salah, Wudu, Ramadan, Zakat and Hajj\n• General Qur'an, Hadith and du'a knowledge\n\nChoose a topic and ask me a question!"]
  ];

  for (const [pattern, response] of entries) {
    if (pattern.test(q)) return response;
  }

  return "I don't have a prepared answer for that exact question yet. I can help with Arabic greetings, vocabulary, letters, numbers, pronouns, grammar and basic Islamic learning. Try asking: 'What is Salah?', 'Teach me Arabic numbers', or 'What does Bismillah mean?'";
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
