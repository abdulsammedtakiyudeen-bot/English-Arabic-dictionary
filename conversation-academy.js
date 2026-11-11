(() => {
"use strict";
const $=id=>document.getElementById(id);
const stateKey="ialdConversationAcademyV2";
let lessons=[],completed=new Set(),current=-1,selected=-1,premium=false,client=null,user=null,reviewIndex=0,recognition=null,lessonsError="";
try{completed=new Set(JSON.parse(localStorage.getItem(stateKey)||"[]").map(Number));}catch{}
const daily=[["عِلْمٌ","Knowledge"],["كِتَابٌ","Book"],["سَلَامٌ","Peace"],["مَاءٌ","Water"],["صَبْرٌ","Patience"],["شُكْرٌ","Gratitude"],["مَدْرَسَةٌ","School"]];
function say(text){if(!("speechSynthesis"in window)){alert("Speech playback is not supported by this browser.");return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="ar-SA";u.rate=.78;const voices=speechSynthesis.getVoices();const v=voices.find(x=>x.lang.toLowerCase().startsWith("ar"));if(v)u.voice=v;u.onstart=()=>{};u.onerror=()=>{$("accountNotice").textContent="The device could not play this Arabic voice. Try another installed Arabic voice or browser."};speechSynthesis.speak(u);}
function dateKey(d=new Date()){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function updateStreak(){let n=Number(localStorage.getItem("ialdConvStreak")||0),last=localStorage.getItem("ialdConvLastDay");if(last&&last!==dateKey()){const y=new Date();y.setDate(y.getDate()-1);if(last!==dateKey(y))n=0;}$("streakCount").textContent=n;}
function markStudyDay(){const today=dateKey(),last=localStorage.getItem("ialdConvLastDay");if(last!==today){const y=new Date();y.setDate(y.getDate()-1);let n=Number(localStorage.getItem("ialdConvStreak")||0);n=last===dateKey(y)?n+1:1;localStorage.setItem("ialdConvStreak",n);localStorage.setItem("ialdConvLastDay",today);}updateStreak();}
function saveLocal(){localStorage.setItem(stateKey,JSON.stringify([...completed]));}
function progress(){const n=completed.size,p=Math.round(n/20*100);$("completedCount").textContent=n;$("progressPercent").textContent=p+"%";$("progressBar").style.width=p+"%";const status=(user?"Signed in as "+(user.email||"your account")+". ":"You are learning as a guest. ")+(premium?"Premium membership is active.":"First seven lessons are free; lessons 8–20 require Premium.")+" Completed: "+n+"/20.";$("accountNotice").textContent=(lessonsError?lessonsError+" ":"")+status;$("accountState").textContent=premium?"Premium":user?"Free account":"Guest";renderLessons();$("certificateStatus").textContent=n===20?"All 20 lessons completed. Your certificate is ready.":"Certificate locked: "+n+" of 20 lessons completed.";$("certificateButton").disabled=n!==20;}
async function initSupabase(){
 if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_PUBLISHABLE_KEY){return;}
 try{
 client=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY,{auth:{storage:window.localStorage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 const {data,error}=await client.auth.getUser();if(error)throw error;user=data.user||null;
 if(user){const {data:p,error:pe}=await client.from("profiles").select("membership,premium_until").eq("id",user.id).maybeSingle();if(!pe&&p){const expiry=p.premium_until?new Date(p.premium_until):null;premium=String(p.membership||"").toLowerCase()==="premium"&&!!expiry&&expiry>Date.now();}
 await loadCloudProgress();}
 }catch(e){console.warn("Conversation Academy account status:",e);$("accountNotice").textContent="Could not verify account membership right now. Premium lessons remain locked until membership can be confirmed.";}
 progress();
}
async function loadCloudProgress(){if(!client||!user)return;const {data,error}=await client.from("conversation_academy_progress").select("lesson_id,completed").eq("user_id",user.id);if(error){console.warn("Cloud progress table is not installed yet:",error.message);return;}for(const row of data||[])if(row.completed)completed.add(Number(row.lesson_id));saveLocal();}
async function saveCloudProgress(id){if(!client||!user)return;const {error}=await client.from("conversation_academy_progress").upsert({user_id:user.id,lesson_id:id+1,completed:true,completed_at:new Date().toISOString()},{onConflict:"user_id,lesson_id"});if(error)console.warn("Cloud progress was not saved:",error.message);}
function unlocked(i){if(i>=7&&!premium)return false;if(i===0)return true;return completed.has(i-1);}
function renderLessons(){const grid=$("lessonGrid");if(!grid||!lessons.length)return;grid.innerHTML="";lessons.forEach((l,i)=>{const done=completed.has(i),open=unlocked(i),card=document.createElement("article");card.className="lesson-card"+(done?" done":"");const meta=document.createElement("div");meta.className="meta"+(!open?" lock":"");meta.textContent=done?"✓ COMPLETED":i<7?"FREE LESSON":"✦ PREMIUM LESSON";const h=document.createElement("h3");h.textContent=(i+1)+". "+l.title;const p=document.createElement("p");p.textContent=l.objective;const b=document.createElement("button");b.className=open?"primary":"outline";b.textContent=done?"Review lesson":open?"Open lesson":i>=7&&!premium?"Unlock with Premium":"Complete previous lesson";b.disabled=!open;b.addEventListener("click",()=>openLesson(i));card.append(meta,h,p,b);grid.append(card);});}
function openLesson(i){if(!unlocked(i)){alert(i>=7&&!premium?"This lesson requires active Premium membership. Visit the Premium page to see available plans.":"Complete the previous lesson to unlock this one.");return;}current=i;selected=-1;const l=lessons[i];$("lessonNumber").textContent="LESSON "+(i+1)+(i<7?" · FREE":" · PREMIUM");$("lessonTitle").textContent=l.title;$("lessonObjective").textContent=l.objective;$("grammarText").textContent=l.grammar;$("visualArabic").textContent=l.target;$("visualMeaning").textContent=l.meaning;$("targetArabic").textContent=l.target;$("targetMeaning").textContent=l.meaning;
const vocab=$("vocabularyList");vocab.innerHTML="";l.vocab.forEach(([ar,en])=>{const row=document.createElement("div");row.className="vocab-row";const a=document.createElement("span");a.className="arabic";a.textContent=ar;const m=document.createElement("span");m.textContent=en;const b=document.createElement("button");b.className="outline audio";b.textContent="🔊";b.setAttribute("aria-label","Listen to "+en);b.onclick=()=>say(ar);row.append(a,m,b);vocab.append(row);});
const dlg=$("dialogueList");dlg.innerHTML="";l.dialogue.forEach(([who,line])=>{const row=document.createElement("div");row.className="dialogue-line";const name=document.createElement("strong");name.textContent=who==="Tutor"?"Tutor Takiyudeen":"Student";const ar=document.createElement("span");ar.className="arabic";ar.textContent=line;const b=document.createElement("button");b.className="outline audio";b.textContent="🔊";b.onclick=()=>say(line);row.append(name,ar,b);dlg.append(row);});
$("quizQuestion").textContent=l.question;$("quizFeedback").textContent="";$("completeLesson").disabled=true;$("checkAnswer").disabled=false;$("quizOptions").innerHTML="";l.options.forEach((op,j)=>{const b=document.createElement("button");b.className="quiz-choice";b.textContent=String.fromCharCode(65+j)+". "+op;b.onclick=()=>{selected=j;document.querySelectorAll(".quiz-choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");};$("quizOptions").append(b);});
$("speechFeedback").textContent="";$("speechTranscript").textContent="";$("aiReply").textContent="";showTab("study");$("lessonModal").classList.add("open");$("lessonModal").setAttribute("aria-hidden","false");$("closeLesson").focus();}
function showTab(tab){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));["study","conversation","speak","exam"].forEach(t=>$("pane-"+t).hidden=t!==tab);}
function completeLesson(){if(current<0)return;completed.add(current);saveLocal();markStudyDay();saveCloudProgress(current);progress();$("quizFeedback").textContent="Excellent work! Lesson completed. مُمْتَازٌ";$("completeLesson").disabled=true;}
function speechPractice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){$("speechFeedback").textContent="Speech recognition is not supported in this browser. Listen to the phrase and practise aloud; this is not a failure.";return;}try{recognition=new SR();recognition.lang="ar-SA";recognition.interimResults=false;recognition.maxAlternatives=1;$("speechFeedback").textContent="Listening… Speak the Arabic phrase now.";$("speechTranscript").textContent="";recognition.onresult=e=>{const heard=e.results[0][0].transcript; $("speechTranscript").textContent="Recognised: "+heard;const normal=s=>s.replace(/[ًٌٍَُِّْـ]/g,"").replace(/[؟?!.,]/g,"").replace(/\s+/g," ").trim();const target=normal(lessons[current].target),actual=normal(heard);const similar=target===actual||target.includes(actual)||actual.includes(target);$("speechFeedback").textContent=similar?"Good effort! Your recognised words are close to the model phrase. Keep practising.":"Good practice. Compare the recognised words with the model phrase and try again. Automatic recognition is not a perfect pronunciation score.";};recognition.onerror=e=>$("speechFeedback").textContent="Microphone issue: "+e.error+". Check browser permission and try again.";recognition.onend=()=>{if($("speechFeedback").textContent.startsWith("Listening"))$("speechFeedback").textContent="Listening ended. You can try again.";};recognition.start();}catch(e){$("speechFeedback").textContent="Could not start microphone. Check permission and try again.";}}
function askTutor(){
 const q=$("aiMessage").value.trim().toLowerCase();
 if(!q){$("aiReply").textContent="Write a short question about this lesson first.";return;}
 const l=lessons[current];
 if(!l){$("aiReply").textContent="Open a lesson first, then ask your question.";return;}
 let reply="";
 if(/meaning|translate|translation|what does|means/.test(q)){
   reply="The target expression is "+l.target+" — "+l.meaning+". Listen to it, then repeat it aloud.";
 }else if(/grammar|rule|sentence|structure|why/.test(q)){
   reply=l.grammar+" Try using the target expression: "+l.target;
 }else if(/pronounc|say|speak|sound|listen/.test(q)){
   reply="The model phrase is "+l.target+" ("+l.meaning+"). Press “Listen to Arabic”, repeat it slowly, and compare your attempt with the model. Microphone recognition may not be available on every device.";
 }else{
   const match=l.vocab.find(([ar,en])=>q.includes(String(en).toLowerCase())||q.includes(String(ar).toLowerCase()));
   if(match) reply=match[0]+" means “"+match[1]+"”. Practise saying it aloud, then use it in a short sentence.";
   else reply="Good question! In this lesson, focus on: "+l.target+" — "+l.meaning+". "+l.practice+" You can also ask about the meaning, grammar, or pronunciation.";
 }
 $("aiReply").textContent="Tutor Takiyudeen: "+reply;
}
function certificate(){if(completed.size!==20)return;const name=$("certificateName").value.trim();if(!name){alert("Enter the name you want printed on the certificate.");return;}const win=window.open("","_blank");if(!win){alert("Allow pop-ups to print the certificate.");return;}const safe=name.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Arabic Conversation Certificate</title><style>body{font-family:Georgia,serif;background:#f5f1e5;padding:30px;color:#17372a}.cert{border:12px double #b99643;padding:50px;text-align:center;min-height:75vh;display:flex;flex-direction:column;justify-content:center}h1{font-size:38px;color:#12372a}.name{font-size:32px;color:#9b7726;border-bottom:1px solid #9b7726;padding:12px}p{font-size:18px;line-height:1.7}.arabic{font-size:28px}@media print{button{display:none}}</style></head><body><div class="cert"><p class="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><h1>Certificate of Completion</h1><p>This certificate is presented to</p><div class="name">${safe}</div><p>for completing all 20 lessons of the Arabic Conversation Academy.</p><p class="arabic">جَزَاكَ اللَّهُ خَيْرًا</p><p>Islamic Arabic Learning Dictionary<br> Tutor: Takiyudeen</p><p>Issued: ${new Date().toLocaleDateString()}</p><button onclick="window.print()">Print / Save as PDF</button></div></body></html>`);win.document.close();}
function initDaily(){const w=daily[Math.floor(Date.now()/86400000)%daily.length];$("dailyArabic").textContent=w[0];$("dailyMeaning").textContent=w[1];$("dailyListen").onclick=()=>say(w[0]);showReview();}
function allReview(){return lessons.flatMap(l=>l.vocab);}
function showReview(){const list=allReview();if(!list.length)return;const item=list[reviewIndex%list.length];$("reviewArabic").textContent=item[0];$("reviewMeaning").textContent=item[1];$("reviewMeaning").hidden=true;$("revealMeaning").textContent="Reveal meaning";}
async function boot(){
  // Attach controls immediately; lesson and account requests must not block the page.
  $("startLearning").onclick=()=>$("course").scrollIntoView({behavior:"smooth"});
  $("tutorGreeting").onclick=()=>say("السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ. أَهْلًا وَسَهْلًا بِكُمْ فِي أَكَادِيمِيَّةِ الْمُحَادَثَةِ بِاللُّغَةِ الْعَرَبِيَّةِ.");
  $("closeLesson").onclick=()=>{$("lessonModal").classList.remove("open");$("lessonModal").setAttribute("aria-hidden","true");if(recognition)try{recognition.stop()}catch{}};
  $("lessonModal").addEventListener("click",e=>{if(e.target.id==="lessonModal")$("closeLesson").click()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")$("closeLesson").click()});
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
  $("listenTarget").onclick=()=>{if(current>=0&&lessons[current])say(lessons[current].target)};
  $("recordSpeech").onclick=()=>{if(current>=0&&lessons[current])speechPractice()};
  $("checkAnswer").onclick=()=>{if(current<0||!lessons[current])return;if(selected<0){$("quizFeedback").textContent="Choose an answer first.";return;}if(selected===lessons[current].answer){$("quizFeedback").textContent="Correct! مُمْتَازٌ";$("quizFeedback").className="feedback good";$("completeLesson").disabled=false;$("checkAnswer").disabled=true;}else{$("quizFeedback").textContent="Not quite. Review the vocabulary and try again.";$("quizFeedback").className="feedback bad";}};
  $("completeLesson").onclick=completeLesson;
  $("playVisual").onclick=()=>{if(current<0||!lessons[current])return;const l=lessons[current];say(l.target+". "+l.meaning+". "+l.practice);$("visualStep").textContent="Narrating the target phrase and practice instruction using your device's Arabic speech voice.";};
  $("askTutor").onclick=askTutor;$("certificateButton").onclick=certificate;
  $("nextReview").onclick=()=>{reviewIndex++;showReview()};
  $("revealMeaning").onclick=()=>{$("reviewMeaning").hidden=!$("reviewMeaning").hidden;$("revealMeaning").textContent=$("reviewMeaning").hidden?"Reveal meaning":"Hide meaning"};
  initDaily();updateStreak();progress();

  // Start account verification in parallel; it no longer holds up lesson display.
  initSupabase();

  // A slow or offline request is bounded, and failure no longer prevents controls
  // above from being initialised.
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  try{
    const r=await fetch("./conversation-lessons.json",{signal:controller.signal});
    if(!r.ok)throw Error("Course content could not be loaded.");
    const data=await r.json();
    if(!Array.isArray(data)||data.length!==20)throw Error("The lesson data is incomplete.");
    lessons=data;lessonsError="";initDaily();progress();
  }catch(e){
    console.warn("Conversation Academy lesson data:",e);
    lessonsError="The 20 lessons could not load. Check your connection and refresh this page.";
    progress();
  }finally{clearTimeout(timeout);}
}
boot();
})();