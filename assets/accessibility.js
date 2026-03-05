/**
 * Widget נגישות – lior-ai.com
 * תואם תקן IS 5568 (WCAG 2.1 AA) וחוק שוויון זכויות לאנשים עם מוגבלות, תשנ"ח-1998
 */
(function () {
  'use strict';

  var KEY = 'lior_a11y_v2';
  var FONT_STEPS = [80, 90, 100, 110, 120, 135, 150, 175, 200];
  var FONT_LABELS = ['80%', '90%', 'רגיל', '110%', '120%', '135%', '150%', '175%', '200%'];
  var DEFAULT = {
    fontSize: 2,
    contrast: '',
    grayscale: false,
    highlightLinks: false,
    bigCursor: false,
    stopAnimations: false,
    dyslexicFont: false,
    readingGuide: false
  };

  var cfg = Object.assign({}, DEFAULT);
  try {
    var saved = localStorage.getItem(KEY);
    if (saved) cfg = Object.assign({}, DEFAULT, JSON.parse(saved));
  } catch (e) {}

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  function applyAll() {
    var html = document.documentElement;
    var body = document.body;

    html.style.setProperty('font-size', FONT_STEPS[cfg.fontSize] + '%', 'important');

    ['a11y-hc', 'a11y-inv', 'a11y-yw'].forEach(function(c){ body.classList.remove(c); });
    if (cfg.contrast === 'high')     body.classList.add('a11y-hc');
    if (cfg.contrast === 'inverted') body.classList.add('a11y-inv');
    if (cfg.contrast === 'yellow')   body.classList.add('a11y-yw');

    body.classList.toggle('a11y-gray',    cfg.grayscale);
    body.classList.toggle('a11y-links',   cfg.highlightLinks);
    body.classList.toggle('a11y-cursor',  cfg.bigCursor);
    body.classList.toggle('a11y-noani',   cfg.stopAnimations);
    body.classList.toggle('a11y-dyslexic',cfg.dyslexicFont);

    var rg = document.getElementById('__a11y_rg');
    if (rg) rg.style.display = cfg.readingGuide ? 'block' : 'none';

    updateUI();
    save();
  }

  function updateUI() {
    var boolMap = {
      '__a11y_hc':      cfg.contrast === 'high',
      '__a11y_inv':     cfg.contrast === 'inverted',
      '__a11y_yw':      cfg.contrast === 'yellow',
      '__a11y_gray':    cfg.grayscale,
      '__a11y_links':   cfg.highlightLinks,
      '__a11y_cursor':  cfg.bigCursor,
      '__a11y_noani':   cfg.stopAnimations,
      '__a11y_dyslexic':cfg.dyslexicFont,
      '__a11y_guide':   cfg.readingGuide
    };
    for (var id in boolMap) {
      var el = document.getElementById(id);
      if (el) {
        el.setAttribute('aria-pressed', boolMap[id] ? 'true' : 'false');
        el.classList.toggle('__on', boolMap[id]);
      }
    }
    var sz = document.getElementById('__a11y_fzsz');
    if (sz) sz.textContent = FONT_LABELS[cfg.fontSize];
    var fd = document.getElementById('__a11y_fd');
    if (fd) fd.disabled = cfg.fontSize <= 0;
    var fi = document.getElementById('__a11y_fi');
    if (fi) fi.disabled = cfg.fontSize >= FONT_STEPS.length - 1;
  }

  var CSS = '\n' +
    '#__a11y{position:fixed;bottom:24px;right:24px;z-index:100000;direction:rtl;font-family:\'Heebo\',Arial,sans-serif}\n' +
    '#__a11y_fab{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#00e5a0,#00b8d4);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,229,160,.5);transition:transform .25s,box-shadow .25s;padding:0}\n' +
    '#__a11y_fab:hover{transform:scale(1.1);box-shadow:0 6px 32px rgba(0,229,160,.7)}\n' +
    '#__a11y_fab:focus-visible{outline:3px solid #fff;outline-offset:3px}\n' +
    '#__a11y_fab svg{width:27px;height:27px;fill:#000;pointer-events:none}\n' +
    '#__a11y_panel{display:none;position:absolute;bottom:70px;right:0;width:310px;background:#0d0d15;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:20px 16px;box-shadow:0 24px 80px rgba(0,0,0,.8)}\n' +
    '#__a11y_panel.show{display:block}\n' +
    '.__a11y_h{font-size:15px;font-weight:700;color:#fff;margin:0 0 3px;text-align:right}\n' +
    '.__a11y_sub{font-size:11px;color:rgba(255,255,255,.38);text-align:right;margin:0 0 14px;line-height:1.5}\n' +
    '.__a11y_sec{font-size:10.5px;color:rgba(255,255,255,.45);text-align:right;margin:12px 0 5px;text-transform:uppercase;letter-spacing:.05em}\n' +
    '.__a11y_row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px}\n' +
    '.__a11y_btn{flex:1;min-width:82px;padding:9px 5px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:10px;color:rgba(255,255,255,.8);font-size:11.5px;cursor:pointer;text-align:center;transition:all .18s;line-height:1.3;font-family:inherit}\n' +
    '.__a11y_btn:hover{background:rgba(255,255,255,.1)}\n' +
    '.__a11y_btn.__on{background:rgba(0,229,160,.18);border-color:#00e5a0;color:#00e5a0}\n' +
    '.__a11y_btn:focus-visible{outline:2px solid #00e5a0;outline-offset:2px}\n' +
    '.__a11y_fzrow{display:flex;align-items:center;gap:8px;margin-bottom:4px}\n' +
    '.__a11y_fzbtn{width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s;line-height:1}\n' +
    '.__a11y_fzbtn:hover{background:rgba(255,255,255,.15)}\n' +
    '.__a11y_fzbtn:disabled{opacity:.3;cursor:default}\n' +
    '.__a11y_fzsz{flex:1;text-align:center;color:#fff;font-size:13px;background:rgba(255,255,255,.06);padding:8px 4px;border-radius:9px;border:1px solid rgba(255,255,255,.1)}\n' +
    '.__a11y_hr{border:none;border-top:1px solid rgba(255,255,255,.07);margin:12px 0}\n' +
    '.__a11y_reset{width:100%;padding:9px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;color:rgba(255,255,255,.55);font-size:12px;cursor:pointer;margin-top:4px;transition:background .2s;font-family:inherit}\n' +
    '.__a11y_reset:hover{background:rgba(255,255,255,.1);color:#fff}\n' +
    '.__a11y_stmt{display:block;text-align:center;color:rgba(255,255,255,.3);font-size:11px;margin-top:10px;text-decoration:none;transition:color .2s}\n' +
    '.__a11y_stmt:hover{color:rgba(255,255,255,.7)}\n' +
    '#__a11y_rg{display:none;position:fixed;top:0;left:0;right:0;height:38px;background:rgba(255,255,200,.12);border-top:2px solid rgba(255,255,100,.55);border-bottom:2px solid rgba(255,255,100,.55);pointer-events:none;z-index:99998}\n' +
    'body.a11y-hc{filter:contrast(165%) !important}\n' +
    'body.a11y-inv{filter:invert(1) hue-rotate(180deg) !important}\n' +
    'body.a11y-yw *{background:#000 !important;color:#ff0 !important;border-color:#ff0 !important}\n' +
    'body.a11y-gray{filter:grayscale(100%) !important}\n' +
    'body.a11y-links a{outline:2px solid #ff0 !important;background:rgba(255,255,0,.12) !important;padding:0 3px !important;border-radius:2px !important}\n' +
    'body.a11y-cursor,body.a11y-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'44\' height=\'44\'%3E%3Cpath d=\'M6 6l14 34 4-14 14-4z\' fill=\'%23fff\' stroke=\'%23000\' stroke-width=\'2.5\'/%3E%3C/svg%3E") 6 6,auto !important}\n' +
    'body.a11y-noani *,body.a11y-noani *::before,body.a11y-noani *::after{animation-duration:.001s !important;animation-iteration-count:1 !important;transition-duration:.001s !important}\n' +
    'body.a11y-dyslexic,body.a11y-dyslexic *{font-family:Arial,Helvetica,sans-serif !important;letter-spacing:.065em !important;word-spacing:.2em !important;line-height:1.85 !important}\n';

  var ICON_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><circle cx="12" cy="4" r="2"/><path d="M19 8.5H5a1 1 0 0 0 0 2h3.5L6 18.5h2.5l1.5-5h4l1.5 5H18l-2.5-8H19a1 1 0 0 0 0-2z"/></svg>';

  function buildWidget() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var rg = document.createElement('div');
    rg.id = '__a11y_rg';
    rg.setAttribute('aria-hidden', 'true');
    document.body.appendChild(rg);

    document.addEventListener('mousemove', function(e) {
      if (cfg.readingGuide) rg.style.top = (e.clientY - 19) + 'px';
    });

    var wrap = document.createElement('div');
    wrap.id = '__a11y';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', 'תפריט נגישות');

    wrap.innerHTML =
      '<div id="__a11y_panel" role="dialog" aria-label="אפשרויות נגישות" aria-modal="false">' +
        '<p class="__a11y_h">♿ נגישות</p>' +
        '<p class="__a11y_sub">הגדרות נשמרות אוטומטית<br>תקן IS 5568 · WCAG 2.1 AA</p>' +
        '<p class="__a11y_sec">גודל טקסט</p>' +
        '<div class="__a11y_fzrow">' +
          '<button class="__a11y_fzbtn" id="__a11y_fd" aria-label="הקטן גודל טקסט">−</button>' +
          '<div class="__a11y_fzsz" id="__a11y_fzsz" role="status" aria-live="polite">רגיל</div>' +
          '<button class="__a11y_fzbtn" id="__a11y_fi" aria-label="הגדל גודל טקסט">+</button>' +
        '</div>' +
        '<p class="__a11y_sec">ניגודיות</p>' +
        '<div class="__a11y_row">' +
          '<button class="__a11y_btn" id="__a11y_hc" aria-pressed="false">ניגודיות גבוהה</button>' +
          '<button class="__a11y_btn" id="__a11y_inv" aria-pressed="false">צבעים הפוכים</button>' +
        '</div>' +
        '<div class="__a11y_row">' +
          '<button class="__a11y_btn" id="__a11y_yw" aria-pressed="false">צהוב על שחור</button>' +
          '<button class="__a11y_btn" id="__a11y_gray" aria-pressed="false">גווני אפור</button>' +
        '</div>' +
        '<p class="__a11y_sec">תצוגה ונוחות</p>' +
        '<div class="__a11y_row">' +
          '<button class="__a11y_btn" id="__a11y_links" aria-pressed="false">הדגש קישורים</button>' +
          '<button class="__a11y_btn" id="__a11y_cursor" aria-pressed="false">סמן מוגדל</button>' +
        '</div>' +
        '<div class="__a11y_row">' +
          '<button class="__a11y_btn" id="__a11y_noani" aria-pressed="false">עצור אנימציות</button>' +
          '<button class="__a11y_btn" id="__a11y_dyslexic" aria-pressed="false">גופן דיסלקציה</button>' +
        '</div>' +
        '<div class="__a11y_row">' +
          '<button class="__a11y_btn" id="__a11y_guide" aria-pressed="false">מדריך קריאה</button>' +
        '</div>' +
        '<hr class="__a11y_hr">' +
        '<button class="__a11y_reset" id="__a11y_reset">↺ אפס את כל הגדרות הנגישות</button>' +
        '<a href="/accessibility-statement.html" class="__a11y_stmt">הצהרת נגישות מלאה ←</a>' +
      '</div>' +
      '<button id="__a11y_fab" aria-label="פתח תפריט נגישות" aria-expanded="false" aria-controls="__a11y_panel" title="נגישות">' +
        ICON_SVG +
      '</button>';

    document.body.appendChild(wrap);

    var fab   = document.getElementById('__a11y_fab');
    var panel = document.getElementById('__a11y_panel');

    fab.addEventListener('click', function() {
      var open = panel.classList.toggle('show');
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        setTimeout(function() {
          var first = panel.querySelector('button,a');
          if (first) first.focus();
        }, 50);
      }
    });

    document.addEventListener('click', function(e) {
      if (!wrap.contains(e.target)) {
        panel.classList.remove('show');
        fab.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && panel.classList.contains('show')) {
        panel.classList.remove('show');
        fab.setAttribute('aria-expanded', 'false');
        fab.focus();
      }
    });

    document.getElementById('__a11y_fd').addEventListener('click', function() {
      if (cfg.fontSize > 0) { cfg.fontSize--; applyAll(); }
    });
    document.getElementById('__a11y_fi').addEventListener('click', function() {
      if (cfg.fontSize < FONT_STEPS.length - 1) { cfg.fontSize++; applyAll(); }
    });

    var contrastMap = { hc: 'high', inv: 'inverted', yw: 'yellow' };
    ['hc','inv','yw'].forEach(function(k) {
      document.getElementById('__a11y_' + k).addEventListener('click', function() {
        cfg.contrast = cfg.contrast === contrastMap[k] ? '' : contrastMap[k];
        applyAll();
      });
    });

    var boolKeys = [
      ['gray',    'grayscale'],
      ['links',   'highlightLinks'],
      ['cursor',  'bigCursor'],
      ['noani',   'stopAnimations'],
      ['dyslexic','dyslexicFont'],
      ['guide',   'readingGuide']
    ];
    boolKeys.forEach(function(pair) {
      document.getElementById('__a11y_' + pair[0]).addEventListener('click', function() {
        cfg[pair[1]] = !cfg[pair[1]];
        applyAll();
      });
    });

    document.getElementById('__a11y_reset').addEventListener('click', function() {
      cfg = Object.assign({}, DEFAULT);
      document.documentElement.style.removeProperty('font-size');
      applyAll();
    });

    applyAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
