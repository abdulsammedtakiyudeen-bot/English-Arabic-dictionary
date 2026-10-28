(() => {
"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const store = {
  get(key, fallback) { try { const raw = localStorage.getItem("iald_" + key); return raw === null ? fallback : JSON.parse(raw); } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem("iald_" + key, JSON.stringify(value)); } catch {} }
};
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
    {title:"1. Greetings", ar:"السَّلَامُ عَلَيْكُمْ", translit:"As-salāmu ʿalaykum", body:"This greeting means “Peace be upon you.” A common response is وَعَلَيْكُمُ السَّلَامُ (wa ʿalaykumu s-salām), “And peace be upon you too.”"},
    {title:"2. Saying thank you", ar:"شُكْرًا جَزِيلًا", translit:"Shukran jazīlan", body:"This means “Thank you very much.” عَفْوًا (ʿafwan) can mean “You're welcome” in response."},
    {title:"3. Yes and no", ar:"نَعَمْ · لَا", translit:"Naʿam · Lā", body:"نَعَمْ means “yes” and لَا means “no.” Practise saying each word clearly."},
    {title:"4. Introducing yourself", ar:"أَنَا طَالِبٌ", translit:"Anā ṭālib", body:"This means “I am a male student.” A female student can say أَنَا طَالِبَةٌ (anā ṭālibah)."},
    {title:"5. Useful Islamic expression", ar:"إِنْ شَاءَ اللَّهُ", translit:"In shāʾ Allāh", body:"This expression means “if Allah wills” or “God willing.” It is often used when talking about future plans."},
    {title:"6. Simple sentence", ar:"هَذَا كِتَابٌ", translit:"Hādhā kitābun", body:"This means “This is a book.” هَذَا (hādhā) is used for “this” with a masculine noun; هَذِهِ (hādhihi) is used with a feminine noun."}
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
    words = [];
    $("#appStatus").textContent = "The offline dictionary file could not be loaded. Check that arabic-words.json is in the repository root.";
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