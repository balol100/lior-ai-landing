/* Lior-AI "NEXUS" Premium Agent 2026 – Dark Cyberpunk Edition */
(function () {
  const CFG = {
    name: "NEXUS",
    title: "סוכן AI NEXUS",
    subtitle: "ממוקד · מהיר · סוגר עסקאות 24/7",
    whatsapp: "972508668022",
    brand: "lior-ai.com",
    avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=Nexus&style=bigSmile",
    launcherSide: "right",
    launcherBottom: 24,
    primaryColor: "#00f0ff",
    accentColor: "#ff00aa"
  };

  const css = `
  :root {
    --bg: #0a0e1a;
    --panel: #111827;
    --card: #1e293b;
    --text: #e2e8f0;
    --muted: #94a3b8;
    --border: rgba(148,163,184,0.18);
    --glow: 0 0 24px rgba(0,240,255,0.28);
    --glow-accent: 0 0 32px rgba(255,0,170,0.22);
    --radius: 20px;
    --grad: linear-gradient(110deg, #00f0ff 0%, #7c3aed 48%, #ff00aa 100%);
    --grad-subtle: linear-gradient(135deg, rgba(0,240,255,0.12), rgba(124,58,237,0.10), rgba(255,0,170,0.09));
  }

  #nexus-launcher {
    position: fixed;
    ${CFG.launcherSide}: 24px;
    bottom: ${CFG.launcherBottom}px;
    width: 68px; height: 68px;
    border-radius: 50%;
    border: none;
    background: var(--grad);
    box-shadow: var(--glow), inset 0 0 0 1px rgba(255,255,255,0.14);
    cursor: pointer;
    z-index: 999999;
    display: grid; place-items: center;
    transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  #nexus-launcher:hover {
    transform: scale(1.14) translateY(-4px);
    box-shadow: 0 0 40px rgba(0,240,255,0.45), var(--glow-accent);
  }
  #nexus-launcher img {
    width: 42px; height: 42px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.22);
  }

  #nexus-overlay {
    position: fixed; inset: 0;
    background: rgba(5,7,18,0.78);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    z-index: 999998;
    display: none;
    align-items: center; justify-content: center;
  }

  #nexus-modal {
    width: min(94vw, 580px);
    max-height: 92vh;
    background: var(--panel);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--glow), 0 30px 90px rgba(0,0,0,0.55);
    overflow: hidden;
    display: flex; flex-direction: column;
    direction: rtl;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--text);
    animation: nexusFadeIn 0.32s ease-out;
  }
  @keyframes nexusFadeIn {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  #nexus-header {
    padding: 18px 22px;
    background: linear-gradient(135deg, rgba(0,240,255,0.14), rgba(124,58,237,0.11));
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  #nexus-header h2 {
    margin: 0;
    font-size: 1.9rem;
    font-weight: 800;
    background: var(--grad);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.5px;
  }
  #nexus-header .subtitle {
    font-size: 0.96rem;
    color: var(--muted);
    margin-top: 4px;
    font-weight: 500;
  }
  #nexus-close {
    position: absolute;
    left: 18px; top: 18px;
    width: 38px; height: 38px;
    border-radius: 12px;
    background: rgba(255,255,255,0.07);
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 1.5rem;
    cursor: pointer;
    display: grid; place-items: center;
    transition: all 0.2s;
  }
  #nexus-close:hover {
    background: rgba(255,0,170,0.22);
    color: white;
    transform: rotate(90deg);
  }

  #nexus-body {
    flex: 1;
    padding: 22px;
    overflow-y: auto;
    background: var(--grad-subtle);
  }

  .nexus-msg {
    margin: 14px 0;
    padding: 16px 18px;
    border-radius: 18px;
    background: var(--card);
    border: 1px solid var(--border);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    position: relative;
  }
  .nexus-msg.ai {
    background: linear-gradient(145deg, rgba(0,240,255,0.08), rgba(124,58,237,0.06));
    border-color: rgba(0,240,255,0.22);
  }
  .nexus-step {
    font-size: 0.82rem;
    color: var(--muted);
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: 0.6px;
  }
  .nexus-text {
    font-size: 1.05rem;
    line-height: 1.52;
  }
  .nexus-insight {
    margin-top: 12px;
    padding: 12px 16px;
    border-radius: 14px;
    background: rgba(0,240,255,0.09);
    border: 1px solid rgba(0,240,255,0.24);
    font-size: 0.94rem;
    color: #e0f7ff;
  }

  .nexus-options {
    display: flex; flex-wrap: wrap; gap: 12px;
    margin-top: 16px;
  }
  .nexus-chip {
    padding: 12px 20px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    color: var(--text);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.22s;
  }
  .nexus-chip:hover {
    background: rgba(0,240,255,0.18);
    border-color: #00f0ff;
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0,240,255,0.3);
  }

  .nexus-typing {
    display: flex; align-items: center; gap: 10px;
    color: var(--muted);
    font-size: 0.95rem;
    font-weight: 600;
  }
  .nexus-dots i {
    display: inline-block;
    width: 8px; height: 8px;
    background: #00f0ff;
    border-radius: 50%;
    opacity: 0.3;
    animation: nexusPulse 1.4s infinite;
  }
  .nexus-dots i:nth-child(2) { animation-delay: 0.2s; }
  .nexus-dots i:nth-child(3) { animation-delay: 0.4s; }
  @keyframes nexusPulse {
    0%,100% { transform: scale(1); opacity: 0.3; }
    50%     { transform: scale(1.6); opacity: 0.9; }
  }

  .nexus-input {
    width: 100%;
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.05);
    color: var(--text);
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.5;
    resize: none;
    box-sizing: border-box;
  }
  .nexus-input::placeholder { color: var(--muted); }
  .nexus-input:focus {
    outline: none;
    border-color: rgba(0,240,255,0.5);
    box-shadow: 0 0 0 3px rgba(0,240,255,0.12);
  }

  #nexus-footer {
    padding: 16px 22px;
    border-top: 1px solid var(--border);
    background: rgba(17,24,39,0.6);
    display: none;
    flex-wrap: wrap; gap: 12px;
  }
  .nexus-btn {
    padding: 14px 24px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.24s;
    font-family: inherit;
  }
  .nexus-btn.primary {
    background: var(--grad);
    color: white;
    border: none;
    box-shadow: 0 12px 32px rgba(0,240,255,0.35);
  }
  .nexus-btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 48px rgba(0,240,255,0.5);
  }
  .nexus-btn.secondary {
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--border);
    color: var(--text);
  }

  @media (max-width: 560px) {
    #nexus-modal { max-height: 96vh; border-radius: 0; }
    #nexus-body { padding: 18px; }
  }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ─── DOM ────────────────────────────────────────────────
  const launcher = document.createElement("button");
  launcher.id = "nexus-launcher";
  launcher.innerHTML = `<img src="${CFG.avatar}" alt="AI">`;
  document.body.appendChild(launcher);

  const overlay = document.createElement("div");
  overlay.id = "nexus-overlay";
  overlay.innerHTML = `
    <div id="nexus-modal" role="dialog">
      <div id="nexus-header">
        <button id="nexus-close">✕</button>
        <h2>${CFG.title}</h2>
        <div class="subtitle">${CFG.subtitle}</div>
      </div>
      <div id="nexus-body"></div>
      <div id="nexus-footer"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const body = overlay.querySelector("#nexus-body");
  const footer = overlay.querySelector("#nexus-footer");
  const closeBtn = overlay.querySelector("#nexus-close");

  function open()  { overlay.style.display = "flex"; document.body.style.overflow = "hidden"; reset(); run(); }
  function close() { overlay.style.display = "none";  document.body.style.overflow = ""; }
  launcher.onclick  = open;
  closeBtn.onclick  = close;
  overlay.onclick   = e => { if (e.target === overlay) close(); };

  // ─── Logic ──────────────────────────────────────────────
  const state = { need: "", urgency: "", source: "", goal: "" };
  let stepIndex = 0;

  const flow = [
    {
      step: "1/5",
      text: "מה הכי בוער לך עכשיו בעסק?",
      options: [
        "יותר לידים איכותיים בוואטסאפ",
        "אתר/דף נחיתה שסוגר יותר",
        "סוכן AI שמסנן + מדבר במקומי",
        "קידום ממומן עם ROI מטורף",
        "אני עדיין לא בטוח מה הכיוון"
      ]
    },
    {
      step: "2/5",
      text: "מה רמת הדחיפות שלך?",
      options: ["צריך עכשיו (7–14 יום)", "חודש–חודשיים", "בודק אפשרויות בשקט"]
    },
    {
      step: "3/5",
      text: "איפה רוב הפניות מגיעות היום?",
      options: ["וואטסאפ ישירות", "טלפון", "טופס באתר", "פייסבוק / אינסטגרם / טיקטוק"]
    },
    {
      step: "4/5",
      text: "מה המטרה הכי חשובה לך בחודש הקרוב? (במילים שלך)",
      input: true
    }
  ];

  async function type(ms = 800) {
    const el = document.createElement("div");
    el.className = "nexus-msg ai";
    el.innerHTML = `<div class="nexus-typing">NEXUS חושב<span class="nexus-dots"><i></i><i></i><i></i></span></div>`;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    await new Promise(r => setTimeout(r, ms + Math.random()*400));
    el.remove();
  }

  function addMessage(isAI, html) {
    const div = document.createElement("div");
    div.className = `nexus-msg ${isAI ? "ai" : ""}`;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  async function run() {
    await type(600);
    addMessage(true, `
      <div class="nexus-step">ברוכים הבאים</div>
      <div class="nexus-text">היי, אני <b>${CFG.name}</b> — הסוכן שחוסך לך אלפי שעות של שיחות מיותרות.<br>
      4–5 לחיצות ואתה מקבל תוכנית פעולה מדויקת + אפשרות לשלוח לי ישירות בוואטסאפ.</div>
    `);
    await askStep();
  }

  async function askStep() {
    const q = flow[stepIndex];
    await type();
    let html = `<div class="nexus-step">${q.step}</div><div class="nexus-text">${q.text}</div>`;

    if (q.input) {
      html += `<textarea id="nexus-goal" class="nexus-input" rows="3" placeholder="דוגמה: 15 לידים איכותיים בשבוע, או 40K ₪ הכנסה נוספת..."></textarea>`;
    }

    addMessage(true, html);

    if (q.options) {
      const wrap = document.createElement("div");
      wrap.className = "nexus-options";
      q.options.forEach(opt => {
        const b = document.createElement("button");
        b.className = "nexus-chip";
        b.textContent = opt;
        b.onclick = () => select(opt);
        wrap.appendChild(b);
      });
      body.lastChild.appendChild(wrap);
    } else if (q.input) {
      const btn = document.createElement("button");
      btn.className = "nexus-chip";
      btn.textContent = "סיים → קבל תוכנית";
      btn.style.marginTop = "16px";
      btn.onclick = () => {
        state.goal = document.getElementById("nexus-goal")?.value.trim() || "לא צוין";
        finish();
      };
      body.lastChild.appendChild(btn);
    }
  }

  async function select(value) {
    const keys = ["need", "urgency", "source"];
    state[keys[stepIndex]] = value;

    await type(500);
    addMessage(true, `
      <div class="nexus-step">תובנה מהירה</div>
      <div class="nexus-insight">קלטתי: <b>${value}</b><br>→ זה משנה את סדר העדיפויות בצורה משמעותית.</div>
    `);

    stepIndex++;
    await askStep();
  }

  function getPriorityScore() {
    let score = 0;
    if (state.need.includes("סוכן AI") || state.need.includes("לידים איכותיים")) score += 4;
    if (state.need.includes("דף נחיתה") || state.need.includes("אתר")) score += 3;
    if (state.urgency.includes("עכשיו") || state.urgency.includes("7–14")) score += 5;
    if (state.source === "וואטסאפ ישירות") score += 3;
    return Math.min(10, score);
  }

  function getRecommendation() {
    if (state.need.includes("סוכן AI")) {
      return {
        title: "סוכן AI + סינון אגרסיבי",
        reason: "חוסך 60–80% מזמן השיחות המיותרות ומעלה אחוז סגירה של פניות אמיתיות.",
        firstStep: "הטמעת וידג'ט + 4 שאלות סינון + תגובה אוטומטית חכמה בוואטסאפ"
      };
    }
    if (state.need.includes("לידים איכותיים") || state.need.includes("דף נחיתה") || state.need.includes("אתר")) {
      return {
        title: "דף נחיתה ממוקד + וואטסאפ CTA",
        reason: "המרות גבוהות פי 3–5 מדף גנרי. פחות תנועה = יותר רווח.",
        firstStep: "כתיבת copy מנצח + 3 הוכחות אמון + A/B test של כותרות"
      };
    }
    return {
      title: "אסטרטגיה ממוקדת + בדיקת שוק מהירה",
      reason: "בלי בסיס חזק — גם AI וגם קידום מבזבזים כסף.",
      firstStep: "מיפוי קהל + 3 מסרים ראשונים + טסט של 7 ימים"
    };
  }

  async function finish() {
    await type(900);
    const score = getPriorityScore();
    const rec = getRecommendation();

    const tag = score >= 8 ? "🟢 HOT LEAD – לדבר היום" :
                score >= 5 ? "🟡 WARM – בתוך 24–36 שעות" :
                             "⚪ COLD – לשלוח חומר + המשך מאוחר יותר";

    addMessage(true, `
      <div class="nexus-step">תוכנית פעולה מומלצת</div>
      <div class="nexus-text">
        <b>${tag}</b> · ציון התאמה ${score}/10<br><br>
        <b>מטרה:</b> ${state.goal || "לא צוין"}<br>
        <b>צורך עיקרי:</b> ${state.need}<br>
        <b>דחיפות:</b> ${state.urgency}<br>
        <b>מקור פניות:</b> ${state.source}<br><br>
        <b>המלצה ראשונית:</b> ${rec.title}<br>
        <b>למה דווקא זה:</b> ${rec.reason}<br>
        <b>מה לעשות השבוע:</b> ${rec.firstStep}
      </div>
    `);

    footer.style.display = "flex";

    const summary = [
      `${tag} | ${score}/10`,
      ``,
      `מטרה: ${state.goal || "לא צוין"}`,
      `צורך: ${state.need}`,
      `דחיפות: ${state.urgency}`,
      `מקור: ${state.source}`,
      ``,
      `המלצה: ${rec.title}`,
      `למה: ${rec.reason}`,
      `מה לעשות עכשיו: ${rec.firstStep}`,
      ``,
      `— נוצר על ידי ${CFG.name} • ${CFG.brand}`
    ].join("\n");

    const waBtn = document.createElement("button");
    waBtn.className = "nexus-btn primary";
    waBtn.textContent = "שלח לי בוואטסאפ עכשיו";
    waBtn.onclick = () => window.open(`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(summary)}`, "_blank");

    const copyBtn = document.createElement("button");
    copyBtn.className = "nexus-btn secondary";
    copyBtn.textContent = "העתק סיכום";
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(summary);
        copyBtn.textContent = "הועתק! 🚀";
        setTimeout(() => copyBtn.textContent = "העתק סיכום", 1800);
      } catch {
        copyBtn.textContent = "שגיאה בהעתקה";
        setTimeout(() => copyBtn.textContent = "העתק סיכום", 1800);
      }
    };

    footer.append(waBtn, copyBtn);
  }

  function reset() {
    body.innerHTML = "";
    footer.style.display = "none";
    footer.innerHTML = "";
    stepIndex = 0;
    Object.keys(state).forEach(k => state[k] = "");
  }
})();
