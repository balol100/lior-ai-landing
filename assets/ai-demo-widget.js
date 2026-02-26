(function () {
  'use strict';

  // ── CONFIG ───────────────────────────────────────────────────────────────────
  var WHATSAPP_NUMBER = '972508668022';
  var CONTACT_ANCHOR  = '#contact';
  var TYPING_MIN      = 620;
  var TYPING_MAX      = 920;

  // ── FLOW STEPS ───────────────────────────────────────────────────────────────
  var STEPS = [
    {
      id:       'service',
      question: 'מה הכי נכון לך כרגע?',
      type:     'quick',
      options: [
        { label: 'דף נחיתה שמביא לידים', value: 'landing',     score: 3 },
        { label: 'אתר תדמית שמעלה אמון', value: 'website',     score: 3 },
        { label: 'סוכן AI שמסנן פניות',  value: 'ai_agent',    score: 4 },
        { label: 'ייעוץ AI / קידום',      value: 'consulting',  score: 2 }
      ],
      insight: {
        landing:    'כדי להביא לידים מהר, דף נחיתה חד עם CTA אחד הוא הכי אפקטיבי.',
        website:    'אתר תדמית חזק בונה אמינות ומאפשר ללקוח להכיר אותך לפני שמתקשר.',
        ai_agent:   'אם אתה מפספס פניות כשאתה לא זמין—סוכן AI סוגר את הפער 24/7.',
        consulting: 'ייעוץ AI יכול לחסוך עשרות שעות בחודש ולשפר תהליכים קיימים.'
      }
    },
    {
      id:       'urgency',
      question: 'כמה זה דחוף?',
      type:     'quick',
      options: [
        { label: 'דחוף (שבוע-שבועיים)', value: 'urgent',   score: 4 },
        { label: 'בקרוב (חודש)',         value: 'soon',     score: 2 },
        { label: 'בודק אופציות',         value: 'browsing', score: 0 }
      ],
      insight: {
        urgent:   'כשהדד-ליין קרוב, נתחיל מהפעולה שמביאה תוצאה הכי מהר.',
        soon:     'יש לנו זמן לעשות את זה נכון—אפיון מדויק = פחות תיקונים.',
        browsing: 'גם בשלב הבדיקה כדאי לדעת מה מתאים—זה חוסך זמן בהמשך.'
      }
    },
    {
      id:       'source',
      question: 'איפה היום מגיעות רוב הפניות?',
      type:     'quick',
      options: [
        { label: 'וואטסאפ',            value: 'whatsapp', score: 2 },
        { label: 'טלפון',              value: 'phone',    score: 2 },
        { label: 'טופס באתר',          value: 'form',     score: 1 },
        { label: 'פייסבוק / אינסטגרם', value: 'social',   score: 1 }
      ],
      insight: {
        whatsapp: 'אם הלקוחות כבר בוואטסאפ, נוודא שכל ליד מגיע לשם חלק.',
        phone:    'שיחת טלפון = כוונת רכישה גבוהה. נבנה את זה כ-CTA ראשי.',
        form:     'טופס טוב הוא נקודת המדידה הכי קלה לשיפור ולאופטימיזציה.',
        social:   'תנועה מסושיאל צריכה דף נחיתה ייעודי שממיר אותה—לא לבזבז קליקים.'
      }
    },
    {
      id:          'goal',
      question:    'במשפט אחד—מה הכי חשוב לך להשיג החודש?',
      type:        'text',
      placeholder: 'למשל: "להגדיל לידים ב-30%" או "לעלות לאוויר עם אתר חדש"'
    }
  ];

  // ── SUMMARY COPY ─────────────────────────────────────────────────────────────
  var GOAL_MAP = {
    landing:    'הגדלת לידים ממוקדים דרך דף נחיתה',
    website:    'בניית אמינות ונוכחות דיגיטלית חזקה',
    ai_agent:   'אוטומציה של תהליך קבלת פניות עם סוכן AI',
    consulting: 'שיפור תהליכים עסקיים עם כלי AI'
  };

  var WHAT_FIRST_MAP = {
    landing:    'בניית דף נחיתה ממוקד עם CTA ברור',
    website:    'אפיון ובניית אתר תדמית שמייצר פניות',
    ai_agent:   'הטמעת סוכן AI שמנהל פניות 24/7',
    consulting: 'מיפוי תהליכים ובניית רוד-מפ AI'
  };

  var WHY_MAP = {
    landing:    'דף נחיתה ממוקד מייצר יחס המרה גבוה יותר מאתר כללי.',
    website:    'לקוחות שמחפשים שירות קודם בודקים אמינות—אתר חזק סוגר את הפער.',
    ai_agent:   'עסקים מפספסים פניות כשהם לא זמינים—AI נותן מענה מיידי בכל שעה.',
    consulting: 'כלי AI נכונים חוסכים שעות עבודה ומגדילים יכולת טיפול בלקוחות.'
  };

  var NEXT_STEP_MAP = {
    urgent:   'שיחה קצרה השבוע להבנת הצרכים ← הצעה מותאמת ← התחלת עבודה.',
    soon:     'שלח פרטים, נקבע שיחת אפיון ונגדיר יחד מה ה-MVP.',
    browsing: 'שלח הודעה בוואטסאפ ואשלח מידע + דוגמאות רלוונטיות.'
  };

  // ── SCORING ──────────────────────────────────────────────────────────────────
  function calcScore(answers) {
    var s = 0;
    STEPS.forEach(function (step) {
      if (!step.options) return;
      var chosen = step.options.filter(function (o) { return o.value === answers[step.id]; })[0];
      if (chosen) s += chosen.score;
    });
    if (answers.goal && answers.goal.trim().length > 20) s += 1;
    return Math.min(s, 10);
  }

  function getScoreInfo(score) {
    if (score >= 8) return { label: 'ליד חם',     emoji: '🟢', color: '#00e5a0', textColor: '#03201a' };
    if (score >= 5) return { label: 'ליד בינוני', emoji: '🟡', color: '#f0c040', textColor: '#1a1200' };
    return             { label: 'ליד קר',     emoji: '⚪', color: '#4a4f66', textColor: '#c0c4d6' };
  }

  function getOptionLabel(stepId, value) {
    var step = STEPS.filter(function (s) { return s.id === stepId; })[0];
    if (!step || !step.options) return value || '';
    var opt = step.options.filter(function (o) { return o.value === value; })[0];
    return opt ? opt.label : (value || '');
  }

  // ── WHATSAPP SUMMARY TEXT ────────────────────────────────────────────────────
  function buildSummaryText(answers, score) {
    var si = getScoreInfo(score);
    return [
      'היי ליאור! הגעתי מהדמו באתר שלך.',
      '',
      '🎯 מטרה: '      + (GOAL_MAP[answers.service]       || ''),
      '✅ מה קודם: '   + (WHAT_FIRST_MAP[answers.service] || ''),
      '💡 למה: '       + (WHY_MAP[answers.service]        || ''),
      '🚀 השלב הבא: '  + (NEXT_STEP_MAP[answers.urgency]  || ''),
      si.emoji + ' ציון ליד: ' + score + '/10 – ' + si.label,
      '',
      '📋 הפרטים שלי:',
      '• מה אני מחפש: ' + getOptionLabel('service', answers.service),
      '• דחיפות: '      + getOptionLabel('urgency', answers.urgency),
      '• פניות מ: '     + getOptionLabel('source',  answers.source),
      '• המטרה החודש: ' + (answers.goal || '—')
    ].join('\n');
  }

  // ── DOM HELPERS ───────────────────────────────────────────────────────────────
  function mk(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if      (k === 'html') { n.innerHTML    = attrs[k]; }
        else if (k === 'text') { n.textContent  = attrs[k]; }
        else                   { n.setAttribute(k, attrs[k]); }
      });
    }
    return n;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  function $id(id) { return document.getElementById(id); }

  function scrollBottom() {
    var b = $id('adw-body');
    if (b) setTimeout(function () { b.scrollTop = b.scrollHeight; }, 40);
  }

  // ── STATE ────────────────────────────────────────────────────────────────────
  var state = {
    open:    false,
    started: false,
    busy:    false,
    answers: {}
  };

  // ── TYPING INDICATOR ─────────────────────────────────────────────────────────
  function showTyping() {
    var body = $id('adw-body');
    if (!body) return;
    var d = mk('div', 'adw-bubble adw-bubble-bot adw-typing', { id: 'adw-typing-ind' });
    d.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(d);
    scrollBottom();
  }

  function hideTyping() {
    var t = $id('adw-typing-ind');
    if (t) t.parentNode.removeChild(t);
  }

  // ── APPEND HELPERS ────────────────────────────────────────────────────────────
  function appendBot(htmlContent, extraCls) {
    var body = $id('adw-body');
    if (!body) return null;
    var d = mk('div', 'adw-bubble adw-bubble-bot' + (extraCls ? ' ' + extraCls : ''));
    d.innerHTML = htmlContent;
    body.appendChild(d);
    scrollBottom();
    return d;
  }

  function appendUser(text) {
    var body = $id('adw-body');
    if (!body) return;
    var d = mk('div', 'adw-bubble adw-bubble-user', { text: text });
    body.appendChild(d);
    scrollBottom();
  }

  function removeById(id) {
    var el = $id(id);
    if (el) el.parentNode.removeChild(el);
  }

  // ── TYPING DELAY WRAPPER ─────────────────────────────────────────────────────
  function withTyping(fn) {
    if (state.busy) return;
    state.busy = true;
    showTyping();
    var ms = TYPING_MIN + Math.random() * (TYPING_MAX - TYPING_MIN);
    setTimeout(function () {
      hideTyping();
      state.busy = false;
      fn();
    }, ms);
  }

  // ── STEP INDICATOR ────────────────────────────────────────────────────────────
  function setStep(n) {
    var el = $id('adw-step');
    if (el) el.textContent = 'שלב ' + n + '/4';
  }

  // ── QUICK-REPLY OPTIONS ───────────────────────────────────────────────────────
  function showOptions(stepIndex) {
    var body  = $id('adw-body');
    var step  = STEPS[stepIndex];
    if (!body || !step.options) return;
    var wrap = mk('div', 'adw-options', { id: 'adw-opts' });
    step.options.forEach(function (opt) {
      var btn = mk('button', 'adw-option-btn', { text: opt.label });
      btn.addEventListener('click', function () {
        if (state.busy) return;
        onQuickReply(stepIndex, opt);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollBottom();
  }

  // ── TEXT INPUT ────────────────────────────────────────────────────────────────
  function showTextInput(placeholder) {
    var body = $id('adw-body');
    if (!body) return;
    var wrap = mk('div', 'adw-text-input-wrap', { id: 'adw-text-wrap' });
    var ta   = mk('textarea', 'adw-text-input');
    ta.setAttribute('placeholder', placeholder);
    ta.setAttribute('rows', '3');
    ta.setAttribute('dir', 'rtl');
    var btn = mk('button', 'adw-send-btn', { html: 'שלח ←', type: 'button' });

    function submit() {
      var val = ta.value.trim();
      if (!val || state.busy) return;
      removeById('adw-text-wrap');
      appendUser(val);
      state.answers.goal = val;
      withTyping(showSummary);
    }

    btn.addEventListener('click', submit);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
    });

    wrap.appendChild(ta);
    wrap.appendChild(btn);
    body.appendChild(wrap);
    setTimeout(function () { ta.focus(); }, 100);
    scrollBottom();
  }

  // ── FLOW STEPS ────────────────────────────────────────────────────────────────
  function askStep(idx) {
    var step = STEPS[idx];
    setStep(idx + 1);
    appendBot(esc(step.question));
    if (step.type === 'text') {
      showTextInput(step.placeholder);
    } else {
      showOptions(idx);
    }
  }

  function onQuickReply(stepIdx, opt) {
    removeById('adw-opts');
    appendUser(opt.label);
    state.answers[STEPS[stepIdx].id] = opt.value;

    var insight = STEPS[stepIdx].insight && STEPS[stepIdx].insight[opt.value];
    withTyping(function () {
      if (insight) appendBot('<em class="adw-insight">' + esc(insight) + '</em>');
      var next = stepIdx + 1;
      if (next < STEPS.length) {
        setTimeout(function () { askStep(next); }, insight ? 280 : 0);
      } else {
        setTimeout(showSummary, insight ? 280 : 0);
      }
    });
  }

  // ── SUMMARY ───────────────────────────────────────────────────────────────────
  function showSummary() {
    setStep(4);
    var answers     = state.answers;
    var score       = calcScore(answers);
    var si          = getScoreInfo(score);
    var summaryText = buildSummaryText(answers, score);

    var html =
      '<div class="adw-sum-header">' +
        '<span class="adw-sum-title">הנה הסיכום שלי</span>' +
        '<span class="adw-score-badge" style="background:' + si.color + ';color:' + si.textColor + '">' +
          si.emoji + ' ' + si.label + ' &middot; ' + score + '/10' +
        '</span>' +
      '</div>' +
      '<div class="adw-sum-rows">' +
        sumRow('🎯', 'מטרה',      GOAL_MAP[answers.service]       || '') +
        sumRow('✅', 'מה קודם',   WHAT_FIRST_MAP[answers.service] || '') +
        sumRow('💡', 'למה',       WHY_MAP[answers.service]        || '') +
        sumRow('🚀', 'השלב הבא',  NEXT_STEP_MAP[answers.urgency]  || '') +
      '</div>' +
      '<div class="adw-sum-answers">' +
        '<div class="adw-sum-ans-title">הפרטים שלך</div>' +
        ansRow('מה מחפש', getOptionLabel('service', answers.service)) +
        ansRow('דחיפות',  getOptionLabel('urgency', answers.urgency)) +
        ansRow('פניות מ', getOptionLabel('source',  answers.source))  +
        (answers.goal ? ansRow('המטרה', answers.goal) : '') +
      '</div>';

    appendBot(html, 'adw-summary-bubble');

    // Action buttons
    var body = $id('adw-body');
    if (!body) return;

    var waBtn = mk('a', 'adw-btn adw-btn-primary', {
      href:   'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(summaryText),
      target: '_blank',
      rel:    'noopener noreferrer',
      html:   '💬 שלח בוואטסאפ'
    });

    var formBtn = mk('a', 'adw-btn adw-btn-secondary', {
      href: CONTACT_ANCHOR,
      html: '📝 לטופס יצירת קשר'
    });
    formBtn.addEventListener('click', closeWidget);

    var copyBtn = mk('button', 'adw-btn adw-btn-ghost', { html: '📋 העתק סיכום' });
    copyBtn.addEventListener('click', function () {
      function done() {
        copyBtn.innerHTML = '✅ הועתק!';
        setTimeout(function () { copyBtn.innerHTML = '📋 העתק סיכום'; }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summaryText).then(done).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = summaryText;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;width:1px;height:1px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* silent */ }
        document.body.removeChild(ta);
        done();
      }
    });

    var restart = mk('button', 'adw-restart', { text: 'התחל מחדש' });
    restart.addEventListener('click', resetWidget);

    var actions = mk('div', 'adw-actions');
    actions.appendChild(waBtn);
    actions.appendChild(formBtn);
    actions.appendChild(copyBtn);
    actions.appendChild(restart);
    body.appendChild(actions);
    scrollBottom();
  }

  function sumRow(icon, label, val) {
    return '<div class="adw-sum-row">' +
      '<span class="adw-sum-icon">' + icon + '</span>' +
      '<span class="adw-sum-lbl">'  + esc(label) + '</span>' +
      '<span class="adw-sum-val">'  + esc(val)   + '</span>' +
    '</div>';
  }

  function ansRow(label, val) {
    return '<div class="adw-ans-row">' +
      '<span class="adw-ans-lbl">' + esc(label) + ':</span> ' +
      '<span>' + esc(val) + '</span>' +
    '</div>';
  }

  // ── OPEN / CLOSE / RESET ─────────────────────────────────────────────────────
  function openWidget() {
    if (state.open) return;
    state.open = true;
    var panel = $id('adw-panel');
    if (panel) panel.classList.add('adw-open');
    if (!state.started) {
      state.started = true;
      withTyping(function () { askStep(0); });
    }
  }

  function closeWidget() {
    state.open = false;
    var panel = $id('adw-panel');
    if (panel) panel.classList.remove('adw-open');
  }

  function resetWidget() {
    state.answers = {};
    state.busy    = false;
    state.started = false;
    var body = $id('adw-body');
    if (body) body.innerHTML = '';
    setStep(1);
    openWidget();
  }

  // ── INIT ──────────────────────────────────────────────────────────────────────
  function init() {
    // FAB
    var fab = mk('button', 'adw-fab', { 'aria-label': 'דבר עם סוכן AI' });
    fab.innerHTML =
      '<span class="adw-fab-icon" aria-hidden="true">✦</span>' +
      '<span class="adw-fab-label">דבר עם סוכן AI</span>';
    fab.addEventListener('click', function () {
      state.open ? closeWidget() : openWidget();
    });

    // Panel
    var panel = mk('div', 'adw-panel', { id: 'adw-panel', dir: 'rtl' });

    // Header
    var header    = mk('div', 'adw-header');
    var hLeft     = mk('div', 'adw-h-left');
    var avatar    = mk('div', 'adw-avatar', { html: '✦', 'aria-hidden': 'true' });
    var hInfo     = mk('div', 'adw-h-info');
    var hTitle    = mk('div', 'adw-h-title', { text: 'סוכן AI – lior-ai' });
    var hSub      = mk('div', 'adw-h-sub',   { text: 'מיידי · ממוקד · ישראלי' });
    hInfo.appendChild(hTitle);
    hInfo.appendChild(hSub);
    hLeft.appendChild(avatar);
    hLeft.appendChild(hInfo);

    var hRight    = mk('div', 'adw-h-right');
    var stepEl    = mk('span', 'adw-step', { id: 'adw-step', text: 'שלב 1/4' });
    var closeBtn  = mk('button', 'adw-close', { 'aria-label': 'סגור', html: '&times;' });
    closeBtn.addEventListener('click', closeWidget);
    hRight.appendChild(stepEl);
    hRight.appendChild(closeBtn);

    header.appendChild(hLeft);
    header.appendChild(hRight);

    // Body
    var body = mk('div', 'adw-body', { id: 'adw-body' });

    panel.appendChild(header);
    panel.appendChild(body);

    // Root
    var root = mk('div', 'adw-root');
    root.appendChild(panel);
    root.appendChild(fab);
    document.body.appendChild(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
