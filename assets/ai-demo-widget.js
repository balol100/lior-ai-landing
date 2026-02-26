/* =========================================================
   Lior-AI "Unicorn" Hi-Tech Modal Agent (No backend)
   Premium UX: blur overlay, gradient header, micro-reasoning,
   typing indicator, stepper, smooth animations, WhatsApp CTA.
   WhatsApp: 050-8668022 => 972508668022
   ========================================================= */
(function () {
  const CFG = {
    title: "צ'אטבוט AI חכם",
    sub: "דמו פרימיום · סוכן שמרגיש כמו הייטק",
    whatsapp: "972508668022",
    anchor: "#contact",
    brand: "lior-ai.com",
    launcherSide: "left", // "left" or "right"
    launcherBottom: 18
  };

  /* ---------- Inject Styles ---------- */
  const css = `
  :root{
    --x-bg:#050713;
    --x-panel:#F4F6FA;
    --x-card:#FFFFFF;
    --x-text:#0B1220;
    --x-muted:#667085;
    --x-border:rgba(15,23,42,.10);
    --x-shadow:0 18px 55px rgba(0,0,0,.35);
    --x-shadow2:0 10px 26px rgba(0,0,0,.10);
    --x-r:26px;
    --x-r2:18px;
    --x-grad:linear-gradient(92deg,#1AD6C9 0%, #5B3CF4 55%, #A855F7 100%);
    --x-grad2:linear-gradient(135deg,rgba(26,214,201,.20),rgba(168,85,247,.18));
    --x-grad3:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.92));
  }
  #xai-launcher{
    position:fixed;
    ${CFG.launcherSide}:18px;
    bottom:${CFG.launcherBottom}px;
    width:64px;height:64px;border-radius:999px;
    border:none;cursor:pointer;z-index:99999;
    background:var(--x-grad);
    box-shadow:0 18px 40px rgba(0,0,0,.35);
    display:grid;place-items:center;
    transition:transform .18s ease, filter .18s ease;
  }
  #xai-launcher:hover{transform:translateY(-2px); filter:saturate(1.1)}
  #xai-launcher::after{
    content:"";
    position:absolute;inset:3px;
    border-radius:999px;
    background:rgba(7,10,18,.92);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);
  }
  #xai-launcher svg{position:relative;z-index:1}
  #xai-launcher .dot{
    position:absolute;right:7px;top:7px;
    width:10px;height:10px;border-radius:50%;
    background:#22C55E;
    box-shadow:0 0 0 3px rgba(34,197,94,.18);
    z-index:2;
  }

  #xai-overlay{
    position:fixed; inset:0; z-index:99998;
    display:none;
    align-items:center;
    justify-content:center;
    background:rgba(0,0,0,.42);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  #xai-sheet{
    width:min(560px, calc(100vw - 26px));
    height:min(78vh, 690px);
    background:var(--x-panel);
    border-radius:calc(var(--x-r) + 4px);
    box-shadow:var(--x-shadow);
    overflow:hidden;
    direction:rtl;
    font-family:Heebo, Arial, sans-serif;
    display:flex; flex-direction:column;
    animation:xai-pop .18s ease;
  }
  @keyframes xai-pop{from{transform:scale(.985);opacity:.7}to{transform:scale(1);opacity:1}}

  #xai-header{
    height:86px;
    background:var(--x-grad);
    position:relative;
    display:flex;
    align-items:flex-end;
    justify-content:flex-start;
    padding:14px 16px;
    box-shadow:0 14px 30px rgba(0,0,0,.18);
  }
  #xai-header::after{
    content:"";
    position:absolute; inset:0;
    background:radial-gradient(800px 120px at 20% 0%, rgba(255,255,255,.22), transparent 60%);
    pointer-events:none;
  }
  #xai-title{
    color:white; font-weight:900; font-size:28px; line-height:1.1; margin:0;
    letter-spacing:.2px;
  }
  #xai-sub{
    color:rgba(255,255,255,.86);
    font-size:13px; margin-top:6px;
    font-weight:600;
  }
  #xai-close{
    position:absolute; left:16px; top:16px;
    width:42px;height:42px;border-radius:14px;
    border:1px solid rgba(255,255,255,.30);
    background:rgba(0,0,0,.14);
    color:white; font-size:22px;
    cursor:pointer;
    display:grid;place-items:center;
    transition:transform .12s ease, background .12s ease;
  }
  #xai-close:hover{transform:scale(1.02); background:rgba(0,0,0,.20)}
  #xai-badge{
    position:absolute; right:16px; top:16px;
    padding:8px 10px;
    border-radius:999px;
    background:rgba(255,255,255,.16);
    border:1px solid rgba(255,255,255,.22);
    color:white; font-size:12px; font-weight:800;
    backdrop-filter: blur(8px);
  }

  #xai-body{
    padding:16px;
    overflow:auto;
    flex:1;
    background:
      radial-gradient(900px 420px at 30% 0%, rgba(26,214,201,.14), transparent 60%),
      radial-gradient(700px 360px at 90% 20%, rgba(168,85,247,.14), transparent 55%),
      var(--x-panel);
  }

  .xai-card{
    background:var(--x-card);
    border:1px solid rgba(15,23,42,.08);
    border-radius:18px;
    padding:14px 14px;
    margin:10px 0;
    box-shadow:var(--x-shadow2);
  }
  .xai-card.ai{background:var(--x-grad3)}
  .xai-step{
    font-size:12px;
    color:var(--x-muted);
    font-weight:700;
    margin-bottom:6px;
  }
  .xai-text{
    font-size:15px;
    color:var(--x-text);
    line-height:1.5;
    font-weight:600;
  }
  .xai-hint{
    margin-top:10px;
    font-size:13px;
    color:var(--x-muted);
    font-weight:600;
  }
  .xai-insight{
    margin-top:10px;
    padding:10px 12px;
    border-radius:14px;
    background:var(--x-grad2);
    border:1px solid rgba(91,60,244,.14);
    color:#111827;
    font-size:13px;
    font-weight:700;
  }
  .xai-choices{
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    margin-top:12px;
  }
  .xai-chip{
    border:none;
    cursor:pointer;
    padding:10px 12px;
    border-radius:999px;
    background:white;
    border:1px solid rgba(15,23,42,.10);
    box-shadow:0 8px 18px rgba(0,0,0,.06);
    font-size:14px;
    font-weight:800;
    color:#0B1220;
    transition:transform .12s ease, border-color .12s ease, box-shadow .12s ease;
  }
  .xai-chip:hover{
    transform:translateY(-1px);
    border-color:rgba(168,85,247,.40);
    box-shadow:0 12px 22px rgba(0,0,0,.08);
  }

  .xai-typing{
    display:flex; align-items:center; gap:10px;
    color:var(--x-muted);
    font-weight:800;
    font-size:13px;
  }
  .xai-dots{
    display:inline-flex; gap:4px;
  }
  .xai-dots i{
    width:6px;height:6px;border-radius:50%;
    background:#7C3AED;
    opacity:.25;
    animation:xai-dot 1.05s infinite;
  }
  .xai-dots i:nth-child(2){animation-delay:.15s}
  .xai-dots i:nth-child(3){animation-delay:.30s}
  @keyframes xai-dot{0%,100%{transform:translateY(0);opacity:.25}50%{transform:translateY(-3px);opacity:.8}}

  .xai-input{
    width:100%;
    margin-top:12px;
    border-radius:16px;
    border:1px solid rgba(15,23,42,.12);
    padding:12px 12px;
    font-family:inherit;
    font-size:14px;
    line-height:1.4;
    resize:none;
    background:white;
    box-shadow:0 10px 22px rgba(0,0,0,.06);
  }

  #xai-footer{
    padding:12px;
    border-top:1px solid rgba(15,23,42,.10);
    background:white;
    display:none;
    gap:10px;
    flex-wrap:wrap;
    justify-content:flex-start;
  }
  .xai-btn{
    cursor:pointer;
    border-radius:14px;
    padding:11px 14px;
    border:1px solid rgba(15,23,42,.12);
    background:#F7F8FC;
    font-family:inherit;
    font-weight:900;
    font-size:14px;
    color:#0B1220;
    transition:transform .12s ease, filter .12s ease;
  }
  .xai-btn:hover{transform:translateY(-1px); filter:saturate(1.05)}
  .xai-btn.primary{
    border:none;
    background:var(--x-grad);
    color:white;
    box-shadow:0 14px 28px rgba(91,60,244,.25);
  }
  .xai-mini{
    font-size:12px;
    color:var(--x-muted);
    font-weight:700;
    margin-top:8px;
  }

  /* Mobile tweaks */
  @media (max-width: 520px){
    #xai-sheet{height:min(86vh, 720px)}
    #xai-title{font-size:24px}
  }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Build DOM ---------- */
  const launcher = document.createElement("button");
  launcher.id = "xai-launcher";
  launcher.setAttribute("aria-label","Open AI chat");
  launcher.innerHTML = `
    <div class="dot"></div>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M7 9V7.7C7 6.2 8.2 5 9.7 5h4.6C15.8 5 17 6.2 17 7.7V9" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M9 13h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M7.4 19h9.2c2.2 0 4-1.8 4-4v-3c0-2.2-1.8-4-4-4H7.4c-2.2 0-4 1.8-4 4v3c0 2.2 1.8 4 4 4Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `;
  document.body.appendChild(launcher);

  const overlay = document.createElement("div");
  overlay.id = "xai-overlay";
  overlay.innerHTML = `
    <div id="xai-sheet" role="dialog" aria-modal="true">
      <div id="xai-header">
        <button id="xai-close" aria-label="Close">×</button>
        <div id="xai-badge">LIVE DEMO</div>
        <div>
          <h2 id="xai-title">${CFG.title}</h2>
          <div id="xai-sub">${CFG.sub}</div>
        </div>
      </div>
      <div id="xai-body"></div>
      <div id="xai-footer"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const body = overlay.querySelector("#xai-body");
  const footer = overlay.querySelector("#xai-footer");
  const closeBtn = overlay.querySelector("#xai-close");

  function open() {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
    reset();
    run();
  }
  function close() {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }
  launcher.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

  /* ---------- State + Flow ---------- */
  const state = { need:null, urgency:null, source:null, goal:"" };

  const steps = [
    {
      key:"need",
      step:"שלב 1/4",
      text:"כדי לדייק לך פתרון תוך 30 שניות — מה הכי נכון לך כרגע?",
      choices:[
        "דף נחיתה שמביא לידים",
        "אתר תדמית שמעלה אמון",
        "סוכן AI שמסנן פניות",
        "ייעוץ AI/קידום"
      ],
      insight:(v)=>{
        if(v.includes("דף נחיתה")) return "אם המטרה היא תוצאות מהר — דף נחיתה חד עם CTA אחד מנצח כמעט תמיד.";
        if(v.includes("אתר תדמית")) return "כשאמון הוא צוואר הבקבוק — אתר תדמית מסודר מעלה יחס סגירה גם בלי להגדיל תנועה.";
        if(v.includes("סוכן AI")) return "אם אתה מפספס פניות כשאתה לא זמין — סוכן AI סוגר את הפער 24/7 ומעלה איכות לידים.";
        return "כדי להתקדם חכם — נבנה מהלך שמתאים לשלב הצמיחה שלך, לא עוד 'טריק' שיווקי.";
      }
    },
    {
      key:"urgency",
      step:"שלב 2/4",
      text:"כמה זה דחוף?",
      choices:["דחוף (שבוע-שבועיים)","בקרוב (חודש)","בודק אופציות"],
      insight:(v)=>{
        if(v.includes("דחוף")) return "בדחוף — הולכים על מה שמייצר פניות הכי מהר, בלי פרויקטים ארוכים.";
        if(v.includes("בקרוב")) return "בחודש — אפשר לבנות גם תשתית אמון וגם מהלך לידים שירוץ קבוע.";
        return "בבדיקה — אני אתן לך מסלול ברור כדי שתדע בדיוק מה לעשות כשמחליטים ללחוץ גז.";
      }
    },
    {
      key:"source",
      step:"שלב 3/4",
      text:"איפה היום מגיעות רוב הפניות?",
      choices:["וואטסאפ","טלפון","טופס באתר","פייסבוק/אינסטגרם"],
      insight:(v)=>{
        if(v==="וואטסאפ") return "מעולה — וואטסאפ זה המקום הכי מהיר לסגור. נבנה תהליך שמוציא 'רק רציניים' אליך.";
        if(v==="טלפון") return "טלפון מבזבז זמן על סקרנים — פה סינון מוקדם נותן ROI מיידי.";
        if(v==="טופס באתר") return "טופס טוב, אבל בלי חוויה הוא קר. שיחה קצרה לפני הטופס מעלה המרות משמעותית.";
        return "סושיאל מביא הרבה רעש — סוכן סינון לפני שיחה זה ההבדל בין עומס לבין עסקאות.";
      }
    }
  ];

  function typing(ms=740){
    return new Promise((res)=>{
      const card = document.createElement("div");
      card.className = "xai-card ai";
      card.innerHTML = `
        <div class="xai-typing">
          <span>מחשב</span>
          <span class="xai-dots"><i></i><i></i><i></i></span>
        </div>
      `;
      body.appendChild(card);
      body.scrollTop = body.scrollHeight;
      setTimeout(()=>{ card.remove(); res(); }, ms + Math.random()*260);
    });
  }

  function cardHTML({step, text, hint, insight, choices, input}){
    const card = document.createElement("div");
    card.className = "xai-card ai";
    card.innerHTML = `
      <div class="xai-step">${step || ""}</div>
      <div class="xai-text">${text}</div>
      ${hint ? `<div class="xai-hint">${hint}</div>` : ""}
      ${insight ? `<div class="xai-insight">💡 ${insight}</div>` : ""}
    `;
    if(choices){
      const wrap = document.createElement("div");
      wrap.className = "xai-choices";
      choices.forEach(c=>{
        const b = document.createElement("button");
        b.className = "xai-chip";
        b.textContent = c;
        b.onclick = () => onChoice(c);
        wrap.appendChild(b);
      });
      card.appendChild(wrap);
    }
    if(input){
      const ta = document.createElement("textarea");
      ta.className = "xai-input";
      ta.rows = 2;
      ta.placeholder = "לדוגמה: להביא 10 פניות איכותיות / לסגור 2 עסקאות / לשפר המרות...";
      card.appendChild(ta);

      const wrap = document.createElement("div");
      wrap.className = "xai-choices";
      const b = document.createElement("button");
      b.className = "xai-chip";
      b.textContent = "סיום וסיכום";
      b.onclick = () => {
        state.goal = (ta.value || "").trim();
        finish();
      };
      wrap.appendChild(b);
      card.appendChild(wrap);
    }
    body.appendChild(card);
    body.scrollTop = body.scrollHeight;
  }

  let current = 0;
  async function run(){
    await typing();
    cardHTML({
      step:"פתיחה",
      text:`היי 👋 אני סוכן דמו של <b>${CFG.brand}</b>. אני מסנן פניות ומחזיר לך מה הצעד הכי נכון — מהר, בלי חפירות.`,
      hint:"3 לחיצות + משפט אחד. ואז תקבל סיכום 'יועץ' שאפשר לשלוח אליי בוואטסאפ."
    });
    await askNext();
  }

  async function askNext(){
    const s = steps[current];
    await typing();
    cardHTML({
      step:s.step,
      text:s.text,
      choices:s.choices
    });
  }

  async function onChoice(val){
    const s = steps[current];
    state[s.key] = val;

    // micro-reasoning
    await typing(560);
    cardHTML({
      step:"תובנה",
      text:`קיבלתי: <b>${val}</b>`,
      insight: s.insight(val)
    });

    current++;
    if(current < steps.length){
      await askNext();
    } else {
      await typing();
      cardHTML({
        step:"שלב 4/4",
        text:"במשפט אחד — מה הכי חשוב לך להשיג החודש?",
        input:true
      });
    }
  }

  function score(){
    let sc = 0;
    if((state.need||"").includes("סוכן AI")) sc += 3;
    if((state.need||"").includes("דף נחיתה")) sc += 2;
    if((state.need||"").includes("אתר תדמית")) sc += 2;
    if((state.need||"").includes("ייעוץ")) sc += 1;

    if((state.urgency||"").includes("דחוף")) sc += 4;
    else if((state.urgency||"").includes("בקרוב")) sc += 3;
    else sc += 1;

    if(state.source === "וואטסאפ") sc += 2;
    else if(state.source === "טלפון") sc += 2;
    else sc += 1;

    return Math.min(10, sc);
  }

  function level(sc){
    if(sc>=8) return {tag:"🟢 ליד חם", note:"כדאי לדבר היום."};
    if(sc>=5) return {tag:"🟡 ליד בינוני", note:"כדאי לדבר ב-24 שעות."};
    return {tag:"⚪ ליד קר", note:"אפשר לשלוח כיוון/חומר ולהמשיך בהמשך."};
  }

  function recommendation(){
    if((state.need||"").includes("סוכן AI")) {
      return {
        first:"להתחיל מסוכן AI שמסנן פניות באתר + הודעת וואטסאפ מוכנה.",
        why:"כי זה מייצר 'כיסוי 24/7' ומוציא אליך רק פניות עם כוונה אמיתית — בלי לבזבז זמן על סקרנים.",
        next:"להטמיע וידג'ט + 3–4 שאלות סינון, ואז למדוד שבוע ראשון: כמה שיחות מיותרות נחסכו."
      };
    }
    if((state.need||"").includes("דף נחיתה")) {
      return {
        first:"דף נחיתה חד עם CTA אחד (וואטסאפ/שיחה) + מסר אחד חזק.",
        why:"כי דף ממוקד מעלה המרות מהר יותר מאתר 'יפה' שלא סוגר.",
        next:"נכתוב הצעה אחת, 3 הוכחות אמון, ותהליך פנייה קצר—ואז מודדים."
      };
    }
    if((state.need||"").includes("אתר תדמית")) {
      return {
        first:"אתר תדמית קצר שמייצר אמון (הוכחות, תהליך עבודה, שאלות נפוצות) + CTA בכל מקטע.",
        why:"כי אנשים קונים 'ביטחון' לפני שהם משאירים פרטים.",
        next:"נבנה עמודים מינימליים + נקודות אמון + חיבור וואטסאפ."
      };
    }
    return {
      first:"ייעוץ קצר שממפה מטרות → קהל → מסר → משפך פניות.",
      why:"כי בלי מיקוד, גם AI וגם קידום נהיים רעש.",
      next:"בונים plan של 7 ימים עם 2-3 פעולות שמייצרות פניות."
    };
  }

  function buildSummary(){
    const sc = score();
    const lv = level(sc);
    const rec = recommendation();

    const goal = state.goal ? state.goal : "לא צוין";
    return [
      `${lv.tag} | ציון: ${sc}/10`,
      ``,
      `מטרה: ${goal}`,
      `מה נדרש: ${state.need}`,
      `דחיפות: ${state.urgency}`,
      `מקור פניות: ${state.source}`,
      ``,
      `מה מומלץ לעשות קודם: ${rec.first}`,
      `למה: ${rec.why}`,
      `השלב הבא: ${rec.next}`,
      ``,
      `—`,
      `נשלח מ־${CFG.brand}`
    ].join("\n");
  }

  async function finish(){
    const sc = score();
    const lv = level(sc);
    const rec = recommendation();
    const summary = buildSummary();

    await typing(720);
    cardHTML({
      step:"סיכום יועץ",
      text:`<b>${lv.tag}</b> · ציון <b>${sc}/10</b><br><br>
      <b>מטרה:</b> ${state.goal ? escapeHTML(state.goal) : "לא צוין"}<br>
      <b>מה נדרש:</b> ${escapeHTML(state.need)}<br>
      <b>דחיפות:</b> ${escapeHTML(state.urgency)}<br>
      <b>מקור פניות:</b> ${escapeHTML(state.source)}<br><br>
      <b>מה מומלץ לעשות קודם:</b> ${escapeHTML(rec.first)}<br>
      <b>למה:</b> ${escapeHTML(rec.why)}<br>
      <b>השלב הבא:</b> ${escapeHTML(rec.next)}
      `
    });

    footer.style.display = "flex";
    footer.innerHTML = "";

    const btnWA = document.createElement("button");
    btnWA.className = "xai-btn primary";
    btnWA.textContent = "שלח בוואטסאפ";
    btnWA.onclick = () => {
      const url = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(summary)}`;
      window.open(url, "_blank");
    };

    const btnCopy = document.createElement("button");
    btnCopy.className = "xai-btn";
    btnCopy.textContent = "העתק סיכום";
    btnCopy.onclick = async () => {
      try{
        await navigator.clipboard.writeText(summary);
        btnCopy.textContent = "הועתק ✅";
        setTimeout(()=>btnCopy.textContent="העתק סיכום", 1400);
      }catch(e){
        btnCopy.textContent = "לא הצליח";
        setTimeout(()=>btnCopy.textContent="העתק סיכום", 1400);
      }
    };

    const btnForm = document.createElement("button");
    btnForm.className = "xai-btn";
    btnForm.textContent = "לטופס יצירת קשר";
    btnForm.onclick = () => {
      close();
      const hash = CFG.anchor.replace("#","");
      if(hash) window.location.hash = hash;
    };

    footer.appendChild(btnWA);
    footer.appendChild(btnCopy);
    footer.appendChild(btnForm);

    const mini = document.createElement("div");
    mini.className = "xai-mini";
    mini.textContent = "טיפ: תשלח עכשיו בוואטסאפ — אני אענה לך עם הצעה ממוקדת לפי מה שבחרת.";
    footer.appendChild(mini);
  }

  function reset(){
    body.innerHTML = "";
    footer.style.display = "none";
    footer.innerHTML = "";
    current = 0;
    state.need = state.urgency = state.source = null;
    state.goal = "";
  }

  function escapeHTML(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

})();
