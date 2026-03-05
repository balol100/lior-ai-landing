(function () {
  'use strict';

  var CONSENT_KEY = 'lior_cookie_consent_v1';
  var defaults = { essential: true, analytics: false, marketing: false, updatedAt: null };

  function safeParse(value) {
    try { return JSON.parse(value); } catch (e) { return null; }
  }

  function getConsent() {
    var stored = safeParse(localStorage.getItem(CONSENT_KEY));
    return stored ? Object.assign({}, defaults, stored) : null;
  }

  function setConsent(consent) {
    var payload = Object.assign({}, defaults, consent, { essential: true, updatedAt: new Date().toISOString() });
    localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('lior:consent-updated', { detail: payload }));
  }

  function createBanner() {
    if (document.getElementById('cookie-consent-banner')) return;

    var style = document.createElement('style');
    style.textContent = '' +
      '#cookie-consent-banner{position:fixed;right:16px;left:16px;bottom:16px;z-index:100001;max-width:880px;margin:auto;background:#0f172a;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:16px;box-shadow:0 12px 50px rgba(0,0,0,.55);padding:16px}' +
      '#cookie-consent-banner p{margin:0 0 10px;line-height:1.6;font-size:.95rem;color:rgba(255,255,255,.9)}' +
      '#cookie-consent-banner .cc-actions{display:flex;flex-wrap:wrap;gap:8px}' +
      '#cookie-consent-banner button{border:0;border-radius:10px;padding:10px 14px;font:inherit;font-weight:700;cursor:pointer}' +
      '#cc-accept{background:linear-gradient(135deg,#00e5a0,#00b8d4);color:#00120d}' +
      '#cc-essential{background:rgba(255,255,255,.12);color:#fff}' +
      '#cc-manage{background:transparent;color:#9ae6b4;border:1px solid rgba(154,230,180,.5)}' +
      '#cookie-settings{display:none;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.12)}' +
      '#cookie-settings.show{display:block}' +
      '#cookie-settings label{display:flex;gap:8px;align-items:center;margin:6px 0;font-size:.93rem}' +
      '#cookie-consent-banner a{color:#7dd3fc;text-decoration:underline}' +
      '@media (max-width:640px){#cookie-consent-banner{left:10px;right:10px;bottom:10px;padding:14px}}';
    document.head.appendChild(style);

    var banner = document.createElement('section');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'ניהול הסכמה לעוגיות ואיסוף מידע');
    banner.innerHTML =
      '<p><strong>פרטיות והסכמה:</strong> אנחנו משתמשים בעוגיות הכרחיות להפעלת האתר, ואפשר לבחור אם לאפשר מדידה ושיווק. המשך שימוש באתר כפוף ל<a href="/privacy-policy.html">מדיניות הפרטיות</a>.</p>' +
      '<div class="cc-actions">' +
      '<button id="cc-accept" type="button">אשר הכל</button>' +
      '<button id="cc-essential" type="button">רק הכרחי</button>' +
      '<button id="cc-manage" type="button" aria-expanded="false" aria-controls="cookie-settings">התאמה אישית</button>' +
      '</div>' +
      '<div id="cookie-settings">' +
      '<label><input id="cc-analytics" type="checkbox"> מדידה וניתוח ביצועים (Analytics)</label>' +
      '<label><input id="cc-marketing" type="checkbox"> פרסום ושיווק (Marketing)</label>' +
      '<button id="cc-save" type="button" style="margin-top:8px;background:#22c55e;color:#052e16">שמור בחירה</button>' +
      '</div>';

    document.body.appendChild(banner);

    var manage = document.getElementById('cc-manage');
    var settings = document.getElementById('cookie-settings');
    manage.addEventListener('click', function () {
      var open = settings.classList.toggle('show');
      manage.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.getElementById('cc-accept').addEventListener('click', function () {
      setConsent({ analytics: true, marketing: true });
      banner.remove();
    });

    document.getElementById('cc-essential').addEventListener('click', function () {
      setConsent({ analytics: false, marketing: false });
      banner.remove();
    });

    document.getElementById('cc-save').addEventListener('click', function () {
      setConsent({
        analytics: document.getElementById('cc-analytics').checked,
        marketing: document.getElementById('cc-marketing').checked
      });
      banner.remove();
    });
  }

  function wireContactConsent() {
    var form = document.getElementById('contactForm');
    if (!form || document.getElementById('privacyConsent')) return;

    var wrap = document.createElement('div');
    wrap.className = 'form-group';
    wrap.innerHTML = '<label style="display:flex;gap:8px;align-items:flex-start;font-size:.9rem;line-height:1.5">' +
      '<input id="privacyConsent" name="privacyConsent" type="checkbox" required aria-required="true" style="margin-top:6px">' +
      '<span>אני מאשר/ת יצירת קשר ושמירת פרטי הפנייה בהתאם ל<a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">מדיניות הפרטיות</a>.</span>' +
      '</label>' +
      '<input type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-10000px;opacity:0">';

    var submitRow = form.querySelector('.submit-row');
    if (submitRow) form.insertBefore(wrap, submitRow);

    form.addEventListener('submit', function (event) {
      var honeypot = form.querySelector('input[name="company_website"]');
      var consent = form.querySelector('#privacyConsent');
      if (honeypot && honeypot.value) {
        event.preventDefault();
        return false;
      }
      if (consent && !consent.checked) {
        event.preventDefault();
        consent.focus();
        return false;
      }
    }, true);
  }

  function init() {
    if (!getConsent()) createBanner();
    wireContactConsent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
