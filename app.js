(() => {
"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const store = {
  get(key, fallback) { try { const raw = localStorage.getItem("iald_" + key); return raw === null ? fallback : JSON.parse(raw); } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem("iald_" + key, JSON.stringify(value)); } catch {} }
};
const FALLBACK_WORDS = [{"id":"salam","arabic":"سَلَام","english":"Peace","definition":"Peace, safety, or a greeting expressing peace.","example_ar":"السَّلَامُ عَلَيْكُمْ","example_en":"Peace be upon you.","category":"Greeting"},{"id":"marhaba","arabic":"مَرْحَبًا","english":"Hello / Welcome","definition":"A common greeting meaning hello or welcome.","example_ar":"مَرْحَبًا بِكَ","example_en":"Welcome.","category":"Greeting"},{"id":"shukran","arabic":"شُكْرًا","english":"Thank you","definition":"A polite expression of thanks.","example_ar":"شُكْرًا جَزِيلًا","example_en":"Thank you very much.","category":"Everyday"},{"id":"afwan","arabic":"عَفْوًا","english":"You're welcome","definition":"Often used to respond to thanks; it can also mean pardon or excuse me.","example_ar":"عَفْوًا","example_en":"You're welcome.","category":"Everyday"},{"id":"naam","arabic":"نَعَمْ","english":"Yes","definition":"Used to give an affirmative answer.","example_ar":"نَعَمْ، أَفْهَمُ","example_en":"Yes, I understand.","category":"Basics"},{"id":"la","arabic":"لَا","english":"No","definition":"Used to give a negative answer.","example_ar":"لَا، شُكْرًا","example_en":"No, thank you.","category":"Basics"},{"id":"min-fadlik","arabic":"مِنْ فَضْلِكَ","english":"Please (to a man)","definition":"A polite way to say please when addressing a man; feminine: مِنْ فَضْلِكِ.","example_ar":"مَاءٌ مِنْ فَضْلِكَ","example_en":"Water, please.","category":"Everyday"},{"id":"maa","arabic":"مَاء","english":"Water","definition":"Water; a basic everyday noun.","example_ar":"أُرِيدُ مَاءً","example_en":"I want water.","category":"Everyday"},{"id":"bayt","arabic":"بَيْت","english":"House / Home","definition":"A house or home.","example_ar":"هَذَا بَيْتِي","example_en":"This is my house.","category":"Everyday"},{"id":"kitab","arabic":"كِتَاب","english":"Book","definition":"A book; the plural is كُتُب (kutub).","example_ar":"هَذَا كِتَابٌ","example_en":"This is a book.","category":"Learning"},{"id":"qalam","arabic":"قَلَم","english":"Pen","definition":"A pen used for writing.","example_ar":"هَذَا قَلَمٌ","example_en":"This is a pen.","category":"Learning"},{"id":"ilm","arabic":"عِلْم","english":"Knowledge","definition":"Knowledge or learning; an important concept in Islamic tradition.","example_ar":"طَلَبُ الْعِلْمِ","example_en":"Seeking knowledge.","category":"Islamic"},{"id":"iman","arabic":"إِيمَان","english":"Faith","definition":"Faith or belief; precise theological use depends on context.","example_ar":"الْإِيمَانُ","example_en":"Faith.","category":"Islamic"},{"id":"islam","arabic":"إِسْلَام","english":"Islam","definition":"Islam; religious meaning is shaped by context and scholarly explanation.","example_ar":"الْإِسْلَامُ دِينِي","example_en":"Islam is my religion.","category":"Islamic"},{"id":"salah","arabic":"صَلَاة","english":"Prayer","definition":"In Islamic usage, especially the prescribed ritual prayer.","example_ar":"وَقْتُ الصَّلَاةِ","example_en":"Prayer time.","category":"Islamic"},{"id":"masjid","arabic":"مَسْجِد","english":"Mosque","definition":"A mosque; a place where Muslims pray.","example_ar":"أَذْهَبُ إِلَى الْمَسْجِدِ","example_en":"I go to the mosque.","category":"Islamic"},{"id":"quran","arabic":"قُرْآن","english":"Qur'an","definition":"The Qur'an, Islam's holy scripture. This vocabulary entry is not tafsir.","example_ar":"الْقُرْآنُ الْكَرِيمُ","example_en":"The Noble Qur'an.","category":"Islamic"},{"id":"dua","arabic":"دُعَاء","english":"Supplication","definition":"A supplication or personal prayer asking Allah for help or blessing.","example_ar":"أَدْعُو اللَّهَ","example_en":"I supplicate to Allah.","category":"Islamic"},{"id":"allah","arabic":"اللَّه","english":"Allah / God","definition":"The Arabic name for God.","example_ar":"الْحَمْدُ لِلَّهِ","example_en":"Praise belongs to Allah.","category":"Islamic"},{"id":"rahma","arabic":"رَحْمَة","english":"Mercy","definition":"Mercy, compassion, or kindness; meaning depends on context.","example_ar":"رَحْمَةُ اللَّهِ","example_en":"The mercy of Allah.","category":"Islamic"},{"id":"sabr","arabic":"صَبْر","english":"Patience","definition":"Patience, perseverance, or steadfastness.","example_ar":"الصَّبْرُ جَمِيلٌ","example_en":"Patience is beautiful.","category":"Islamic"},{"id":"jannah","arabic":"جَنَّة","english":"Garden / Paradise","definition":"Literally a garden; in Islamic contexts it can refer to Paradise.","example_ar":"الْجَنَّةُ","example_en":"Paradise.","category":"Islamic"},{"id":"sadaqah","arabic":"صَدَقَة","english":"Charity","definition":"Voluntary charity or a charitable act.","example_ar":"الصَّدَقَةُ","example_en":"Charity.","category":"Islamic"},{"id":"muslim","arabic":"مُسْلِم","english":"Muslim","definition":"A Muslim; the feminine form is مُسْلِمَة.","example_ar":"أَنَا مُسْلِمٌ","example_en":"I am a Muslim (masculine form).","category":"Islamic"},{"id":"sabah","arabic":"صَبَاح","english":"Morning","definition":"Morning; often used in greetings.","example_ar":"صَبَاحُ الْخَيْرِ","example_en":"Good morning.","category":"Everyday"},{"id":"layl","arabic":"لَيْل","english":"Night","definition":"Night or nighttime.","example_ar":"اللَّيْلُ هَادِئٌ","example_en":"The night is quiet.","category":"Everyday"},{"id":"yawm","arabic":"يَوْم","english":"Day","definition":"A day.","example_ar":"يَوْمٌ جَمِيلٌ","example_en":"A beautiful day.","category":"Everyday"},{"id":"ana","arabic":"أَنَا","english":"I","definition":"The first-person singular pronoun: I.","example_ar":"أَنَا طَالِبٌ","example_en":"I am a male student.","category":"Basics"},{"id":"anta","arabic":"أَنْتَ","english":"You (masculine)","definition":"Singular 'you' when addressing a male; feminine: أَنْتِ.","example_ar":"أَنْتَ صَدِيقِي","example_en":"You are my friend (to a man).","category":"Basics"},{"id":"sadiq","arabic":"صَدِيق","english":"Friend","definition":"A male friend; feminine: صَدِيقَة.","example_ar":"هُوَ صَدِيقِي","example_en":"He is my friend.","category":"Everyday"},{"id":"madrasah","arabic":"مَدْرَسَة","english":"School","definition":"A school or place of learning.","example_ar":"هَذِهِ مَدْرَسَتِي","example_en":"This is my school.","category":"Learning"},{"id":"ustadh","arabic":"أُسْتَاذ","english":"Teacher","definition":"A teacher or instructor; feminine: أُسْتَاذَة.","example_ar":"هُوَ أُسْتَاذٌ","example_en":"He is a teacher.","category":"Learning"},{"id":"talib","arabic":"طَالِب","english":"Student (masculine)","definition":"A male student; feminine: طَالِبَة.","example_ar":"أَنَا طَالِبٌ","example_en":"I am a male student.","category":"Learning"},{"id":"sadiqah","arabic":"صَدِيقَة","english":"Female friend","definition":"A female friend.","example_ar":"هِيَ صَدِيقَتِي","example_en":"She is my friend.","category":"Everyday"},{"id":"afiyah","arabic":"عَافِيَة","english":"Well-being","definition":"Well-being or good health; common expressions vary by region and context.","example_ar":"بِصِحَّةٍ وَعَافِيَةٍ","example_en":"In health and well-being.","category":"Everyday"},{"id":"sukranallah","arabic":"الْحَمْدُ لِلَّهِ","english":"Praise be to Allah","definition":"An expression of praise and gratitude to Allah.","example_ar":"الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ","example_en":"Praise be to Allah in every situation.","category":"Islamic"},{"id":"bismillah","arabic":"بِسْمِ اللَّهِ","english":"In the name of Allah","definition":"A phrase said before beginning something, meaning 'In the name of Allah'.","example_ar":"بِسْمِ اللَّهِ أَبْدَأُ","example_en":"In the name of Allah, I begin.","category":"Islamic"},{"id":"inshallah","arabic":"إِنْ شَاءَ اللَّهُ","english":"If Allah wills","definition":"An expression used when speaking about a future intention, God willing.","example_ar":"سَأَتَعَلَّمُ الْعَرَبِيَّةَ إِنْ شَاءَ اللَّهُ","example_en":"I will learn Arabic, if Allah wills.","category":"Islamic"},{"id":"salaam-alaikum","arabic":"السَّلَامُ عَلَيْكُمْ","english":"Peace be upon you","definition":"The common Muslim greeting meaning 'Peace be upon you'.","example_ar":"وَعَلَيْكُمُ السَّلَامُ","example_en":"And peace be upon you too.","category":"Greeting"}];
let words = [];
let favorites = store.get("favorites", []);
let learned = store.get("learned", []);
let correctAnswers = store.get("correctAnswers", 0);
let lastOnlineQuery = "";
let quiz = { questions: [], index: 0, score: 0, answered: false };

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
}
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function saveStats() {
  $("#favCount").textContent = favorites.length;
  $("#learnedCount").textContent = learned.length;
  $("#quizCount").textContent = correctAnswers;
  store.set("favorites", favorites);
  store.set("learned", learned);
  store.set("correctAnswers", correctAnswers);
}
function wordCard(w) {
  const saved = favorites.includes(w.id);
  const learnt = learned.includes(w.id);
  return `<article class="word-card">
    <div>
      <div class="word-top"><span class="english">${esc(w.english)}</span><h3 lang="ar" dir="rtl">${esc(w.arabic)}</h3></div>
      <p>${esc(w.definition)}</p>
      ${w.example_ar ? `<p class="example-ar" lang="ar" dir="rtl">${esc(w.example_ar)}</p>` : ""}
      ${w.example_en ? `<p>${esc(w.example_en)}</p>` : ""}
      <span class="tag">${esc(w.category || "Vocabulary")}${learnt ? " · Learned" : ""}</span>
    </div>
    <div class="word-actions">
      <button class="mini-btn" type="button" data-audio="${esc(w.arabic)}" aria-label="Speak Arabic word" title="Speak Arabic word">🔊</button>
      <button class="mini-btn" type="button" data-fav="${esc(w.id)}" aria-label="${saved ? "Remove saved word" : "Save word"}" title="${saved ? "Remove saved word" : "Save word"}">${saved ? "★" : "☆"}</button>
      <button class="mini-btn" type="button" data-learn="${esc(w.id)}" aria-label="Toggle learned status" title="Mark learned">${learnt ? "✓" : "＋"}</button>
    </div>
  </article>`;
}
function renderWords(list, target) {
  target.innerHTML = list.length ? list.map(wordCard).join("") : '<p class="empty-state">Nothing here yet. Save a word from the dictionary or try another search.</p>';
}
function showResults(query) {
  const section = $("#resultsSection");
  const q = query.trim().toLocaleLowerCase();
  $("#clearSearch").hidden = !q;
  if (!q) { section.hidden = true; $("#onlineStatus").textContent = ""; return; }
  section.hidden = false;
  const found = words.filter(w => [w.english, w.arabic, w.definition, w.category, w.example_en, w.example_ar].some(v => String(v || "").toLocaleLowerCase().includes(q)));
  $("#resultCount").textContent = `${found.length} ${found.length === 1 ? "entry" : "entries"}`;
  renderWords(found, $("#results"));
  $("#noResults").hidden = found.length !== 0;
  $("#onlineSearchBtn").hidden = found.length !== 0;
  lastOnlineQuery = query.trim();
  $("#onlineStatus").textContent = "";
}
function showView(view) {
  const section = $("#viewSection"), content = $("#viewContent");
  section.hidden = false;
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.nav === view));
  const titles = {
    islamic: ["ISLAMIC VOCABULARY", "Islamic words"],
    lessons: ["LEARN STEP BY STEP", "Mini lessons"],
    quiz: ["PRACTISE", "Arabic quick quiz"],
    favorites: ["YOUR COLLECTION", "Saved words"]
  };
  $("#viewEyebrow").textContent = (titles[view] || titles.islamic)[0];
  $("#viewTitle").textContent = (titles[view] || titles.islamic)[1];
  if (view === "islamic") renderWords(words.filter(w => w.category === "Islamic"), content);
  else if (view === "favorites") renderWords(words.filter(w => favorites.includes(w.id)), content);
  else if (view === "lessons") renderLessons(content);
  else if (view === "quiz") startQuiz(content);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}
function renderLessons(target) {
  const lessons = [
    {title:"1. Arabic Alphabet", ar:"أَبْجَدِيَّةُ الْعَرَبِيَّةِ", translit:"Abjadiyyat al-ʿarabiyyah", body:"Arabic is written from right to left. Learn the 28 letters and practise recognising each letter in its beginning, middle and end forms. Start with a few letters at a time."},
    {title:"2. Short Vowels", ar:"بَ · بِ · بُ", translit:"Ba · Bi · Bu", body:"The fatḥah (َ) usually gives a short a sound, the kasrah (ِ) a short i sound, and the ḍammah (ُ) a short u sound. These marks are written above or below a letter."},
    {title:"3. Greetings and Introductions", ar:"السَّلَامُ عَلَيْكُمْ، مَا اسْمُكَ؟", translit:"As-salāmu ʿalaykum, mā ismuka?", body:"السَّلَامُ عَلَيْكُمْ means “Peace be upon you.” مَا اسْمُكَ؟ asks a male “What is your name?” To ask a female, say مَا اسْمُكِ؟ A reply can be اسْمِي ... (ismī ...), “My name is ...”."},
    {title:"4. Pronouns", ar:"أَنَا · أَنْتَ · أَنْتِ · هُوَ · هِيَ", translit:"Anā · anta · anti · huwa · hiya", body:"أَنَا means I; أَنْتَ means you when speaking to a male; أَنْتِ means you when speaking to a female; هُوَ means he; and هِيَ means she."},
    {title:"5. Masculine and Feminine", ar:"طَالِبٌ · طَالِبَةٌ", translit:"Ṭālibun · ṭālibatun", body:"طَالِبٌ means a male student and طَالِبَةٌ means a female student. Many feminine nouns end in ة (tāʾ marbūṭah), though not every word follows this pattern."},
    {title:"6. Singular and Plural", ar:"كِتَابٌ · كُتُبٌ", translit:"Kitābun · kutubun", body:"كِتَابٌ means one book; كُتُبٌ means books. Arabic plurals can change the inside of a word, so learn common singular and plural forms together."},
    {title:"7. Numbers", ar:"وَاحِدٌ، اِثْنَانِ، ثَلَاثَةٌ", translit:"Wāḥidun, ithnān, thalāthatun", body:"These are one, two and three. Practise counting objects around you. Number forms can change with grammar and the noun being counted."},
    {title:"8. Asking Questions", ar:"مَا هَذَا؟ أَيْنَ الْبَيْتُ؟", translit:"Mā hādhā? Ayna al-bayt?", body:"مَا means what and أَيْنَ means where. مَا هَذَا؟ means “What is this?” أَيْنَ الْبَيْتُ؟ means “Where is the house?”"},
    {title:"9. Family Vocabulary", ar:"أَبٌ · أُمٌّ · أَخٌ · أُخْتٌ", translit:"Abun · ummun · akhun · ukhtun", body:"أَبٌ means father, أُمٌّ means mother, أَخٌ means brother, and أُخْتٌ means sister. Make short phrases such as هَذَا أَبِي (This is my father)."},
    {title:"10. Everyday Conversation", ar:"كَيْفَ حَالُكَ؟ أَنَا بِخَيْرٍ، شُكْرًا", translit:"Kayfa ḥāluka? Anā bikhayrin, shukran", body:"كَيْفَ حَالُكَ؟ asks a male “How are you?” For a female, say كَيْفَ حَالُكِ؟ أَنَا بِخَيْرٍ، شُكْرًا means “I am well, thank you.”"},
    {title:"11. Building Simple Sentences", ar:"هَذَا كِتَابٌ · الْبَيْتُ كَبِيرٌ", translit:"Hādhā kitābun · al-baytu kabīrun", body:"هَذَا كِتَابٌ means “This is a book.” الْبَيْتُ كَبِيرٌ means “The house is big.” Arabic simple sentences often do not need a separate word for “is” in the present tense."},
    {title:"12. Common Verbs", ar:"أَكْتُبُ · أَقْرَأُ · أَذْهَبُ", translit:"Aktubu · aqraʾu · adhhabu", body:"أَكْتُبُ means I write, أَقْرَأُ means I read, and أَذْهَبُ means I go. Practise saying what you do each day using أَنَا (I)."},
    {title:"13. Present-Tense Sentences", ar:"أَنَا أَدْرُسُ الْعَرَبِيَّةَ", translit:"Anā adrusu al-ʿarabiyyah", body:"This means “I study Arabic.” The verb أَدْرُسُ means “I study.” You can change the verb to match the subject; for example, هُوَ يَدْرُسُ means “He studies.”"},
    {title:"14. Past-Tense Sentences", ar:"دَرَسْتُ الْيَوْمَ", translit:"Darastu al-yawma", body:"دَرَسْتُ means “I studied.” Arabic past-tense verb endings change according to who performed the action. الْيَوْمَ means “today,” though the full sentence may depend on context."},
    {title:"15. Negation", ar:"لَا أَفْهَمُ · لَا أَعْرِفُ", translit:"Lā afhamu · lā aʿrifu", body:"لَا أَفْهَمُ means “I do not understand.” لَا أَعْرِفُ means “I do not know.” Use لَا before many present-tense verbs to make a simple negative sentence."},
    {title:"16. Asking for Directions", ar:"أَيْنَ الْمَسْجِدُ؟", translit:"Ayna al-masjid?", body:"This means “Where is the mosque?” أَيْنَ الْمَدْرَسَةُ؟ means “Where is the school?” Learn direction words such as يَمِينٌ (right) and يَسَارٌ (left)."},
    {title:"17. Shopping Conversations", ar:"بِكَمْ هَذَا؟ أُرِيدُ هَذَا", translit:"Bikam hādhā? Urīdu hādhā", body:"بِكَمْ هَذَا؟ means “How much is this?” أُرِيدُ هَذَا means “I want this.” Use مِنْ فَضْلِكَ (min faḍlika) to say “please” when speaking to a male; use مِنْ فَضْلِكِ when speaking to a female."},
    {title:"18. School Conversations", ar:"أَيْنَ الْفَصْلُ؟ أَنَا طَالِبٌ", translit:"Ayna al-faṣlu? Anā ṭālibun", body:"أَيْنَ الْفَصْلُ؟ means “Where is the classroom?” أَنَا طَالِبٌ means “I am a male student”; a female student says أَنَا طَالِبَةٌ. Practise naming books, pens and teachers."},
    {title:"19. Common Islamic Expressions", ar:"الْحَمْدُ لِلَّهِ · إِنْ شَاءَ اللَّهُ · جَزَاكَ اللَّهُ خَيْرًا", translit:"Al-ḥamdu lillāh · in shāʾ Allāh · jazāk Allāhu khayran", body:"الْحَمْدُ لِلَّهِ means “Praise belongs to Allah.” إِنْ شَاءَ اللَّهُ means “If Allah wills.” جَزَاكَ اللَّهُ خَيْرًا means “May Allah reward you with good” when addressing a male; forms differ depending on whom you address."},
    {title:"20. Revision and Practice", ar:"اِسْمِي ... · أَنَا أَتَعَلَّمُ الْعَرَبِيَّةَ", translit:"Ismī ... · Anā ataʿallamu al-ʿarabiyyah", body:"Review the alphabet, vowels, greetings, pronouns, numbers and common verbs. اِسْمِي ... means “My name is ...” and أَنَا أَتَعَلَّمُ الْعَرَبِيَّةَ means “I am learning Arabic.” Try making three new sentences using words from the dictionary."}
  ];
  target.innerHTML = `<div class="lesson-list">${lessons.map(l => `<article class="lesson"><h3>${esc(l.title)}</h3><p class="arabic" lang="ar" dir="rtl">${esc(l.ar)}</p><p><strong>${esc(l.translit)}</strong></p><p>${esc(l.body)}</p><button class="button button-outline" type="button" data-audio="${esc(l.ar)}">🔊 Listen</button></article>`).join("")}</div>`;
}
function startQuiz(target) {
  const pool = shuffle(words.filter(w => w.category !== "Online translation"));
  quiz = { questions: pool.slice(0, Math.min(10, pool.length)), index: 0, score: 0, answered: false };
  renderQuizQuestion(target);
}
function renderQuizQuestion(target) {
  if (quiz.index >= quiz.questions.length) {
    target.innerHTML = `<div class="quiz-card"><p class="eyebrow">QUIZ COMPLETE</p><h3>You scored ${quiz.score} out of ${quiz.questions.length}</h3><p class="muted">Correct answers are saved in your progress counter.</p><button class="button button-gold" type="button" data-quiz-restart>Try another quiz</button></div>`;
    return;
  }
  const item = quiz.questions[quiz.index];
  const options = shuffle([item, ...shuffle(words.filter(w => w.id !== item.id)).slice(0, 3)]);
  quiz.currentOptions = options;
  target.innerHTML = `<div class="quiz-card"><p class="quiz-progress">Question ${quiz.index + 1} of ${quiz.questions.length} · Score ${quiz.score}</p><p class="quiz-question">What does <span lang="ar" dir="rtl" style="font:26px Amiri">${esc(item.arabic)}</span> mean?</p><div class="quiz-options">${options.map(opt => `<button class="quiz-option" type="button" data-answer="${esc(opt.id)}">${esc(opt.english)}</button>`).join("")}</div><p id="quizFeedback" class="quiz-feedback" role="status" aria-live="polite"></p><button id="quizNext" class="button button-gold" type="button" hidden>${quiz.index + 1 === quiz.questions.length ? "See result" : "Next question"}</button></div>`;
}
function answerQuiz(id) {
  if (quiz.answered) return;
  quiz.answered = true;
  const correct = quiz.questions[quiz.index];
  const isCorrect = id === correct.id;
  if (isCorrect) { quiz.score++; correctAnswers++; saveStats(); }
  $$(".quiz-option").forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.answer === correct.id) btn.classList.add("correct");
    else if (btn.dataset.answer === id) btn.classList.add("wrong");
  });
  $("#quizFeedback").textContent = isCorrect ? "Correct! Well done." : `Not quite. The correct meaning is “${correct.english}”.`;
  $("#quizNext").hidden = false;
}
function speakArabic(text) {
  if (!("speechSynthesis" in window)) {
    $("#appStatus").textContent = "Speech playback is not supported by this browser.";
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar";
  utterance.rate = 0.8;
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith("ar"));
  if (arabicVoice) utterance.voice = arabicVoice;
  utterance.onerror = () => { $("#appStatus").textContent = "Your device may not have an Arabic speech voice installed."; };
  window.speechSynthesis.speak(utterance);
}
function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id];
  saveStats(); refreshVisibleView();
}
function toggleLearned(id) {
  learned = learned.includes(id) ? learned.filter(x => x !== id) : [...learned, id];
  saveStats(); refreshVisibleView();
}
function refreshVisibleView() {
  const view = $$(".nav-item").find(b => b.classList.contains("active"))?.dataset.nav;
  if ($("#searchInput").value.trim()) showResults($("#searchInput").value);
  if (view && view !== "home" && !$("#viewSection").hidden) {
    if (view === "favorites") renderWords(words.filter(w => favorites.includes(w.id)), $("#viewContent"));
    else if (view === "islamic") renderWords(words.filter(w => w.category === "Islamic"), $("#viewContent"));
  }
  $("#dailyWord").innerHTML = dailyMarkup();
}
function dailyWordObj() {
  if (!words.length) return {id:"empty", english:"Dictionary loading", arabic:"", definition:"Please refresh when the page is available."};
  const day = Math.floor(Date.now() / 86400000);
  return words[((day % words.length) + words.length) % words.length];
}
function dailyMarkup() {
  const w = dailyWordObj();
  return `<div><div class="day-label">YOUR DAILY WORD</div><h3>${esc(w.english)}</h3><p>${esc(w.definition)}</p><div class="daily-actions"><button class="button button-gold" type="button" data-fav="${esc(w.id)}">${favorites.includes(w.id) ? "★ Saved" : "☆ Save word"}</button><button class="button button-outline" type="button" data-learn="${esc(w.id)}">${learned.includes(w.id) ? "✓ Learned" : "Mark learned"}</button></div></div><div class="arabic" lang="ar" dir="rtl">${esc(w.arabic)}</div>`;
}
async function onlineLookup() {
  const query = lastOnlineQuery.trim();
  if (!query) return;
  const status = $("#onlineStatus");
  status.textContent = "Trying an optional online translation…";
  // This public third-party service may be unavailable, rate-limited, or inaccurate.
  try {
    const response = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(query) + "&langpair=en|ar", { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Service unavailable");
    const data = await response.json();
    const translated = data?.responseData?.translatedText;
    if (!translated || data.responseStatus !== 200) throw new Error("No translation returned");
    const clean = translated.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    status.innerHTML = `Machine translation (not verified): <strong lang="ar" dir="rtl" class="online-ar">${esc(clean)}</strong><br><span class="small">Check spelling, context, and accuracy before relying on it. Do not use this as Qur'anic interpretation.</span><br><button id="saveOnline" class="button button-outline" type="button">Save on this device</button>`;
    $("#saveOnline").addEventListener("click", () => {
      const id = "online-" + Date.now();
      const entry = {id, arabic:clean, english:query, definition:"Machine-generated online translation. Verify accuracy and context before relying on it.", category:"Online translation", example_ar:"", example_en:""};
      words.push(entry);
      favorites.push(id);
      const onlineWords = store.get("onlineWords", []);
      onlineWords.push(entry);
      store.set("onlineWords", onlineWords);
      saveStats();
      status.textContent = "Saved to this device's vocabulary. Clearing browser storage may remove it.";
    }, {once:true});
  } catch {
    status.textContent = "Online translation is unavailable right now. Check your connection and try again later.";
  }
}
function handleActions(event) {
  const audio = event.target.closest("[data-audio]");
  if (audio) { speakArabic(audio.dataset.audio); return; }
  const fav = event.target.closest("[data-fav]");
  if (fav) { toggleFavorite(fav.dataset.fav); return; }
  const learn = event.target.closest("[data-learn]");
  if (learn) { toggleLearned(learn.dataset.learn); return; }
  const answer = event.target.closest("[data-answer]");
  if (answer) { answerQuiz(answer.dataset.answer); return; }
  if (event.target.closest("[data-quiz-restart]")) { startQuiz($("#viewContent")); return; }
  if (event.target.closest("#quizNext")) {
    quiz.index++; quiz.answered = false; renderQuizQuestion($("#viewContent"));
  }
}
async function init() {
  try {
    const response = await fetch("./arabic-words.json");
    if (!response.ok) throw new Error("Vocabulary file could not be loaded");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Vocabulary data is not a list");
    words = data.filter(w => w && w.id && w.english && w.arabic);
  } catch {
    words = FALLBACK_WORDS;
    $("#appStatus").textContent = "Using the built-in dictionary. Some files may still be updating.";
  }
  const onlineWords = store.get("onlineWords", []);
  onlineWords.forEach(w => { if (!words.some(existing => existing.id === w.id)) words.push(w); });
  saveStats();
  $("#year").textContent = new Date().getFullYear();
  $("#dailyWord").innerHTML = dailyMarkup();
  $("#searchInput").addEventListener("input", e => showResults(e.target.value));
  $("#clearSearch").addEventListener("click", () => { $("#searchInput").value = ""; showResults(""); $("#searchInput").focus(); });
  $("#onlineSearchBtn").addEventListener("click", onlineLookup);
  $("#closeView").addEventListener("click", () => {
    $("#viewSection").hidden = true;
    $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.nav === "home"));
  });
  $$(".feature-card").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));
  $$(".nav-item").forEach(b => b.addEventListener("click", () => {
    const view = b.dataset.nav;
    if (view === "home") {
      $("#viewSection").hidden = true; $("#resultsSection").hidden = true;
      $("#searchInput").value = ""; $("#clearSearch").hidden = true;
      $$(".nav-item").forEach(n => n.classList.toggle("active", n === b));
      window.scrollTo({top:0, behavior:"smooth"});
    } else showView(view);
  }));
  document.body.addEventListener("click", handleActions);
  $("#themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    store.set("dark", document.body.classList.contains("dark"));
  });
  if (store.get("dark", false)) document.body.classList.add("dark");
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register("./service-worker.js").then(reg => reg.update()).catch(() => {});
  }
  if (!words.length) {
    $("#dailyWord").innerHTML = '<p class="empty-state">Dictionary data could not load. Please refresh when the app files are available.</p>';
    $("#appStatus").textContent = "Dictionary data is unavailable.";
  } else if (navigator.onLine) {
    $("#appStatus").textContent = "Ready to learn.";
  } else {
    $("#appStatus").textContent = "Offline mode — your bundled dictionary is ready.";
  }
}
window.addEventListener("online", () => { $("#appStatus").textContent = "Back online."; });
window.addEventListener("offline", () => { $("#appStatus").textContent = "Offline mode — bundled vocabulary remains available."; });
init();
})();