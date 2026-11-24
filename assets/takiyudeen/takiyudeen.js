(() => {
  "use strict";
  const cfg = window.TAKIYUDEEN_CONFIG || {};
  const root = document.getElementById("takiyudeen-root");
  if (!root) return;

  const functionUrl = cfg.functionUrl ||
    (cfg.supabaseUrl ? cfg.supabaseUrl.replace(/\/$/, "") + "/functions/v1/takiyudeen-chat" : "");
  const limit = 10;

  root.innerHTML = `
    <button class="tk-launch" type="button" aria-label="Open TAKIYUDEEN">Ask TAKIYUDEEN</button>
    <section class="tk-panel" aria-label="TAKIYUDEEN Arabic learning assistant" aria-live="polite">
      <header class="tk-head"><div><div class="tk-brand">TAKIYUDEEN</div><div class="tk-sub">Arabic & Islamic Learning Assistant</div></div><button class="tk-close" type="button" aria-label="Close">×</button></header>
      <div class="tk-status">Free access: up to ${limit} questions daily for signed-in free members.</div>
      <div class="tk-messages"><div class="tk-msg tk-bot">As-salāmu ʿalaykum! I’m TAKIYUDEEN. I can help with beginner Arabic, vocabulary, grammar and basic Islamic knowledge. What would you like to learn?</div></div>
      <form class="tk-form"><input class="tk-input" maxlength="1000" autocomplete="off" placeholder="Ask in English or Arabic…" aria-label="Your question"><button class="tk-send" type="submit">Send</button></form>
      <div class="tk-foot">Learning support only. Ask a qualified scholar for personal religious rulings.</div>
    </section>`;

  const panel = root.querySelector(".tk-panel");
  const launch = root.querySelector(".tk-launch");
  const close = root.querySelector(".tk-close");
  const messages = root.querySelector(".tk-messages");
  const form = root.querySelector(".tk-form");
  const input = root.querySelector(".tk-input");
  const send = root.querySelector(".tk-send");
  const status = root.querySelector(".tk-status");

  launch.addEventListener("click", () => { panel.classList.add("tk-open"); input.focus(); });
  close.addEventListener("click", () => panel.classList.remove("tk-open"));

    function addMessage(text, who) {
    const el = document.createElement("div");
    el.className = "tk-msg " + (who === "user" ? "tk-user" : "tk-bot");
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function addChoices(question) {
    const q = question.toLowerCase();
    let choices = [];

    if (/salah|salat|prayer/.test(q)) {
      choices = ["Teach me the five daily prayers", "What is Wudu?", "What are the Five Pillars of Islam?"];
    } else if (/wudu|ablution/.test(q)) {
      choices = ["What is Salah?", "Teach me the Five Pillars of Islam"];
    } else if (/five pillars|pillars of islam/.test(q)) {
      choices = ["What is Shahadah?", "What is Zakat?", "What is Hajj?"];
    } else if (/ramadan|fasting|sawm/.test(q)) {
      choices = ["What is Zakat?", "What is Salah?", "What is the Qur'an?"];
    } else if (/arabic|alphabet|letters/.test(q)) {
      choices = ["Teach me Arabic numbers", "Teach me Arabic pronouns", "Teach me Arabic greetings"];
    } else if (/number|count/.test(q)) {
      choices = ["Teach me Arabic letters", "Teach me Arabic pronouns"];
    } else {
      choices = ["Teach me Arabic greetings", "What are the Five Pillars of Islam?", "What is Salah?"];
    }

    const area = document.createElement("div");
    area.className = "tk-choices";

    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tk-choice";
      button.textContent = choice;
      button.addEventListener("click", () => {
        input.value = choice;
        form.requestSubmit();
      });
      area.appendChild(button);
    });

    messages.appendChild(area);
    messages.scrollTop = messages.scrollHeight;
  }
    
  
  }

  async function getToken() {
    if (typeof cfg.getAccessToken === "function") return await cfg.getAccessToken();
    throw new Error("TAKIYUDEEN needs your signed-in Supabase session. Add getAccessToken in TAKIYUDEEN_CONFIG; see README.");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || send.disabled) return;
    if (!functionUrl) {
      addMessage("Setup is incomplete: the Supabase Edge Function URL has not been configured.", "bot");
      return;
    }
    addMessage(question, "user");
    input.value = "";
    send.disabled = true;
    input.disabled = true;
    send.textContent = "…";
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in to your Arabic Learning Dictionary account, then try again.");
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ question })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The assistant could not answer right now.");
      addMessage(data.answer || "I couldn't prepare an answer. Please try another question.", "bot");
addChoices(question);
      if (typeof data.remaining === "number") {
        status.textContent = data.premium ? "Premium access: unlimited questions." :
          `Free questions remaining today: ${data.remaining} of ${limit}.`;
      } else if (data.premium) status.textContent = "Premium access: unlimited questions.";
    } catch (error) {
      addMessage(error.message || "Something went wrong. Please try again.", "bot");
    } finally {
      send.disabled = false;
      input.disabled = false;
      send.textContent = "Send";
      input.focus();
    }
  });
})();
