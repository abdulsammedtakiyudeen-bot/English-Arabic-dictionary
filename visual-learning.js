(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const activitiesDone = new Set(JSON.parse(localStorage.getItem('vlStudioDone') || '[]'));
const words = [
  {emoji:'🏠',ar:'بَيْتٌ',latin:'baytun',en:'house'},
  {emoji:'📖',ar:'كِتَابٌ',latin:'kitābun',en:'book'},
  {emoji:'✏️',ar:'قَلَمٌ',latin:'qalamun',en:'pen'},
  {emoji:'🕌',ar:'مَسْجِدٌ',latin:'masjidun',en:'mosque'},
  {emoji:'🏫',ar:'مَدْرَسَةٌ',latin:'madrasatun',en:'school'},
  {emoji:'💧',ar:'مَاءٌ',latin:'māʾun',en:'water'}
];
function speak(text) {
  if (!('speechSynthesis' in window)) { alert('Audio speech is not supported by this browser.'); return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar';
  utterance.rate = 0.82;
  speechSynthesis.speak(utterance);
}
function markDone(id) {
  activitiesDone.add(id);
  localStorage.setItem('vlStudioDone', JSON.stringify([...activitiesDone]));
  updateProgress();
}
function updateProgress() {
  const count = activitiesDone.size;
  $('progress-count').textContent = `${count} activities completed`;
  $('progress-label').textContent = count ? 'You are making progress — keep going!' : 'Start your first activity';
  $('progress-fill').style.width = `${Math.min(100, count / 5 * 100)}%`;
}
function showActivity(id) {
  const panel = $('activity-panel'), content = $('activity-content');
  panel.hidden = false;
  let title = '';
  if (id === 'picture-words') {
    title = 'Picture Vocabulary';
    content.innerHTML = `<p class="vl-activity-intro">Tap the speaker to hear each Arabic word.</p><div class="vl-word-grid">${words.map((w,i)=>`<div class="vl-word"><div class="pic">${w.emoji}</div><div class="ar" lang="ar" dir="rtl">${w.ar}</div><small>${w.en} · ${w.latin}</small><p><button class="vl-action" data-say="${i}" type="button">🔊 Listen</button></p></div>`).join('')}</div>`;
    content.querySelectorAll('[data-say]').forEach(b=>b.addEventListener('click',()=>speak(words[Number(b.dataset.say)].ar)));
    markDone(id);
  } else if (id === 'flashcards') {
    title = 'Flip-and-Learn Flashcards';
    let index = 0, flipped = false;
    content.innerHTML = `<p>Tap the card to reveal its meaning. Use Next to continue.</p><div class="vl-flash" role="button" tabindex="0" id="flash-card"><div class="ar" lang="ar" dir="rtl"></div><strong id="flash-answer"></strong><small>Tap to flip</small></div><div class="vl-choices"><button class="vl-action" id="flash-speak">🔊 Listen</button><button class="vl-action" id="flash-next">Next card →</button></div>`;
    const draw=()=>{flipped=false;$('flash-card').querySelector('.ar').textContent=words[index].ar;$('flash-answer').textContent='';$('flash-card').querySelector('small').textContent='Tap to reveal the meaning';};
    $('flash-card').addEventListener('click',()=>{flipped=!flipped;$('flash-answer').textContent=flipped?`${words[index].en} (${words[index].latin})`:'';$('flash-card').querySelector('small').textContent=flipped?'Meaning revealed':'Tap to reveal the meaning';});
    $('flash-card').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('flash-card').click();}});
    $('flash-speak').addEventListener('click',()=>speak(words[index].ar));
    $('flash-next').addEventListener('click',()=>{index=(index+1)%words.length;draw();if(index===0)markDone(id);});
    draw();
  } else if (id === 'matching') {
    title = 'Match the Picture';
    let index = 0, score = 0;
    function draw(){
      const target=words[index], choices=[target,...words.filter(w=>w!==target).sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
      content.innerHTML=`<p>Which Arabic word means <strong>${target.en}</strong>?</p><div class="vl-word"><div class="pic">${target.emoji}</div><small>Choose the correct Arabic word</small></div><div class="vl-choices">${choices.map(w=>`<button class="vl-action" data-choice="${words.indexOf(w)}" lang="ar" dir="rtl">${w.ar}</button>`).join('')}</div><div class="vl-feedback" id="match-feedback" role="status"></div><small>Score: ${score} · Question ${index+1} of 5</small>`;
      content.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{
        const correct=Number(b.dataset.choice)===words.indexOf(target);
        $('match-feedback').textContent=correct?'✓ Correct! أحسنتَ':'Not quite. Try the next one!';
        $('match-feedback').style.color=correct?'#287246':'#9b4c2f';
        if(correct)score++;
        content.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);
        const next=document.createElement('button');next.className='vl-action';next.textContent=index===4?'Finish game':'Next question →';next.addEventListener('click',()=>{index++;if(index>=5){content.innerHTML=`<h3>Game complete!</h3><p>Your score: <strong>${score} / 5</strong></p><button class="vl-action" id="again">Play again</button>`;$('again').addEventListener('click',()=>{index=0;score=0;draw();});if(score>=3)markDone(id);}else draw();});content.append(next);
      }));
    }
    draw();
  } else if (id === 'listening') {
    title = 'Listen and Repeat';
    content.innerHTML=`<p>Listen to each word, then practise saying it. Your device needs an Arabic speech voice for audio playback.</p><div class="vl-word-grid">${words.slice(0,4).map((w,i)=>`<div class="vl-word"><div class="ar" lang="ar" dir="rtl">${w.ar}</div><strong>${w.en}</strong><p><button class="vl-action" data-listen="${i}">🔊 Play audio</button></p></div>`).join('')}</div><p><button class="vl-action" id="listening-done">I practised these words ✓</button></p>`;
    content.querySelectorAll('[data-listen]').forEach(b=>b.addEventListener('click',()=>speak(words[Number(b.dataset.listen)].ar)));
    $('listening-done').addEventListener('click',()=>{markDone(id);$('listening-done').textContent='Practice saved ✓';});
  }
  $('activity-title').textContent=title;
  panel.scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>showActivity(b.dataset.open)));
$('close-activity').addEventListener('click',()=>$('activity-panel').hidden=true);
updateProgress();

async function loadMembership() {
  const cards=[...document.querySelectorAll('[data-premium-card]')];
  try {
    if(!window.supabase||!window.SUPABASE_URL||!window.SUPABASE_PUBLISHABLE_KEY) throw new Error('Supabase configuration unavailable');
    const client=window.__supabaseClient||window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
    const {data:{session}}=await client.auth.getSession();
    if(!session?.user){$('premium-status').textContent='Sign in to check your membership';$('premium-copy').textContent='Your free learning activities are available here. Sign in to see your membership access.';return;}
    const {data,error}=await client.from('profiles').select('membership,premium_until').eq('id',session.user.id).maybeSingle();
    if(error) throw error;
    const active=data?.membership==='premium'&&(!data.premium_until||new Date(data.premium_until)>new Date());
    if(active){
      cards.forEach(c=>{c.classList.add('unlocked');c.querySelector('.vl-lock').textContent='✓ Premium member';});
      $('premium-status').textContent='Your Premium membership is active';
      $('premium-copy').textContent='Your existing premium courses, books and certificate pathway are ready to explore.';
      $('premium-link').textContent='Open Premium courses →';
      $('premium-link').href='./courses.html';
    }
  } catch(error) {
    console.warn('Membership status could not be checked:',error);
    $('premium-status').textContent='Premium membership';
    $('premium-copy').textContent='Membership status could not be checked right now. You can still explore the free activities above.';
  }
}
loadMembership();
})();