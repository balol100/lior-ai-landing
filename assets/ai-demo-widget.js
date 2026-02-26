(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────────────────────────
  var WHATSAPP_NUMBER = '972508668022';
  var CONTACT_ANCHOR  = '#contact';

  // ── QUESTIONS ────────────────────────────────────────────────────────────────
  var QUESTIONS = [
    {
      id: 'service',
      text: 'מה אתה מחפש?',
      options: [
        { label: '🌐 דף נחיתה',  value: 'landing',       score: 3 },
        { label: '🏢 אתר תדמית', value: 'website',       score: 3 },
        { label: '🤖 סוכן AI',   value: 'ai_agent',      score: 4 },
        { label: '💡 ייעוץ AI',  value: 'ai_consulting', score: 2 }
      ]
    },
    {
      id: 'urgency',
      text: 'מתי אתה צריך את זה?',
      options: [
        { label: '🔥 דחוף – 1–2 שבועות', value: 'urgent',   score: 4 },
        { label: '📅 בקרוב – חודש',       value: 'soon',     score: 2 },
        { label: '👀 רק בודק',            value: 'browsing', score: 0 }
      ]
    },
    {
      id: 'contact',
      text: 'איך הכי נוח לך לדבר?',
      options: [
        { label: '💬 וואטסאפ',     value: 'whatsapp', score: 2 },
        { label: '📞 שיחת טלפון', value: 'phone',     score: 2 },
        { label: '📝 טופס',        value: 'form',      score: 1 }
      ]
    }
  ];

  // ── LABELS (for display) ──────────────────────────────────────────────────────
  var SERVICE_LABELS  = { landing: 'דף נחיתה', website: 'אתר תדמית', ai_agent: 'סוכן AI', ai_consulting: 'ייעוץ AI' };
  var URGENCY_LABELS  = { urgent: 'דחוף (1–2 שבועות)', soon: 'בקרוב (חודש)', browsing: 'רק בודק' };
  var CONTACT_LABELS  = { whatsapp: 'וואטסאפ', phone: 'שיחת טלפון', form: 'טופס' };

  // ── STATE ────────────────────────────────────────────────────────────────────
  var state = { open: false, step: 0, answers: {}, score: 0, done: false };

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  function getRecommendation(score) {
    if (score >= 8) return 'מועמד מצוין! נשמח לדבר מיד ולבנות את הפתרון המדויק לך.';
    if (score >= 5) return 'נשמח ליצור קשר ולהציע פתרון שמתאים לצרכים שלך.';
    return 'בשמחה נשלח מידע ונסביר מה מתאים לעסק שלך.';
  }

  function getScoreLabel(score) {
    if (score >= 8) return 'גבוה';
    if (score >= 5) return 'בינוני';
    return 'נמוך';
  }

  function getScoreColor(score) {
    if (score >= 8) return '#00e5a0';
    if (score >= 5) return '#f0c040';
    return '#ff6b6b';
  }

  function buildSummaryText(answers, score) {
    return [
      'היי ליאור! הגעתי מהדמו באתר שלך.',
      '',
      '📋 מה אני מחפש: ' + (SERVICE_LABELS[answers.service]  || answers.service  || ''),
      '⏰ מתי: '          + (URGENCY_LABELS[answers.urgency]  || answers.urgency  || ''),
      '📞 יצירת קשר: '   + (CONTACT_LABELS[answers.contact]  || answers.contact  || ''),
      '⭐ ניקוד: '        + score + '/10',
      '💡 '              + getRecommendation(score)
    ].join('\n');
  }

  // ── DOM HELPERS ───────────────────────────────────────────────────────────────
  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'innerHTML') { node.innerHTML = attrs[k]; }
        else { node.setAttribute(k, attrs[k]); }
      });
    }
    return node;
  }

  function bubble(type, text) {
    var d = el('div', 'adw-bubble adw-bubble-' + type);
    d.textContent = text;
    return d;
  }

  // ── RENDER ────────────────────────────────────────────────────────────────────
  function render() {
    var body = document.getElementById('adw-body');
    if (!body) return;
    body.innerHTML = '';
    if (state.done) { renderSummary(body); }
    else            { renderQuestion(body, state.step); }
    setTimeout(function () { body.scrollTop = body.scrollHeight; }, 50);
  }

  function renderQuestion(container, stepIndex) {
    // Replay previous Q&A as chat bubbles
    for (var i = 0; i < stepIndex; i++) {
      var prevQ   = QUESTIONS[i];
      var prevAns = state.answers[prevQ.id];
      var prevOpt = prevQ.options.filter(function (o) { return o.value === prevAns; })[0];
      container.appendChild(bubble('bot',  prevQ.text));
      container.appendChild(bubble('user', prevOpt ? prevOpt.label : prevAns));
    }

    // Current question
    container.appendChild(bubble('bot', QUESTIONS[stepIndex].text));

    // Option buttons
    var opts = el('div', 'adw-options');
    QUESTIONS[stepIndex].options.forEach(function (opt) {
      var btn = el('button', 'adw-option-btn');
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        state.answers[QUESTIONS[stepIndex].id] = opt.value;
        state.score += opt.score;
        if (stepIndex + 1 < QUESTIONS.length) {
          state.step = stepIndex + 1;
        } else {
          state.done = true;
        }
        render();
      });
      opts.appendChild(btn);
    });
    container.appendChild(opts);
  }

  function renderSummary(container) {
    var score       = state.score;
    var answers     = state.answers;
    var summaryText = buildSummaryText(answers, score);
    var scoreColor  = getScoreColor(score);
    var scoreLabel  = getScoreLabel(score);

    // Summary bubble
    var sb = el('div', 'adw-bubble adw-bubble-bot adw-summary-bubble');
    sb.innerHTML =
      '<div class="adw-score-header">' +
        '<span>סיכום הדמו שלך</span>' +
        '<span class="adw-score-badge" style="background:' + scoreColor + ';color:#000">' +
          'ניקוד ' + score + '/10 · ' + scoreLabel +
        '</span>' +
      '</div>' +
      '<div class="adw-summary-lines">' +
        '<div>📋 <strong>שירות:</strong> '    + (SERVICE_LABELS[answers.service]  || '') + '</div>' +
        '<div>⏰ <strong>מועד:</strong> '     + (URGENCY_LABELS[answers.urgency]  || '') + '</div>' +
        '<div>📞 <strong>קשר:</strong> '     + (CONTACT_LABELS[answers.contact]  || '') + '</div>' +
      '</div>' +
      '<div class="adw-recommendation">💡 ' + getRecommendation(score) + '</div>';
    container.appendChild(sb);

    // ── Action: WhatsApp ──
    var waBtn = el('a', 'adw-btn adw-btn-primary', {
      href:   'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(summaryText),
      target: '_blank',
      rel:    'noopener noreferrer'
    });
    waBtn.innerHTML = '💬 שלח בוואטסאפ';

    // ── Action: Contact form ──
    var formBtn = el('a', 'adw-btn adw-btn-secondary', { href: CONTACT_ANCHOR });
    formBtn.innerHTML = '📝 מעבר לטופס יצירת קשר';
    formBtn.addEventListener('click', function () { closeWidget(); });

    // ── Action: Copy summary ──
    var copyBtn = el('button', 'adw-btn adw-btn-ghost');
    copyBtn.innerHTML = '📋 העתק סיכום';
    copyBtn.addEventListener('click', function () {
      function markCopied() {
        copyBtn.innerHTML = '✅ הועתק!';
        setTimeout(function () { copyBtn.innerHTML = '📋 העתק סיכום'; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summaryText).then(markCopied);
      } else {
        var ta = document.createElement('textarea');
        ta.value = summaryText;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* silent */ }
        document.body.removeChild(ta);
        markCopied();
      }
    });

    // ── Actions wrapper ──
    var actions = el('div', 'adw-actions');
    actions.appendChild(waBtn);
    actions.appendChild(formBtn);
    actions.appendChild(copyBtn);

    // ── Restart ──
    var restart = el('button', 'adw-restart');
    restart.textContent = 'התחל מחדש';
    restart.addEventListener('click', function () {
      state.step = 0; state.answers = {}; state.score = 0; state.done = false;
      render();
    });
    actions.appendChild(restart);

    container.appendChild(actions);
  }

  // ── OPEN / CLOSE ──────────────────────────────────────────────────────────────
  function openWidget() {
    state.open = true;
    var panel = document.getElementById('adw-panel');
    if (panel) panel.classList.add('adw-open');
    render();
  }

  function closeWidget() {
    state.open = false;
    var panel = document.getElementById('adw-panel');
    if (panel) panel.classList.remove('adw-open');
  }

  // ── INIT ──────────────────────────────────────────────────────────────────────
  function init() {
    // ── FAB ──
    var fab = el('button', 'adw-fab', { 'aria-label': 'פתח דמו אינטראקטיבי' });
    fab.innerHTML = '🤖';
    fab.addEventListener('click', function () {
      state.open ? closeWidget() : openWidget();
    });

    // ── Panel ──
    var panel = el('div', 'adw-panel', { id: 'adw-panel', dir: 'rtl' });

    // Header
    var header = el('div', 'adw-header');
    var title  = el('span', 'adw-header-title');
    title.innerHTML = '🤖 דמו AI – מה מתאים לך?';
    var closeBtn = el('button', 'adw-close', { 'aria-label': 'סגור' });
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeWidget);
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Greeting
    var greet = el('div', 'adw-greet');
    greet.textContent = 'שלום! 3 שאלות קצרות ואגיד לך בדיוק מה מתאים לעסק שלך 👋';

    // Body
    var body = el('div', '', { id: 'adw-body' });
    body.className = 'adw-body';

    panel.appendChild(header);
    panel.appendChild(greet);
    panel.appendChild(body);

    // ── Root wrapper ──
    var root = el('div', 'adw-root');
    root.appendChild(fab);
    root.appendChild(panel);
    document.body.appendChild(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
