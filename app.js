const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
let words = [];
let activeQuiz = null;
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
const store = {
  get(key, fallback) { try { const v = localStorage.getItem("iald_"+key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem("iald_"+key, JSON.stringify(value)); } catch {} }
};
let favorites = store.get("favorites", []);
let learned = store.get("learned", []);
let quizAnswers = store.get("quizAnswers", 0);
let lastOnlineQuery = "";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function shuffled(arr) { return [...arr].sort(() => Math.random() - .5); }
function saveStats() {
  $("#favCount").textContent = favorites.length;
  $("#learnedCount").textContent = learned.length;
  $("#streakCount").textContent = quizAnswers;
}
function wordCard(w) {
  const saved = favorites.includes(w.id);
  const learnt = learned.includes(w.id);
  return `<article class="word-card">
    <div><div class="word-top"><span class="english">${escapeHTML(w.english)}</span><h3 lang="ar" dir="rtl">${escapeHTML(w.arabic)}</h3></div>
    <p>${escapeHTML(w.definition)}</p>
    <p><b lang="ar" dir="rtl">${escapeHTML(w.example_ar || "")}</b>${w.example_en ? " · "+escapeHTML(w.example_en):""}</p>
    <span class="tag">${escapeHTML(w.category || "Vocabulary")}${learnt ? " · Learned" : ""}</span></div>
    <div class="word-actions"><button class="mini-btn" data-audio="${escapeHTML(w.arabic)}" aria-label="Speak Arabic word" title="Speak word">🔊</button>
    <button class="mini-btn" data-fav="${escapeHTML(w.id)}" aria-label="${saved ? "Remove favourite" : "Save favourite"}" title="${saved ? "Remove saved word" : "Save word"}">${saved ? "★" : "☆"}</button>
    <button class="mini-btn" data-learn="${escapeHTML(w.id)}" aria-label="Mark learned" title="Mark learned">${learnt ? "✓" : "＋"}</button></div>
  </article>`;
}
function renderWords(list, target) {
  target.innerHTML = list.length ? list.map(wordCard).join("") : '<p class="empty-state">Nothing here yet. Search for a word or save one from the dictionary.</p>';
}
function showResults(query) {
  const section = $("#resultsSection");
  const q = query.trim().toLocaleLowerCase();
  $("#clearSearch").hidden = !q;
  if (!q) { section.hidden = true; $("#onlineStatus").textContent = ""; return; }
  section.hidden = false;
  const found = words.filter(w => [w.english,w.arabic,w.definition,w.category,w.example_en].some(v => (v||"").toLocaleLowerCase().includes(q)));
  $("#resultCount").textContent = `${found.length} ${found.length === 1 ? "word" : "words"}`;
  renderWords(found, $("#results"));
  $("#noResults").hidden = found.length !== 0;
  $("#onlineSearchBtn").hidden = found.length !== 0;
  lastOnlineQuery = query.trim();
  $("#onlineStatus").textContent = "";
  section.scrollIntoView({behavior:"smooth",block:"start"});
}
function showView(view) {
  const section = $("#viewSection"), content = $("#viewContent");
  section.hidden = false;
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.nav === view || (view === "home" && b.dataset.nav === "home")));
  const titles = {islamic:["ISLAMIC VOCABULARY","Islamic words"],lessons:["LEARN STEP BY STEP","Mini lessons"],quiz:["PRACTISE","Arabic quick quiz"],favorites:["YOUR COLLECTION","Saved words"],home:["WELCOME","Explore"]};
  $("#viewEyebrow").textContent = (titles[view]||titles.home)[0];
  $("#viewTitle").textContent = (titles[view]||titles.home)[1];
  if (view === "islamic") renderWords(words.filter(w => w.category === "Islamic"), content);
  else if (view === "favorites") renderWords(words.filter(w => favorites.includes(w.id)), content);
  else if (view === "lessons") renderLessons(content);
  else if (view === "quiz") startQuiz(content);
  else { section.hidden = true; }
  section.scrollIntoView({behavior:"smooth",block:"start"});
}
function renderLessons(target) {
  const lessons = [
    {title:"1. Greetings",ar:"السَّلَامُ عَلَيْكُمْ",body:"As-salāmu ʿalaykum means “Peace be upon you.” A common response is وَعَلَيْكُمُ السَّلَامُ (wa ʿalaykumu s-salām), “And peace be upon you too.”"},
    {title:"2. Saying thank you",ar:"شُكْرًا جَزِيلًا",body:"Shukran jazīlan means “Thank you very much.” عَفْوًا (ʿafwan) can mean “You're welcome.”"},
    {title:"3. Yes and no",ar:"نَعَمْ · لَا",body:"نَعَمْ (naʿam) means “yes.” لَا (lā) means “no.” Practise saying each word slowly."},
    {title:"4. Introducing yourself",ar:"أَنَا طَالِبٌ",body:"Anā ṭālib means “I am a male student.” A female speaker commonly says أَنَا طَالِبَةٌ (anā ṭālibah). Arabic endings can change with grammar and context."},
    {title:"5. Useful Islamic words",ar:"إِيمَان · صَبْر · رَحْمَة",body:"Īmān: faith. Ṣabr: patience or steadfastness. Raḥmah: mercy. These are short vocabulary glosses, not full religious explanations."}
  ];
  target.innerHTML = `<div class="lesson-list">${lessons.map(l=>`<article class="lesson"><h3>${escapeHTML(l.title)}</h3><div class="arabic" lang="ar" dir="rtl">${escapeHTML(l.ar)}</div><p>${escapeHTML(l.body)}</p></article>`).join("")}</div>`;
}
function startQuiz(target) {
  activeQuiz = shuffled(words.filter(w=>w.category==="Islamic" || w.category==="Basics" || w.category==="Everyday")).slice(0,8);
  quizIndex=0; quizScore=0; quizAnswered=false; renderQuiz(target);
}
function renderQuiz(target) {
  if (!activeQuiz || quizIndex >= activeQuiz.length) {
    target.innerHTML = `<div class="quiz-card"><p class="eyebrow">QUIZ COMPLETE</p><h3>You scored ${quizScore} out of ${activeQuiz.length}.</h3><p class="muted">Keep practising to build your vocabulary. Your completed answer count is saved on this device.</p><button class="button button-gold" id="restartQuiz">Try another quiz</button></div>`;
    $("#restartQuiz").addEventListener("click",()=>startQuiz(target)); return;
  }
  const w=activeQuiz[quizIndex];
  const options=shuffled([w,...shuffled(words.filter(x=>x.id!==w.id)).slice(0,3)]);
  target.innerHTML=`<div class="quiz-card"><div class="quiz-progress">QUESTION ${quizIndex+1} OF ${activeQuiz.length} · SCORE ${quizScore}</div><p class="quiz-question">What does <span lang="ar" dir="rtl" style="font:28px Amiri;color:var(--green)">${escapeHTML(w.arabic)}</span> mean?</p><div class="quiz-options">${options.map(o=>`<button class="quiz-option" data-answer="${escapeHTML(o.id)}">${escapeHTML(o.english)}</button>`).join("")}</div><p class="quiz-feedback" id="quizFeedback" role="status"></p><button class="button button-gold" id="nextQuestion" hidden>${quizIndex===activeQuiz.length-1?"See result":"Next question →"}</button></div>`;
  $$(".quiz-option").forEach(btn=>btn.addEventListener("click",()=>{
    if(quizAnswered)return; quizAnswered=true; quizAnswers++; store.set("quizAnswers",quizAnswers); saveStats();
    const correct=btn.dataset.answer===w.id;
    if(correct){quizScore++;btn.classList.add("correct");$("#quizFeedback").textContent="Correct! "+w.english+" — "+w.definition;}
    else {btn.classList.add("wrong");const right=$(`[data-answer="${w.id}"]`);if(right)right.classList.add("correct");$("#quizFeedback").textContent="The answer is "+w.english+". "+w.definition;}
    $("#nextQuestion").hidden=false;
  }));
  $("#nextQuestion").addEventListener("click",()=>{quizIndex++;quizAnswered=false;renderQuiz(target);});
}
function handleActions(event) {
  const fav=event.target.closest("[data-fav]");
  if(fav){const id=fav.dataset.fav;favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];store.set("favorites",favorites);saveStats();refreshVisible();return;}
  const learn=event.target.closest("[data-learn]");
  if(learn){const id=learn.dataset.learn;learned=learned.includes(id)?learned.filter(x=>x!==id):[...learned,id];store.set("learned",learned);saveStats();refreshVisible();return;}
  const audio=event.target.closest("[data-audio]");
  if(audio){const synth=window.speechSynthesis;if(!synth){alert("Speech playback is not available in this browser.");return;}synth.cancel();const utter=new SpeechSynthesisUtterance(audio.dataset.audio);utter.lang="ar";utter.rate=.78;synth.speak(utter);}
}
function refreshVisible() {
  const q=$("#searchInput").value;if(q)showResults(q);
  if(!$("#viewSection").hidden){const active=$$(".nav-item.active")[0]?.dataset.nav;if(active)showView(active);}
  $("#dailyWord").innerHTML=dailyMarkup();
}
function dailyWordObj(){const d=new Date();const day=Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000);return words[((day%words.length)+words.length)%words.length];}
function dailyMarkup(){const w=dailyWordObj();return `<div><div class="day-label">YOUR DAILY WORD</div><h3>${escapeHTML(w.english)}</h3><p>${escapeHTML(w.definition)}</p><div class="daily-actions"><button class="button button-gold" data-fav="${escapeHTML(w.id)}">${favorites.includes(w.id)?"★ Saved":"☆ Save word"}</button><button class="button button-outline" data-learn="${escapeHTML(w.id)}">${learned.includes(w.id)?"✓ Learned":"Mark learned"}</button></div></div><div class="arabic" lang="ar" dir="rtl">${escapeHTML(w.arabic)}</div>`;}
async function onlineLookup() {
  const query=lastOnlineQuery.trim(); if(!query)return;
  const status=$("#onlineStatus"); status.textContent="Trying online translation…";
  // MyMemory is a third-party service. Availability, quotas, and translations are not guaranteed.
  try {
    const response=await fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(query)+"&langpair=en|ar");
    if(!response.ok)throw new Error("Service unavailable");
    const data=await response.json();
    const translated=data?.responseData?.translatedText;
    if(!translated || data.responseStatus!==200)throw new Error("No translation returned");
    const clean=translated.replace(/&quot;/g,'"').replace(/&#39;/g,"'");
    status.innerHTML=`Online translation (machine-generated; check before relying on it): <strong lang="ar" dir="rtl" style="font:24px Amiri">${escapeHTML(clean)}</strong><br><span class="small">This is not a verified dictionary entry or Qur'anic interpretation.</span><br><button id="saveOnline" class="button button-outline">Save translation on this device</button>`;
    $("#saveOnline").addEventListener("click",()=>{
      const id="online-"+Date.now(); words.push({id,arabic:clean,english:query,definition:"Machine-generated online translation. Verify accuracy and context before relying on it.",category:"Online translation",example_ar:"",example_en:""});
      favorites.push(id);store.set("favorites",favorites);store.set("onlineWords",words.filter(w=>String(w.id).startsWith("online-")));store.set("favorites",favorites);saveStats();status.textContent="Saved to your on-device vocabulary. Keep this app's storage to retain it.";
    });
  } catch(e) { status.textContent="Online translation is unavailable right now. Check your connection and try again later."; }
}
async function init(){
  try {const res=await fetch("./data/arabic-words.json");if(!res.ok)throw new Error();words=await res.json();} catch {words=[];}
  const savedOnline=store.get("onlineWords",[]); savedOnline.forEach(w=>{if(!words.some(x=>x.id===w.id))words.push(w);});
  saveStats();$("#year").textContent=new Date().getFullYear();$("#dailyWord").innerHTML=dailyMarkup();
  $("#searchInput").addEventListener("input",e=>showResults(e.target.value));
  $("#clearSearch").addEventListener("click",()=>{$("#searchInput").value="";showResults("");$("#searchInput").focus();});
  $("#onlineSearchBtn").addEventListener("click",onlineLookup);
  $("#closeView").addEventListener("click",()=>{$("#viewSection").hidden=true;$$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.nav==="home"));});
  $$(".feature-card").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
  $$(".nav-item").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.nav==="home"){ $("#viewSection").hidden=true;$("#resultsSection").hidden=true;$("#searchInput").value="";$$(".nav-item").forEach(n=>n.classList.toggle("active",n===b));window.scrollTo({top:0,behavior:"smooth"});}else showView(b.dataset.nav);}));
  document.body.addEventListener("click",handleActions);
  $("#themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");store.set("dark",document.body.classList.contains("dark"));});
  if(store.get("dark",false))document.body.classList.add("dark");
  if("serviceWorker" in navigator && location.protocol.startsWith("http")){navigator.serviceWorker.register("./service-worker.js").catch(()=>{});}
  if(!words.length){$("#dailyWord").innerHTML="<p>Dictionary data could not load. Please refresh the page when online.</p>";}
}
init();
