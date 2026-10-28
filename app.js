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
 {title:"1. Arabic Alphabet",ar:"أَبْجَدِيَّةُ الْعَرَبِيَّةِ",tr:"Abjadiyyat al-ʿarabiyyah",notes:["Arabic is written and read from right to left.","There are 28 basic letters. Learn each letter's name, sound, and written shape together.","Many letters change shape at the beginning, middle, or end of a word.","The letters ا د ذ ر ز و do not connect to the letter that follows them, although they may connect to the letter before them.","Practise a few letters daily: recognise them, write them, and read them in short words."],v:[["ا","alif","alif; long-vowel carrier in many words"],["ب","bāʾ","b sound"],["ت","tāʾ","t sound"],["ث","thāʾ","th sound as in ‘think’"],["ج","jīm","j sound in many standard pronunciations"],["ح","ḥāʾ","deep, breathy h sound"]],sum:"Arabic has 28 basic letters and is read from right to left. Practise letter shapes and sounds a few at a time.",en:"The Arabic alphabet is the set of letters used to write Arabic."},
 {title:"2. Short Vowels and Reading Marks",ar:"بَ · بِ · بُ · بْ · بّ",tr:"Ba · bi · bu · b · doubled b",notes:["Fatḥah (َ) above a letter gives a short ‘a’: بَ = ba.","Kasrah (ِ) below a letter gives a short ‘i’: بِ = bi.","Ḍammah (ُ) above a letter gives a short ‘u’: بُ = bu.","Sukūn (ْ) means the consonant has no vowel after it; shaddah (ّ) doubles the consonant.","Tanwīn (ً ٍ ٌ) adds an ending n-sound in fully vowelled Arabic. Short vowels are often omitted in everyday writing."],v:[["بَ","ba","b with short a"],["بِ","bi","b with short i"],["بُ","bu","b with short u"],["بْ","b","b without a following vowel"]],sum:"Fatḥah is a, kasrah is i, and ḍammah is u. Sukūn removes the vowel and shaddah doubles the consonant.",en:"Vowel marks guide pronunciation, especially for learners and fully vowelled Arabic texts."},
 {title:"3. Greetings and Introductions",ar:"السَّلَامُ عَلَيْكُمْ · مَا اسْمُكَ؟",tr:"As-salāmu ʿalaykum · Mā ismuka?",notes:["السَّلَامُ عَلَيْكُمْ means ‘Peace be upon you’; reply وَعَلَيْكُمُ السَّلَامُ (‘And peace be upon you too’).","مَا اسْمُكَ؟ asks a male ‘What is your name?’; مَا اسْمُكِ؟ asks a female.","اِسْمِي ... means ‘My name is ...’. Add your name after اِسْمِي.","مَرْحَبًا means ‘Hello/Welcome’; أَهْلًا وَسَهْلًا is a warm ‘Welcome’.","Practise greeting someone, asking their name, answering, and thanking them."],v:[["السَّلَامُ عَلَيْكُمْ","as-salāmu ʿalaykum","Peace be upon you"],["وَعَلَيْكُمُ السَّلَامُ","wa ʿalaykumu s-salām","And peace be upon you too"],["مَا اسْمُكَ؟","mā ismuka?","What is your name? (to a male)"],["اِسْمِي ...","ismī ...","My name is ..."]],sum:"Greet with salām, ask مَا اسْمُكَ؟, and answer اِسْمِي followed by your name.",en:"These phrases help you greet people and introduce yourself politely."},
 {title:"4. Pronouns",ar:"أَنَا · أَنْتَ · أَنْتِ · هُوَ · هِيَ",tr:"Anā · anta · anti · huwa · hiya",notes:["أَنَا = I; نَحْنُ = we.","أَنْتَ = you (one male); أَنْتِ = you (one female).","هُوَ = he; هِيَ = she; هُمْ = they (masculine/mixed group); هُنَّ = they (feminine group).","Arabic verbs often show the subject through their endings or beginnings, so a pronoun can sometimes be left out.","Practise: أَنَا طَالِبٌ (‘I am a male student’); هِيَ طَالِبَةٌ (‘She is a female student’)."],v:[["أَنَا","anā","I"],["نَحْنُ","naḥnu","we"],["أَنْتَ","anta","you, male"],["أَنْتِ","anti","you, female"],["هُوَ","huwa","he"],["هِيَ","hiya","she"]],sum:"Memorise the common pronouns for I, we, you, he, and she. Notice that أنتَ and أنتِ differ by gender.",en:"Pronouns replace names and show who is speaking or being discussed."},
 {title:"5. Masculine and Feminine",ar:"طَالِبٌ · طَالِبَةٌ",tr:"Ṭālibun · ṭālibatun",notes:["طَالِبٌ means male student; طَالِبَةٌ means female student.","Many feminine nouns end in ة (tāʾ marbūṭah), but not every word follows this pattern.","Adjectives often match the noun: طَالِبٌ مُجْتَهِدٌ (‘hardworking male student’) and طَالِبَةٌ مُجْتَهِدَةٌ (‘hardworking female student’).","هُوَ means ‘he’ and هِيَ means ‘she’.","Learn new nouns together with their gender and a sample sentence."],v:[["طَالِبٌ","ṭālibun","male student"],["طَالِبَةٌ","ṭālibatun","female student"],["مُعَلِّمٌ","muʿallimun","male teacher"],["مُعَلِّمَةٌ","muʿallimah","female teacher"]],sum:"Many feminine forms end in ة. Adjectives commonly match the gender of the noun they describe.",en:"Masculine and feminine forms help speakers describe people and things accurately."},
 {title:"6. Singular, Dual and Plural",ar:"كِتَابٌ · كِتَابَانِ · كُتُبٌ",tr:"Kitābun · kitābāni · kutubun",notes:["Singular means one: كِتَابٌ = a book.","Dual means two: كِتَابَانِ = two books in a common nominative form; its ending can change with grammar.","Plural usually means three or more: كُتُبٌ = books.","Arabic plurals may add endings or change the inside of the word; these changed forms are often called broken plurals.","Memorise common singular and plural pairs rather than guessing every plural."],v:[["كِتَابٌ","kitābun","a book"],["كِتَابَانِ","kitābāni","two books"],["كُتُبٌ","kutubun","books"],["قَلَمٌ / أَقْلَامٌ","qalam / aqlām","pen / pens"]],sum:"Arabic uses singular, dual, and plural forms. Learn common noun pairs together.",en:"Number forms show whether you mean one, two, or more than two things."},
 {title:"7. Numbers",ar:"وَاحِدٌ · اِثْنَانِ · ثَلَاثَةٌ",tr:"Wāḥid · ithnān · thalāthah",notes:["1 وَاحِدٌ; 2 اِثْنَانِ; 3 ثَلَاثَةٌ.","4 أَرْبَعَةٌ; 5 خَمْسَةٌ; 6 سِتَّةٌ.","7 سَبْعَةٌ; 8 ثَمَانِيَةٌ; 9 تِسْعَةٌ; 10 عَشَرَةٌ.","Number forms and their agreement with nouns can be more complex than in English. Learn common expressions first.","Count real objects around you aloud, then cover the English meaning and test yourself."],v:[["وَاحِدٌ","wāḥid","one"],["اِثْنَانِ","ithnān","two"],["ثَلَاثَةٌ","thalāthah","three"],["عَشَرَةٌ","ʿasharah","ten"]],sum:"Learn numbers one to ten by sound and practise counting real objects.",en:"Numbers are used for counting, prices, dates, and quantities."},
 {title:"8. Asking Questions",ar:"مَا هَذَا؟ · أَيْنَ الْبَيْتُ؟",tr:"Mā hādhā? · Ayna al-bayt?",notes:["مَا = what; مَنْ = who; أَيْنَ = where; مَتَى = when.","كَيْفَ = how; لِمَاذَا = why; كَمْ = how many/how much.","مَا هَذَا؟ means ‘What is this?’; أَيْنَ الْبَيْتُ؟ means ‘Where is the house?’","The question word often appears near the beginning of a simple question.","Answer as well as ask: هَذَا كِتَابٌ (‘This is a book’); الْبَيْتُ هُنَاكَ (‘The house is there’)."],v:[["مَا هَذَا؟","mā hādhā?","What is this?"],["مَنْ هَذَا؟","man hādhā?","Who is this?"],["أَيْنَ؟","ayna?","Where?"],["كَمْ؟","kam?","How many/how much?"]],sum:"Remember the question words for what, who, where, when, how, why, and how much.",en:"Question words help you ask for information about people, places, time, reasons, and prices."},
 {title:"9. Family Vocabulary",ar:"أَبٌ · أُمٌّ · أَخٌ · أُخْتٌ",tr:"Abun · ummun · akhun · ukhtun",notes:["أَبٌ = father; أُمٌّ = mother; وَالِدَانِ = parents.","أَخٌ = brother; أُخْتٌ = sister; اِبْنٌ = son; بِنْتٌ = daughter.","جَدٌّ = grandfather; جَدَّةٌ = grandmother; عَائِلَةٌ = family.","أَبِي means ‘my father’; أُمِّي means ‘my mother’. The ending ـي often means ‘my’ when attached to a noun.","هَذَا أَبِي = ‘This is my father’; هَذِهِ أُمِّي = ‘This is my mother’."],v:[["أَبِي","abī","my father"],["أُمِّي","ummī","my mother"],["أَخِي","akhī","my brother"],["أُخْتِي","ukhtī","my sister"]],sum:"Learn family nouns and use ـي in common forms such as أبي and أمي to mean ‘my father’ and ‘my mother’.",en:"Family vocabulary helps you talk about relatives and relationships."},
 {title:"10. Everyday Conversation",ar:"كَيْفَ حَالُكَ؟ أَنَا بِخَيْرٍ، شُكْرًا",tr:"Kayfa ḥāluka? Anā bikhayr, shukran",notes:["كَيْفَ حَالُكَ؟ asks a male ‘How are you?’; كَيْفَ حَالُكِ؟ asks a female.","أَنَا بِخَيْرٍ، شُكْرًا means ‘I am well, thank you’. ","مِنْ فَضْلِكَ / مِنْ فَضْلِكِ means ‘please’ when speaking to a male/female; عَفْوًا can mean ‘you’re welcome’ or ‘excuse me’. ","لَا أَفْهَمُ means ‘I do not understand’. هَلْ يُمْكِنُكَ أَنْ تُعِيدَ؟ means ‘Can you repeat?’ when addressing a male.","Listen, repeat slowly, then try to say the phrase without looking."],v:[["كَيْفَ حَالُكَ؟","kayfa ḥāluka?","How are you? (to a male)"],["أَنَا بِخَيْرٍ","anā bikhayr","I am well"],["شُكْرًا","shukran","Thank you"],["عَفْوًا","ʿafwan","You’re welcome / excuse me"]],sum:"Use a greeting, ask how someone is, answer politely, and say thank you.",en:"These expressions are useful for short everyday conversations."},
 {title:"11. Building Simple Sentences",ar:"هَذَا كِتَابٌ · الْبَيْتُ كَبِيرٌ",tr:"Hādhā kitābun · al-baytu kabīrun",notes:["هَذَا means ‘this’ with a masculine noun; هَذِهِ is used with a feminine noun.","هَذَا كِتَابٌ = ‘This is a book’; هَذِهِ مَدْرَسَةٌ = ‘This is a school’. ","A present-tense nominal sentence often has no separate word for ‘is’: الْبَيْتُ كَبِيرٌ = ‘The house is big’. ","Adjectives commonly follow the noun and agree with it in gender and definiteness.","Practise the patterns ‘this + noun’ and ‘noun + description’."],v:[["هَذَا كِتَابٌ","hādhā kitābun","This is a book"],["هَذِهِ مَدْرَسَةٌ","hādhihi madrasah","This is a school"],["الْبَيْتُ كَبِيرٌ","al-baytu kabīrun","The house is big"]],sum:"Use هَذَا with masculine nouns and هَذِهِ with feminine nouns. A description often follows its noun.",en:"Simple Arabic sentences can identify an object or describe a person or thing."},
 {title:"12. Common Verbs",ar:"أَكْتُبُ · أَقْرَأُ · أَذْهَبُ",tr:"Aktubu · aqraʾu · adhhabu",notes:["أَكْتُبُ = I write; أَقْرَأُ = I read; أَذْهَبُ = I go.","أَدْرُسُ = I study; آكُلُ = I eat; أَشْرَبُ = I drink; أَسْمَعُ = I hear/listen.","Many first-person present-tense verbs begin with أَـ, but verb patterns vary.","Arabic verbs change to match the subject. Learn the ‘I’ form, then compare it with ‘he’ and ‘she’. ","Make a daily routine sentence such as أَقْرَأُ كِتَابًا (‘I read a book’)."],v:[["أَكْتُبُ","aktubu","I write"],["أَقْرَأُ","aqraʾu","I read"],["أَذْهَبُ","adhhabu","I go"],["أَشْرَبُ","ashrabu","I drink"]],sum:"Learn common action verbs and use them to describe your daily routine.",en:"Verbs tell what someone does or what happens."},
 {title:"13. Present-Tense Sentences",ar:"أَنَا أَدْرُسُ الْعَرَبِيَّةَ",tr:"Anā adrusu al-ʿarabiyyah",notes:["أَنَا أَدْرُسُ الْعَرَبِيَّةَ means ‘I study Arabic’ or ‘I am studying Arabic’. ","هُوَ يَدْرُسُ = ‘He studies’; هِيَ تَدْرُسُ = ‘She studies’. Notice the verb changes.","A pronoun may be included for emphasis or clarity, but is often optional.","الْيَوْمَ means ‘today’; كُلَّ يَوْمٍ means ‘every day’. These time phrases clarify when an action happens.","Arabic verb forms can cover more than one English tense, so context matters."],v:[["أَدْرُسُ","adrusu","I study"],["يَدْرُسُ","yadrusu","he studies"],["تَدْرُسُ","tadrusu","she studies"],["كُلَّ يَوْمٍ","kulla yawmin","every day"]],sum:"Present-tense verbs change with the subject: أدرس = I study, يدرس = he studies, تدرس = she studies.",en:"Use these patterns to describe routines and activities happening now."},
 {title:"14. Past-Tense Sentences",ar:"دَرَسْتُ أَمْسِ",tr:"Darastu amsi",notes:["دَرَسْتُ means ‘I studied’; the ending ـتُ marks ‘I’ in this example.","دَرَسَ means ‘he studied’; دَرَسَتْ means ‘she studied’. ","أَمْسِ = yesterday; الْيَوْمَ = today; غَدًا = tomorrow.","دَرَسْتُ أَمْسِ means ‘I studied yesterday’. ","Practise common verbs and subjects in small groups instead of memorising every form at once."],v:[["دَرَسْتُ","darastu","I studied"],["دَرَسَ","darasa","he studied"],["دَرَسَتْ","darasat","she studied"],["أَمْسِ","amsi","yesterday"]],sum:"Past-tense verbs describe completed actions; endings can show whether I, he, or she did the action.",en:"Past-tense sentences help you describe what happened before now."},
 {title:"15. Negation: Saying ‘Not’",ar:"لَا أَفْهَمُ · لَا أَعْرِفُ",tr:"Lā afhamu · lā aʿrifu",notes:["لَا أَفْهَمُ = ‘I do not understand’; لَا أَعْرِفُ = ‘I do not know’. ","For many present-tense statements, لَا comes before the verb to mean ‘do not/does not’. ","لَا أُرِيدُ means ‘I do not want’; لَا أَذْهَبُ means ‘I do not go’. ","لَيْسَ is commonly used to negate nominal sentences; its forms and grammar are a further topic.","A polite phrase is عَفْوًا، لَا أَفْهَمُ (‘Excuse me, I do not understand’)."],v:[["لَا أَفْهَمُ","lā afhamu","I do not understand"],["لَا أَعْرِفُ","lā aʿrifu","I do not know"],["لَا أُرِيدُ","lā urīdu","I do not want"]],sum:"Put لَا before many present-tense verbs to say ‘do not/does not’.",en:"Negation helps you express that you do not know, understand, want, or do something."},
 {title:"16. Asking for Directions",ar:"أَيْنَ الْمَسْجِدُ؟",tr:"Ayna al-masjid?",notes:["أَيْنَ الْمَسْجِدُ؟ = ‘Where is the mosque?’; أَيْنَ الْمَدْرَسَةُ؟ = ‘Where is the school?’","يَمِينٌ = right; يَسَارٌ = left; أَمَامَ = in front of; خَلْفَ = behind.","قَرِيبٌ = near; بَعِيدٌ = far; هُنَا = here; هُنَاكَ = there.","مِنْ فَضْلِكَ، أَيْنَ ...؟ means ‘Please, where is ...?’","Practise asking about the mosque, school, market, and bus station."],v:[["أَيْنَ الْمَسْجِدُ؟","ayna al-masjid?","Where is the mosque?"],["يَمِينٌ","yamīn","right"],["يَسَارٌ","yasār","left"],["قَرِيبٌ","qarīb","near"]],sum:"Use أَيْنَ for ‘where?’ and learn the words for right, left, near, far, here, and there.",en:"These phrases help you ask where places are and understand simple directions."},
 {title:"17. Shopping and Prices",ar:"بِكَمْ هَذَا؟ أُرِيدُ هَذَا",tr:"Bikam hādhā? Urīdu hādhā",notes:["بِكَمْ هَذَا؟ means ‘How much is this?’","أُرِيدُ هَذَا means ‘I want this’; the demonstrative may change with the item being referred to.","مِنْ فَضْلِكَ / مِنْ فَضْلِكِ means ‘please’ when addressing a male/female.","غَالٍ means ‘expensive’; رَخِيصٌ means ‘cheap’. ","Practise with everyday objects. Spoken expressions and currency terms vary by country and dialect."],v:[["بِكَمْ هَذَا؟","bikam hādhā?","How much is this?"],["أُرِيدُ هَذَا","urīdu hādhā","I want this"],["غَالٍ","ghālin","expensive"],["رَخِيصٌ","rakhīṣun","cheap"]],sum:"Ask the price with بِكَمْ هَذَا؟ and say أُرِيدُ هَذَا to express what you want.",en:"Shopping phrases help you ask prices and request items politely."},
 {title:"18. School Conversations",ar:"أَيْنَ الْفَصْلُ؟ أَنَا طَالِبٌ",tr:"Ayna al-faṣl? Anā ṭālibun",notes:["فَصْلٌ = classroom; مَدْرَسَةٌ = school; كِتَابٌ = book; قَلَمٌ = pen.","مُعَلِّمٌ = male teacher; مُعَلِّمَةٌ = female teacher; طَالِبٌ = male student; طَالِبَةٌ = female student.","أَيْنَ الْفَصْلُ؟ means ‘Where is the classroom?’","لَدَيَّ قَلَمٌ is a common way to say ‘I have a pen’. ","Introduce yourself as a student and name three things in your school bag."],v:[["مَدْرَسَةٌ","madrasah","school"],["كِتَابٌ","kitāb","book"],["قَلَمٌ","qalam","pen"],["طَالِبَةٌ","ṭālibah","female student"]],sum:"Memorise school nouns and ask أَيْنَ الْفَصْلُ؟ to find the classroom.",en:"School vocabulary helps you talk about classes, teachers, books, and pens."},
 {title:"19. Common Islamic Expressions",ar:"الْحَمْدُ لِلَّهِ · إِنْ شَاءَ اللَّهُ",tr:"Al-ḥamdu lillāh · In shāʾ Allāh",notes:["بِسْمِ اللَّهِ means ‘In the name of Allah’; it is commonly said before beginning something.","الْحَمْدُ لِلَّهِ means ‘Praise belongs to Allah’ and expresses praise or gratitude.","إِنْ شَاءَ اللَّهُ means ‘If Allah wills’ and is used when speaking about a future intention.","جَزَاكَ اللَّهُ خَيْرًا means ‘May Allah reward you with good’ when addressing a male; جَزَاكِ اللَّهُ خَيْرًا addresses a female.","These are language notes, not a substitute for tafsīr or scholarly guidance on religious rulings."],v:[["بِسْمِ اللَّهِ","bismillāh","In the name of Allah"],["الْحَمْدُ لِلَّهِ","al-ḥamdu lillāh","Praise belongs to Allah"],["إِنْ شَاءَ اللَّهُ","in shāʾ Allāh","If Allah wills"],["جَزَاكَ اللَّهُ خَيْرًا","jazāk Allāhu khayran","May Allah reward you with good (to a male)"]],sum:"Learn the meanings and everyday use of Bismillah, Alhamdulillah, Insha’Allah, and Jazak Allahu khayran.",en:"These expressions communicate remembrance, gratitude, hope, and appreciation."},
 {title:"20. Revision and Practice",ar:"اِسْمِي ... · أَنَا أَتَعَلَّمُ الْعَرَبِيَّةَ",tr:"Ismī ... · Anā ataʿallamu al-ʿarabiyyah",notes:["Review letter shapes and vowel marks; read five short words aloud.","Introduce yourself: السَّلَامُ عَلَيْكُمْ، اِسْمِي ... (‘Peace be upon you; my name is ...’).","Make one sentence with a pronoun, one with a verb, one question, and one negative sentence.","Translate short Arabic phrases into English, then cover the English and recall the meaning.","Use Listen, repeat slowly, and practise again. Audio depends on whether your browser/device has an Arabic speech voice."],v:[["اِسْمِي ...","ismī ...","My name is ..."],["أَنَا أَتَعَلَّمُ الْعَرَبِيَّةَ","anā ataʿallamu al-ʿarabiyyah","I am learning Arabic"],["هَذَا كِتَابٌ","hādhā kitābun","This is a book"]],sum:"Revise letters, vowels, greetings, pronouns, numbers, questions, sentences, verbs, and Islamic expressions.",en:"Revision helps you remember and use the Arabic you have learned."}
 ];
 target.innerHTML = `<div class="lesson-list">${lessons.map((l,i)=>`<article class="lesson lesson-expanded"><h3>${esc(l.title)}</h3><p class="arabic" lang="ar" dir="rtl">${esc(l.ar)}</p><p><strong>${esc(l.tr)}</strong></p><h4>Lesson notes</h4><ol>${l.notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ol><h4>Key words and English translations</h4><div class="lesson-vocab">${l.v.map(v=>`<div class="lesson-vocab-row"><span class="arabic" lang="ar" dir="rtl">${esc(v[0])}</span><span><strong>${esc(v[1])}</strong><br>${esc(v[2])}</span><button class="button button-outline" type="button" data-audio="${esc(v[0])}" aria-label="Listen to ${esc(v[2])}">🔊</button></div>`).join("")}</div><h4>Short English summary</h4><p>${esc(l.sum)}</p><h4>English translation</h4><p>${esc(l.en)}</p><button class="button button-gold" type="button" data-audio="${esc(l.ar)}">🔊 Listen to lesson phrase</button></article>`).join("")}</div>`;
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