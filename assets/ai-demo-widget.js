/* =========================================================
   Lior-AI Chat Widget — Real Claude AI via Supabase
   ========================================================= */
(function () {
  const SUPABASE_URL = "https://evufisyrxfrwksequajt.supabase.co/functions/v1/claude-proxy";
  const CFG = {
    title: "Aria",
    sub: "נציגה חכמה · מסננת פניות 24/7",
    whatsapp: "972508668022",
    email: "liorbll100@gmail.com",
    brand: "lior-ai.com",
    launcherSide: "left",
    launcherBottom: 18,
    storageKey: "lior_ai_chat_v1",
    leadKey: "lior_ai_lead_v1"
  };

  /* ---------- CSS ---------- */
  const style = document.createElement("style");
  style.textContent = `
  :root{
    --xa-bg:#050713;
    --xa-panel:#F4F6FA;
    --xa-card:#FFFFFF;
    --xa-text:#0B1220;
    --xa-muted:#667085;
    --xa-border:rgba(15,23,42,.10);
    --xa-shadow:0 18px 55px rgba(0,0,0,.35);
    --xa-shadow2:0 10px 26px rgba(0,0,0,.10);
    --xa-r:26px;
    --xa-grad:linear-gradient(92deg,#1AD6C9 0%, #5B3CF4 55%, #A855F7 100%);
    --xa-grad2:linear-gradient(135deg,rgba(26,214,201,.20),rgba(168,85,247,.18));
    --xa-purple:#7C3AED;
  }
  #xa-launcher{
    position:fixed;
    ${CFG.launcherSide}:18px;
    bottom:${CFG.launcherBottom}px;
    width:64px;height:64px;border-radius:999px;
    border:none;cursor:pointer;z-index:99999;
    background:var(--xa-grad);
    box-shadow:0 18px 40px rgba(0,0,0,.35);
    display:grid;place-items:center;
    transition:transform .18s ease, filter .18s ease;
  }
  #xa-launcher:hover{transform:translateY(-2px);filter:saturate(1.1)}
  #xa-launcher::after{
    content:"";position:absolute;inset:3px;border-radius:999px;
    background:rgba(7,10,18,.92);box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);
  }
  #xa-launcher svg{position:relative;z-index:1}
  #xa-launcher .xa-dot{
    position:absolute;right:7px;top:7px;width:10px;height:10px;border-radius:50%;
    background:#22C55E;box-shadow:0 0 0 3px rgba(34,197,94,.18);z-index:2;
  }
  #xa-overlay{
    position:fixed;inset:0;z-index:99998;display:none;
    background:rgba(0,0,0,.42);backdrop-filter:blur(10px);
  }
  #xa-sheet{
    position:absolute;left:50%;top:50%;
    transform:translate(-50%,-50%);
    width:min(560px, calc(100vw - 26px));
    height:min(80vh, 700px);
    background:var(--xa-panel);
    border-radius:calc(var(--xa-r) + 4px);
    box-shadow:var(--xa-shadow);
    overflow:hidden;direction:rtl;
    font-family:Heebo, Arial, sans-serif;
    display:flex;flex-direction:column;
    animation:xa-pop .18s ease;
  }
  @keyframes xa-pop{from{transform:translate(-50%,-49%) scale(.985);opacity:.7}to{transform:translate(-50%,-50%) scale(1);opacity:1}}

  #xa-header{
    height:86px;background:var(--xa-grad);position:relative;
    display:flex;align-items:flex-end;justify-content:flex-start;
    padding:14px 16px;box-shadow:0 14px 30px rgba(0,0,0,.18);
  }
  #xa-header::after{
    content:"";position:absolute;inset:0;
    background:radial-gradient(800px 120px at 20% 0%,rgba(255,255,255,.22),transparent 60%);
    pointer-events:none;
  }
  #xa-title{color:white;font-weight:900;font-size:28px;line-height:1.1;margin:0;letter-spacing:.2px}
  #xa-sub{color:rgba(255,255,255,.86);font-size:13px;margin-top:6px;font-weight:600}
  #xa-close{
    position:absolute;left:16px;top:16px;width:42px;height:42px;border-radius:14px;
    border:1px solid rgba(255,255,255,.30);background:rgba(0,0,0,.14);
    color:white;font-size:22px;cursor:pointer;display:grid;place-items:center;
    transition:transform .12s ease,background .12s ease;
  }
  #xa-close:hover{transform:scale(1.02);background:rgba(0,0,0,.20)}
  #xa-reset-btn{
    position:absolute;left:66px;top:16px;width:42px;height:42px;border-radius:14px;
    border:1px solid rgba(255,255,255,.20);background:rgba(0,0,0,.10);
    color:white;font-size:16px;cursor:pointer;display:grid;place-items:center;
    transition:transform .12s ease;title:"איפוס שיחה";
  }
  #xa-reset-btn:hover{transform:scale(1.02);background:rgba(0,0,0,.20)}
  #xa-live{
    position:absolute;right:16px;top:16px;
    padding:8px 10px;border-radius:999px;
    background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);
    color:white;font-size:12px;font-weight:800;backdrop-filter:blur(8px);
  }

  #xa-quick{
    padding:10px 14px 0;display:flex;flex-wrap:wrap;gap:8px;
    border-bottom:1px solid var(--xa-border);padding-bottom:10px;
  }
  .xa-qa{
    border:1px solid var(--xa-border);background:white;color:var(--xa-text);
    padding:7px 11px;border-radius:999px;font-size:12px;font-weight:700;
    cursor:pointer;transition:border-color .12s,transform .12s;
  }
  .xa-qa:hover{border-color:rgba(168,85,247,.50);transform:translateY(-1px)}

  #xa-body{
    padding:14px;overflow:auto;flex:1;
    background:
      radial-gradient(900px 420px at 30% 0%,rgba(26,214,201,.10),transparent 60%),
      radial-gradient(700px 360px at 90% 20%,rgba(168,85,247,.10),transparent 55%),
      var(--xa-panel);
    scroll-behavior:smooth;
  }
  .xa-msg{display:flex;margin:8px 0;gap:8px}
  .xa-msg.user{justify-content:flex-start}
  .xa-msg.bot{justify-content:flex-end}
  .xa-bubble{
    max-width:86%;border-radius:18px;padding:10px 13px;
    line-height:1.45;font-size:14px;border:1px solid var(--xa-border);
    white-space:pre-wrap;word-break:break-word;font-family:Heebo,Arial,sans-serif;
  }
  .xa-bubble.user{background:white;box-shadow:var(--xa-shadow2);color:var(--xa-text)}
  .xa-bubble.bot{
    background:linear-gradient(180deg,rgba(255,255,255,.88),rgba(255,255,255,.95));
    border-color:rgba(91,60,244,.14);box-shadow:var(--xa-shadow2);
    color:var(--xa-text);white-space:normal;
  }
  .xa-bubble.bot strong{color:#5B3CF4;font-weight:700}
  .xa-bubble.bot em{color:#7C3AED;font-style:italic}
  .xa-bubble.bot ul{margin:6px 0;padding-right:18px;list-style:disc;color:var(--xa-text)}
  .xa-bubble.bot li{margin:3px 0}
  .xa-meta{margin-top:5px;font-size:11px;color:var(--xa-muted);display:flex;gap:8px;align-items:center;justify-content:flex-end}
  .xa-meta a{color:var(--xa-muted);text-decoration:none;border-bottom:1px dashed rgba(102,112,133,.35)}
  .xa-meta a:hover{color:var(--xa-purple)}

  .xa-typing{display:inline-flex;gap:5px;align-items:center;padding:10px 13px;border-radius:18px;
    background:linear-gradient(180deg,rgba(255,255,255,.88),rgba(255,255,255,.95));border:1px solid rgba(91,60,244,.14)}
  .xa-dot-anim{width:6px;height:6px;border-radius:50%;background:var(--xa-purple);opacity:.3;animation:xa-bounce 1.1s infinite ease-in-out}
  .xa-dot-anim:nth-child(2){animation-delay:.15s}
  .xa-dot-anim:nth-child(3){animation-delay:.30s}
  @keyframes xa-bounce{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-4px);opacity:.9}}

  #xa-compose{
    padding:12px;border-top:1px solid var(--xa-border);background:white;
    display:flex;gap:10px;align-items:flex-end;
  }
  #xa-input{
    flex:1;border:1px solid var(--xa-border);border-radius:16px;
    padding:10px 12px;font-family:Heebo,Arial,sans-serif;font-size:14px;
    line-height:1.4;resize:none;background:#F9FAFB;outline:none;
    min-height:44px;max-height:120px;color:var(--xa-text);
    transition:border-color .12s;
  }
  #xa-input:focus{border-color:rgba(91,60,244,.40)}
  #xa-send{
    width:46px;height:46px;border-radius:16px;flex:0 0 auto;border:none;
    background:var(--xa-grad);cursor:pointer;display:grid;place-items:center;
    box-shadow:0 8px 20px rgba(91,60,244,.30);transition:transform .12s,filter .12s;
  }
  #xa-send:hover{transform:translateY(-1px);filter:saturate(1.1)}
  #xa-send:disabled{opacity:.5;cursor:not-allowed;transform:none}
  #xa-send svg{width:18px;height:18px;fill:white}

  /* Lead Modal */
  #xa-lead-backdrop{
    position:absolute;inset:0;background:rgba(0,0,0,.50);
    display:none;align-items:center;justify-content:center;padding:16px;z-index:10;
  }
  #xa-lead-backdrop.open{display:flex}
  #xa-lead-modal{
    width:100%;border-radius:22px;border:1px solid var(--xa-border);
    background:white;box-shadow:var(--xa-shadow);overflow:hidden;
    font-family:Heebo,Arial,sans-serif;direction:rtl;
  }
  #xa-lead-head{
    padding:14px 16px 12px;border-bottom:1px solid var(--xa-border);
    display:flex;align-items:center;justify-content:space-between;
    font-weight:800;font-size:15px;color:var(--xa-text);
  }
  #xa-lead-body{padding:14px 16px 16px}
  .xa-field{margin-top:10px}
  .xa-label{font-size:12px;color:var(--xa-muted);font-weight:700;margin-bottom:5px}
  .xa-ctrl{
    width:100%;border:1px solid var(--xa-border);border-radius:14px;
    padding:10px 12px;font-family:Heebo,Arial,sans-serif;font-size:14px;
    color:var(--xa-text);outline:none;background:#F9FAFB;box-sizing:border-box;
    transition:border-color .12s;
  }
  .xa-ctrl:focus{border-color:rgba(91,60,244,.40)}
  #xa-lead-actions{display:flex;gap:10px;margin-top:14px}
  .xa-btn{
    flex:1;border-radius:14px;padding:11px 12px;font-family:Heebo,Arial,sans-serif;
    font-weight:800;font-size:14px;cursor:pointer;transition:transform .12s;
  }
  .xa-btn:hover{transform:translateY(-1px)}
  .xa-btn.secondary{border:1px solid var(--xa-border);background:#F4F6FA;color:var(--xa-text)}
  .xa-btn.primary{border:none;background:var(--xa-grad);color:white;box-shadow:0 10px 22px rgba(91,60,244,.25)}
  #xa-lead-hint{margin-top:10px;font-size:12px;color:var(--xa-muted);font-weight:600}
  #xa-lead-err{margin-top:8px;font-size:12px;color:#EF4444;display:none}
  #xa-lead-ok{margin-top:8px;font-size:12px;color:#22C55E;font-weight:700;display:none}

  @media(max-width:520px){
    #xa-sheet{height:min(90vh,720px)}
    #xa-title{font-size:22px}
  }
  `;
  document.head.appendChild(style);

  /* ---------- DOM ---------- */
  const launcher = document.createElement("button");
  launcher.id = "xa-launcher";
  launcher.setAttribute("aria-label", "פתח צ'אט AI");
  launcher.innerHTML = `
    <div class="xa-dot"></div>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M7 9V7.7C7 6.2 8.2 5 9.7 5h4.6C15.8 5 17 6.2 17 7.7V9" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M9 13h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M7.4 19h9.2c2.2 0 4-1.8 4-4v-3c0-2.2-1.8-4-4-4H7.4c-2.2 0-4 1.8-4 4v3c0 2.2 1.8 4 4 4Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `;
  document.body.appendChild(launcher);

  const overlay = document.createElement("div");
  overlay.id = "xa-overlay";
  overlay.innerHTML = `
    <div id="xa-sheet" role="dialog" aria-modal="true">
      <div id="xa-header">
        <button id="xa-close" aria-label="סגור">×</button>
        <button id="xa-reset-btn" title="איפוס שיחה" aria-label="איפוס שיחה">↺</button>
        <div id="xa-live">LIVE AI</div>
        <div>
          <h2 id="xa-title">${CFG.title}</h2>
          <div id="xa-sub">${CFG.sub}</div>
        </div>
      </div>
      <div id="xa-quick">
        <button class="xa-qa" data-q="כמה עולה סוכן AI?">מחיר <strong>סוכן AI</strong></button>
        <button class="xa-qa" data-q="כמה עולה דף נחיתה?">מחיר <strong>דף נחיתה</strong></button>
        <button class="xa-qa" data-q="כמה עולה אתר תדמית?">מחיר <strong>אתר תדמית</strong></button>
        <button class="xa-qa" data-q="אני רוצה הצעה">אני <strong>מעוניין</strong></button>
      </div>
      <div id="xa-body"></div>
      <div id="xa-compose">
        <textarea id="xa-input" rows="1" placeholder="כתבו כאן... (עברית)" autocomplete="off"></textarea>
        <button id="xa-send" aria-label="שליחה">
          <svg viewBox="0 0 24 24"><path d="M2 21 23 12 2 3v7l15 2-15 2v7z"/></svg>
        </button>
      </div>
      <!-- Lead Modal -->
      <div id="xa-lead-backdrop" role="dialog" aria-modal="true">
        <div id="xa-lead-modal">
          <div id="xa-lead-head">
            <span>נשאיר פרטים ונחזור אליך</span>
            <button class="xa-btn secondary" id="xa-lead-close" style="flex:0;padding:6px 12px;font-size:13px">✕</button>
          </div>
          <div id="xa-lead-body">
            <div class="xa-field"><div class="xa-label">שם</div><input class="xa-ctrl" id="xa-lead-name" placeholder="לדוגמה: דניאל" /></div>
            <div class="xa-field"><div class="xa-label">טלפון</div><input class="xa-ctrl" id="xa-lead-phone" placeholder="050-1234567" inputmode="tel" /></div>
            <div class="xa-field"><div class="xa-label">אימייל</div><input class="xa-ctrl" id="xa-lead-email" placeholder="example@email.com" inputmode="email" /></div>
            <div id="xa-lead-actions">
              <button class="xa-btn secondary" id="xa-lead-later">אחר כך</button>
              <button class="xa-btn primary" id="xa-lead-submit">שלח פרטים</button>
            </div>
            <div id="xa-lead-hint">או כתבו ישירות בוואטסאפ: <a href="https://wa.me/${CFG.whatsapp}" target="_blank" rel="noopener" style="color:#7C3AED">לחצו כאן</a></div>
            <div id="xa-lead-err"></div>
            <div id="xa-lead-ok">נשלח! תודה 🙌 נחזור אליך בהקדם.</div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ---------- Refs ---------- */
  const bodyEl    = overlay.querySelector("#xa-body");
  const inputEl   = overlay.querySelector("#xa-input");
  const sendBtn   = overlay.querySelector("#xa-send");
  const closeBtn  = overlay.querySelector("#xa-close");
  const resetBtn  = overlay.querySelector("#xa-reset-btn");
  const quickEl   = overlay.querySelector("#xa-quick");
  const leadBackdrop = overlay.querySelector("#xa-lead-backdrop");
  const leadClose    = overlay.querySelector("#xa-lead-close");
  const leadLater    = overlay.querySelector("#xa-lead-later");
  const leadSubmit   = overlay.querySelector("#xa-lead-submit");
  const leadName     = overlay.querySelector("#xa-lead-name");
  const leadPhone    = overlay.querySelector("#xa-lead-phone");
  const leadEmail    = overlay.querySelector("#xa-lead-email");
  const leadErr      = overlay.querySelector("#xa-lead-err");
  const leadOk       = overlay.querySelector("#xa-lead-ok");

  /* ---------- State ---------- */
  let messages = loadMsgs();
  let busy = false;

  function loadMsgs() {
    try { const r = localStorage.getItem(CFG.storageKey); return r ? JSON.parse(r) : []; } catch { return []; }
  }
  function saveMsgs() {
    localStorage.setItem(CFG.storageKey, JSON.stringify(messages.slice(-40)));
  }
  function hhmm() {
    return new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  }

  /* ---------- Render ---------- */
  function render() {
    bodyEl.innerHTML = "";
    if (messages.length === 0) {
      appendBubble("bot", `היי 👋 אני Aria, הסוכנת של ${CFG.brand}.\nרוצה לדעת על מחירים, סוכן AI, דף נחיתה — או להשאיר פרטים להצעה?`, { time: hhmm(), save: false });
      bodyEl.scrollTop = bodyEl.scrollHeight;
      return;
    }
    for (const m of messages) {
      appendBubble(m.role, m.text, { time: m.time, links: m.links, save: false });
    }
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function renderMarkdown(raw) {
    const esc = raw.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const lines = esc.split("\n");
    let html = "", inList = false;
    for (const line of lines) {
      const listMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
      if (listMatch) {
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + applyInline(listMatch[1]) + "</li>";
      } else {
        if (inList) { html += "</ul>"; inList = false; }
        html += line.trim() === "" ? "<br>" : applyInline(line) + "<br>";
      }
    }
    if (inList) html += "</ul>";
    return html.replace(/<br>$/, "");
  }
  function applyInline(s) {
    return s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
  }

  function appendBubble(role, text, opts = {}) {
    const wrap = document.createElement("div");
    wrap.className = "xa-msg " + (role === "user" ? "user" : "bot");
    const bub = document.createElement("div");
    bub.className = "xa-bubble " + (role === "user" ? "user" : "bot");
    if (role === "user") { bub.textContent = text; } else { bub.innerHTML = renderMarkdown(text); }
    wrap.appendChild(bub);
    if (opts.time || opts.links) {
      const meta = document.createElement("div");
      meta.className = "xa-meta";
      if (opts.time) { const s = document.createElement("span"); s.textContent = opts.time; meta.appendChild(s); }
      if (opts.links) {
        for (const lnk of opts.links) {
          const a = document.createElement("a");
          a.href = lnk.href; a.target = "_blank"; a.rel = "noopener"; a.textContent = lnk.label;
          meta.appendChild(a);
        }
      }
      wrap.appendChild(meta);
    }
    bodyEl.appendChild(wrap);
    if (opts.scroll !== false) bodyEl.scrollTop = bodyEl.scrollHeight;
    if (opts.save !== false) {
      const item = { role, text, time: opts.time || hhmm() };
      if (opts.links) item.links = opts.links;
      messages.push(item);
      saveMsgs();
    }
  }

  function showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "xa-msg bot"; wrap.id = "xa-typing-row";
    const t = document.createElement("div"); t.className = "xa-typing";
    t.innerHTML = `<span class="xa-dot-anim"></span><span class="xa-dot-anim"></span><span class="xa-dot-anim"></span>`;
    wrap.appendChild(t); bodyEl.appendChild(wrap);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }
  function hideTyping() { const el = document.getElementById("xa-typing-row"); if (el) el.remove(); }

  /* ---------- API ---------- */
  async function callAgent() {
    const payload = {
      messages: messages
        .filter(m => m.role === "user" || m.role === "assistant")
        .slice(-18)
        .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
      page_url: location.href
    };
    const res = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.json();
  }

  async function send(text) {
    const t = (text || "").trim();
    if (!t || busy) return;
    busy = true;
    sendBtn.disabled = true;
    appendBubble("user", t, { time: hhmm() });
    if (looksInterested(t)) openLead();
    showTyping();
    try {
      const data = await callAgent();
      const reply = (data && data.reply) ? String(data.reply) : "משהו השתבש. נסה שוב.";
      hideTyping();
      appendBubble("bot", reply, {
        time: hhmm(),
        links: [
          { label: "וואטסאפ", href: `https://wa.me/${CFG.whatsapp}` },
          { label: "אימייל", href: `mailto:${CFG.email}` }
        ]
      });
      if (data && data.collect_lead) openLead();
      if (data && Array.isArray(data.quick_actions) && data.quick_actions.length) updateQuick(data.quick_actions);
    } catch (e) {
      hideTyping();
      appendBubble("bot", "יש תקלה זמנית בחיבור. אפשר להשאיר פרטים או לפנות בוואטסאפ 🙏", {
        time: hhmm(),
        links: [{ label: "וואטסאפ", href: `https://wa.me/${CFG.whatsapp}` }]
      });
      openLead();
    } finally {
      busy = false;
      sendBtn.disabled = false;
      inputEl.value = ""; autoGrow();
      inputEl.focus();
    }
  }

  function updateQuick(actions) {
    quickEl.innerHTML = "";
    for (const q of actions.slice(0, 4)) {
      const b = document.createElement("button");
      b.className = "xa-qa"; b.textContent = q; b.dataset.q = q;
      quickEl.appendChild(b);
    }
  }

  function looksInterested(t) {
    const s = t.toLowerCase();
    return ["מעוניין","רוצה","הצעה","דבר איתי","לחזור","טלפון","וואטסאפ","פגישה","מחיר","כמה עולה","להתחיל","לסגור"].some(k => s.includes(k));
  }

  /* ---------- Lead Modal ---------- */
  function openLead() {
    if (localStorage.getItem(CFG.leadKey) === "1") return;
    leadErr.style.display = "none"; leadOk.style.display = "none";
    leadBackdrop.classList.add("open");
    setTimeout(() => leadName.focus(), 50);
  }
  function closeLead() { leadBackdrop.classList.remove("open"); }

  async function submitLead() {
    leadErr.style.display = "none"; leadOk.style.display = "none";
    const lead = {
      name: leadName.value.trim(),
      phone: leadPhone.value.trim(),
      email: leadEmail.value.trim(),
      source: "chat_widget",
      page_url: location.href
    };
    if (!lead.name || !lead.phone || !lead.email) {
      leadErr.textContent = "כדי שנחזור אליך — צריך שם, טלפון ואימייל.";
      leadErr.style.display = "block"; return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      leadErr.textContent = "האימייל לא נראה תקין. בדוק שוב 🙂";
      leadErr.style.display = "block"; return;
    }
    leadSubmit.disabled = true;
    try {
      const res = await fetch(SUPABASE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lead, page_url: location.href })
      });
      if (!res.ok) throw new Error(`${res.status}`);
      localStorage.setItem(CFG.leadKey, "1");
      leadOk.style.display = "block";
      appendBubble("bot", "קיבלתי ✅ נחזור אליך בהקדם עם הצעה מסודרת!", {
        time: hhmm(),
        links: [{ label: "וואטסאפ", href: `https://wa.me/${CFG.whatsapp}` }]
      });
      setTimeout(() => closeLead(), 900);
    } catch {
      leadErr.textContent = "לא הצלחתי לשמור כרגע. שלח וואטסאפ ונמשיך שם 🙏";
      leadErr.style.display = "block";
    } finally {
      leadSubmit.disabled = false;
    }
  }

  /* ---------- Open / Close ---------- */
  function openChat() {
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
    render();
    setTimeout(() => inputEl.focus(), 100);
  }
  function closeChat() {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  /* ---------- autoGrow ---------- */
  function autoGrow() {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
  }

  /* ---------- Events ---------- */
  launcher.addEventListener("click", openChat);
  closeBtn.addEventListener("click", closeChat);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeChat(); });

  resetBtn.addEventListener("click", () => {
    if (confirm("לאפס את השיחה?")) {
      messages = []; saveMsgs();
      localStorage.removeItem(CFG.leadKey);
      render();
    }
  });

  quickEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".xa-qa");
    if (btn) send(btn.dataset.q || btn.textContent.trim());
  });

  sendBtn.addEventListener("click", () => send(inputEl.value));
  inputEl.addEventListener("input", autoGrow);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(inputEl.value); }
  });

  leadClose.addEventListener("click", closeLead);
  leadLater.addEventListener("click", closeLead);
  leadBackdrop.addEventListener("click", (e) => { if (e.target === leadBackdrop) closeLead(); });
  leadSubmit.addEventListener("click", submitLead);
})();
