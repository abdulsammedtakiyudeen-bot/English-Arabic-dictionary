/* Arabic Video Learning main-page script. Existing learn.html already loads Supabase/config.js. */
(() => {
  const lessons = [
    ["Arabic Alphabet: First Letters","Learn the first Arabic letters and their sounds.","beginner",true,"c-7SVieC_04"],
    ["Reading Arabic: Alphabet Lesson 1","Recognize letters and begin reading simple words.","beginner",true,"2RcgfyuBlz8"],
    ["Letter Shapes at the Beginning, Middle and End","Understand how Arabic letters change shape.","beginner",true,""],
    ["Short Vowels: Fatha, Kasra and Damma","Practise the three short vowel marks.","beginner",true,""],
    ["Sukoon and Shadda","Understand stillness and doubled consonants.","beginner",true,""],
    ["Long Vowels: Alif, Waw and Ya","Hear and read long vowel sounds.","beginner",true,""],
    ["Joining Letters into Words","Connect letters and read simple words.","beginner",true,""],
    ["Arabic Pronunciation: Difficult Sounds","Practise commonly challenging Arabic sounds.","beginner",true,""],
    ["Greetings and Polite Expressions","Learn greetings and useful responses.","beginner",true,""],
    ["Introduce Yourself in Arabic","Say your name and basic information.","beginner",true,""],
    ["Numbers 1–10 and 11–20","Build confidence with everyday numbers.","beginner",true,""],
    ["Days, Months and Time","Ask and answer simple time questions.","beginner",true,""],
    ["Family and People","Learn words for family and people.","beginner",true,""],
    ["Everyday Objects and Places","Name things around you and common places.","beginner",true,""],
    ["Basic Verbs and Daily Activities","Use simple verbs in familiar contexts.","beginner",true,""],
    ["Simple Questions and Answers","Practise what, who, where and how.","beginner",true,""],
    ["Arabic Pronouns","Use common pronouns in simple sentences.","intermediate",false,""],
    ["Masculine and Feminine","Recognize grammatical gender.","intermediate",false,""],
    ["Demonstratives: This and That","Use هٰذَا and هٰذِهِ and related forms.","intermediate",false,""],
    ["Adjectives and Agreement","Describe people and things correctly.","intermediate",false,""],
    ["Present-Tense Verbs","Build common present-tense sentences.","intermediate",false,""],
    ["Past-Tense Verbs","Talk about completed actions.","intermediate",false,""],
    ["Prepositions and Place","Describe where things are.","intermediate",false,""],
    ["Everyday Conversations in Fusha","Follow short practical conversations.","intermediate",false,""],
    ["Sentence Building and Word Order","Combine ideas into clearer sentences.","advanced",false,""],
    ["Listening Comprehension: Slow Fusha","Train comprehension using careful speech.","advanced",false,""],
    ["Reading Short Paragraphs","Read and understand connected Arabic text.","advanced",false,""],
    ["Verb Patterns and Root Words","Notice common patterns and word families.","advanced",false,""],
    ["Longer Conversations and Responses","Understand longer exchanges and respond.","advanced",false,""],
    ["Advanced Listening and Comprehension","Review and strengthen independent comprehension.","advanced",false,""]
  ];
  const grid=document.getElementById("vLessonGrid");
  if(!grid || grid.dataset.ready==="1") return;
  grid.dataset.ready="1";
  const storageKey="iald_video_library_progress_v1";
  let completed=new Set();
  try{completed=new Set(JSON.parse(localStorage.getItem(storageKey)||"[]"))}catch(e){}
  let premium=false;
  const render=()=>{
    grid.innerHTML=lessons.map((l,i)=>{
      const n=i+1, isFree=l[3], video=l[4], level=l[2];
      const access=isFree?"FREE":"PREMIUM 🔒";
      const unavailable=!video;
      return `<article class="v-lesson-card" data-vnum="${n}" data-vlevel="${level}">
        <div class="v-num">${String(n).padStart(2,"0")}</div>
        <div class="v-card-copy"><span class="v-level">${level}</span><h3>${l[0]}</h3><p>${l[1]}</p></div>
        <span class="v-access">${access}</span>
        <button class="v-watch" type="button" ${unavailable||(!isFree&&!premium)?"disabled":""}>${unavailable?"Video coming soon":(!isFree&&!premium?"Premium · Upgrade":"Watch lesson")}</button>
        <div class="v-player" aria-label="Lesson ${n} video player"></div>
        <button class="v-complete" type="button" ${unavailable||(!isFree&&!premium)?"disabled":""}>${completed.has(n)?"✓ Watched":"Mark as watched"}</button>
      </article>`;
    }).join("");
    grid.querySelectorAll(".v-lesson-card").forEach(card=>{
      const n=+card.dataset.vnum, l=lessons[n-1], video=l[4], watch=card.querySelector(".v-watch"), complete=card.querySelector(".v-complete"), player=card.querySelector(".v-player");
      if(n>16&&!premium){card.classList.add("v-locked");watch.addEventListener("click",()=>location.href="./premium.html");return}
      if(!video)return;
      watch.addEventListener("click",()=>{
        if(!player.querySelector("iframe")){
          const iframe=document.createElement("iframe");
          iframe.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(video)+"?rel=0";
          iframe.title="Lesson "+n+": "+l[0];
          iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
          iframe.allowFullscreen=true;player.append(iframe);
        }
        player.classList.toggle("open");
        watch.textContent=player.classList.contains("open")?"Hide video":"Watch lesson";
      });
      complete.addEventListener("click",()=>{
        completed.add(n);localStorage.setItem(storageKey,JSON.stringify([...completed]));
        updateProgress();complete.textContent="✓ Watched";card.classList.add("v-done");
      });
    });
    document.querySelectorAll("[data-vfilter]").forEach(btn=>btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-vfilter]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
      grid.querySelectorAll(".v-lesson-card").forEach(card=>card.style.display=(btn.dataset.vfilter==="all"||card.dataset.vlevel===btn.dataset.vfilter)?"grid":"none");
    }));
    updateProgress();
  };
  function updateProgress(){
    const count=[...completed].filter(n=>n<=16).length;
    const label=document.getElementById("vProgressLabel"),bar=document.getElementById("vProgressBar");
    if(label)label.textContent=count+" of 16 free lessons marked complete";
    if(bar)bar.style.width=(count/16*100)+"%";
    grid.querySelectorAll(".v-lesson-card").forEach(card=>{if(completed.has(+card.dataset.vnum))card.classList.add("v-done")});
  }
  (async()=>{
    try{
      const client=window.supabase?.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
      if(client){const {data:{user}}=await client.auth.getUser();if(user){const {data}=await client.from("profiles").select("membership,premium_until").eq("id",user.id).maybeSingle();premium=!!data&&data.membership==="premium"&&Date.parse(data.premium_until)>Date.now()}}
    }catch(e){/* keep free lessons usable if membership lookup fails */}
    render();
  })();
})();
