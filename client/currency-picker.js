/*!
 * Room to Read: currency picker ("step zero") for the Fundraise Up checkout.
 *
 * Shows a "Choose your currency to make a donation" window, styled like the Fundraise Up checkout,
 * whenever someone clicks a donate link or lands on a URL with ?form=donate. Choosing a currency
 * opens the Fundraise Up checkout for that currency's campaign.
 *
 * INSTALL: load this file in <head>, ABOVE the Fundraise Up snippet. See INSTALL.md.
 * Everything you are likely to change is in SETTINGS below.
 */
(function () {
  'use strict';

  // ───────────────────────────── SETTINGS ─────────────────────────────
  var SETTINGS = {
    // One button per currency, in this order. "campaign" is the Fundraise Up campaign ID (FUN…).
    currencies: [
      { code: 'AUD', name: 'Australian dollar', symbol: '$',   flag: '🇦🇺', campaign: 'FUNUBTYAUGE' },
      { code: 'CAD', name: 'Canadian dollar',   symbol: '$',   flag: '🇨🇦', campaign: 'FUNJSLTFLYN' },
      { code: 'CHF', name: 'Swiss franc',       symbol: '',    flag: '🇨🇭', campaign: 'FUNDUTKFQNZ' },
      { code: 'EUR', name: 'Euro',              symbol: '€',   flag: '🇪🇺', campaign: 'FUNENEAEUGW' },
      { code: 'GBP', name: 'British pound',     symbol: '£',   flag: '🇬🇧', campaign: 'FUNBNHJYBBJ' },
      { code: 'HKD', name: 'Hong Kong dollar',  symbol: '$',   flag: '🇭🇰', campaign: 'FUNACGEAZEY' },
      { code: 'SGD', name: 'Singapore dollar',  symbol: '$',   flag: '🇸🇬', campaign: 'FUNEDKNVFVB' },
      { code: 'USD', name: 'US dollar',         symbol: '$',   flag: '🇺🇸', campaign: 'FUNBKPYBFEE' }
    ],

    // Left-hand panel. Use full URLs to images in your media library.
    photoUrl: 'https://www.roomtoread.org/media/REPLACE-ME/picker-photo.jpg',
    photoAlt: 'Students in a Room to Read program',
    logoUrl:  'https://www.roomtoread.org/media/REPLACE-ME/logo-160.png',
    title:    "Invest in children's futures",
    message:  'Help children access the quality education they need to create a better tomorrow. Your gift supports life-changing literacy and gender equality programming in communities experiencing deep educational, gender and economic inequities.',
    footerLinks: [
      { text: 'Other ways to give', href: '/ways-to-give/' },
      { text: 'Privacy policy',     href: '/privacy-policy/' }
    ],
    note: 'Room to Read is a tax-exempt organization as described in Section 501(c)(3) of the United States Internal Revenue Code.',

    // Right-hand panel.
    heading:    'Choose your currency to make a donation',
    subheading: 'Your gift is processed in the currency you pick.',

    // Which links open the picker instead of going straight to a checkout:
    //  - any Fundraise Up Element link (https://roomtoread.donorsupport.co/-/X…), except the codes in skipElements
    //  - any link containing ?form=donate
    //  - any link to #choose-currency (use this for new buttons)
    interceptElementLinks: true,
    skipElements: [],            // e.g. ['XTWQFHMG'] to let "Give Monthly" open its own checkout directly
    openOnFormDonate: true       // a page opened with ?form=donate shows the picker
  };
  // ─────────────────────────── END SETTINGS ───────────────────────────

  var S = SETTINGS;

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isPickerLink(a) {
    var href = a.getAttribute('href') || '';
    if (href === '#choose-currency') return true;
    if (/[?&]form=donate(&|#|$)/i.test(href)) return true;
    if (S.interceptElementLinks) {
      var m = /donorsupport\.co\/-\/(X[A-Z0-9]+)/i.exec(href);
      if (m && S.skipElements.indexOf(m[1].toUpperCase()) === -1) return true;
    }
    return false;
  }

  // ?form=donate would make Fundraise Up open its own checkout on load. Remove it before the
  // Fundraise Up snippet reads the address (this is why the file must load above that snippet).
  var params = new URLSearchParams(location.search);
  var openOnLoad = S.openOnFormDonate && params.get('form') === 'donate';
  if (openOnLoad) {
    params.delete('form');
    var qs = params.toString();
    history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }

  // Capture phase on window: runs before Fundraise Up's own click handling.
  window.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !isPickerLink(a)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    open();
  }, true);

  var CSS = [
    "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');",
    ".rtr-cp{position:fixed;inset:0;z-index:2147483647;background:rgba(17,24,39,.62);display:none;flex-direction:column;align-items:center;justify-content:flex-start;padding:24px 16px;opacity:0;transition:opacity .25s ease;font-family:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;overflow-y:auto}",
    ".rtr-cp.rtr-in{opacity:1}",
    ".rtr-cp.rtr-handoff{transition:opacity .35s ease .15s}",
    ".rtr-cp *{box-sizing:border-box}",
    ".rtr-x{position:fixed;top:14px;right:14px;width:28px;height:28px;border-radius:50%;border:0;background:#fff;color:#1f2937;font-size:18px;line-height:28px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.25);padding:0}",
    ".rtr-modal{flex-shrink:0;margin-top:auto;display:flex;width:960px;max-width:100%;min-height:640px;background:#fff;border-radius:16px;padding:8px;gap:8px;box-shadow:0 20px 50px rgba(0,0,0,.35);transform:translateY(12px) scale(.98);opacity:0;transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .3s ease}",
    ".rtr-in .rtr-modal{transform:none;opacity:1}",
    ".rtr-modal.rtr-out{transform:scale(.96);opacity:0;transition:transform .32s cubic-bezier(.4,0,.2,1),opacity .28s ease}",
    ".rtr-left{flex:1 1 0;display:flex;flex-direction:column;min-width:0}",
    ".rtr-photo{width:100%;height:300px;object-fit:cover;border-radius:12px;display:block}",
    ".rtr-story{padding:22px 24px 16px;display:flex;flex-direction:column;flex:1;color:#1f2937}",
    ".rtr-logo{width:56px;height:auto;margin-bottom:18px}",
    ".rtr-story h2{font-family:inherit;font-size:22px;font-weight:600;margin:0 0 12px;letter-spacing:-.01em;color:#111827;line-height:1.25;text-transform:none}",
    ".rtr-story p{font-size:15px;line-height:1.5;margin:0;color:#1f2937}",
    ".rtr-links{margin-top:auto;padding-top:20px;font-size:12px;color:#4b5563}",
    ".rtr-links a{color:#4b5563;text-decoration:underline;text-underline-offset:2px}",
    ".rtr-right{flex:0 0 380px;border:1px solid #e5e7eb;border-radius:12px;padding:24px 24px 18px;display:flex;flex-direction:column}",
    ".rtr-secure{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:600;color:#111827;margin-bottom:20px}",
    ".rtr-secure svg{width:22px;height:22px;flex:none}",
    ".rtr-ask{font-size:15px;font-weight:500;color:#111827;margin:0 0 4px}",
    ".rtr-sub{font-size:13px;color:#6b7280;margin:0 0 16px}",
    ".rtr-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".rtr-cur{display:flex;align-items:center;gap:10px;text-align:left;border:1px solid #d1d5db;border-radius:8px;background:#fff;padding:10px 12px;cursor:pointer;font:inherit;color:#1f2937;transition:border-color .15s,background .15s;margin:0;min-height:0;text-transform:none;letter-spacing:normal}",
    ".rtr-cur:hover{border-color:#9ca3af}",
    ".rtr-cur:focus-visible{outline:2px solid #3370e3;outline-offset:2px}",
    ".rtr-cur.rtr-picked{border:2px solid #3370e3;background:#ebf2fe;padding:9px 11px}",
    ".rtr-flag{font-size:20px;line-height:1}",
    ".rtr-code{display:block;font-size:15px;font-weight:600}",
    ".rtr-name{display:block;font-size:12px;color:#6b7280;margin-top:1px}",
    ".rtr-foot{margin-top:auto;padding-top:18px;text-align:center;font-size:12px;color:#6b7280;display:flex;align-items:center;justify-content:center;gap:6px}",
    ".rtr-note{width:960px;max-width:100%;text-align:center;color:rgba(255,255,255,.85);font-size:11px;margin-top:10px;margin-bottom:auto}",
    ".rtr-spin{display:inline-block;width:14px;height:14px;border:2px solid #3370e3;border-right-color:transparent;border-radius:50%;animation:rtr-r .7s linear infinite;margin-left:auto}",
    "@keyframes rtr-r{to{transform:rotate(360deg)}}",
    "@media (max-width:820px){.rtr-cp{padding:16px 8px 24px}.rtr-modal{flex-direction:column;min-height:0;gap:0;border-radius:16px}.rtr-photo{height:auto;aspect-ratio:1.72;border-radius:12px}.rtr-story{padding:28px 12px 20px}.rtr-logo{width:34px;margin-bottom:22px}.rtr-story h2{font-size:20px;margin-bottom:10px}.rtr-story p{font-size:16px;line-height:1.4}.rtr-links{display:block;padding-top:16px}.rtr-right{flex:none;border:0;border-top:1px solid #e5e7eb;border-radius:0;box-shadow:none;padding:24px 12px 12px}.rtr-secure{font-size:20px;margin-bottom:18px}.rtr-secure svg{width:28px;height:28px}.rtr-ask{font-size:16px}.rtr-cur{padding:10px}.rtr-cur.rtr-picked{padding:9px}.rtr-flag{font-size:18px}.rtr-x{top:12px;right:12px;width:32px;height:32px;line-height:32px;font-size:22px;background:#f3f4f6;color:#4b5563;box-shadow:none}.rtr-note{margin-top:16px;font-size:12px}}",
    "@media (prefers-reduced-motion:reduce){.rtr-cp,.rtr-modal,.rtr-modal.rtr-out{transition:none}}"
  ].join('\n');

  var SHIELD = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.5 4 5.5v6c0 4.7 3.3 8.9 8 10 4.7-1.1 8-5.3 8-10v-6l-8-3Z" stroke="#12b886" stroke-width="2" stroke-linejoin="round"/><rect x="9" y="10.5" width="6" height="5" rx="1" fill="#12b886"/><path d="M10.2 10.5V9.2a1.8 1.8 0 0 1 3.6 0v1.3" stroke="#12b886" stroke-width="1.6"/></svg>';

  var root = null, lastFocus = null, busy = false;

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var links = S.footerLinks.map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.text) + '</a>';
    }).join(' &middot; ');
    var buttons = S.currencies.map(function (c, i) {
      return '<button type="button" class="rtr-cur" data-i="' + i + '">' +
        '<span class="rtr-flag" aria-hidden="true">' + esc(c.flag) + '</span>' +
        '<span><span class="rtr-code">' + esc(c.code + (c.symbol ? ' ' + c.symbol : '')) + '</span>' +
        '<span class="rtr-name">' + esc(c.name) + '</span></span></button>';
    }).join('');

    root = document.createElement('div');
    root.className = 'rtr-cp';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'rtr-ask');
    root.innerHTML =
      '<button class="rtr-x" type="button" aria-label="Close">&times;</button>' +
      '<div class="rtr-modal">' +
        '<div class="rtr-left">' +
          '<img class="rtr-photo" src="' + esc(S.photoUrl) + '" alt="' + esc(S.photoAlt) + '">' +
          '<div class="rtr-story">' +
            '<img class="rtr-logo" src="' + esc(S.logoUrl) + '" alt="Room to Read">' +
            '<h2>' + esc(S.title) + '</h2>' +
            '<p>' + esc(S.message) + '</p>' +
            '<div class="rtr-links">' + links + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="rtr-right">' +
          '<div class="rtr-secure">' + SHIELD + 'Secure donation</div>' +
          '<p class="rtr-ask" id="rtr-ask">' + esc(S.heading) + '</p>' +
          '<p class="rtr-sub">' + esc(S.subheading) + '</p>' +
          '<div class="rtr-grid">' + buttons + '</div>' +
          '<div class="rtr-foot">' + SHIELD.replace('<svg', '<svg width="14" height="14"') + 'Secure checkout by Fundraise Up</div>' +
        '</div>' +
      '</div>' +
      '<div class="rtr-note">' + esc(S.note) + '</div>';
    document.body.appendChild(root);

    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.closest('.rtr-x')) { close(); return; }
      var btn = e.target.closest('.rtr-cur');
      if (btn) choose(btn);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root && root.style.display === 'flex' && !busy) close();
    });
  }

  function open() {
    if (!document.body) return;
    if (!root) build();
    busy = false;
    lastFocus = document.activeElement;
    root.querySelector('.rtr-modal').classList.remove('rtr-out');
    root.classList.remove('rtr-handoff');
    [].forEach.call(root.querySelectorAll('.rtr-cur'), function (b) {
      b.classList.remove('rtr-picked');
      var s = b.querySelector('.rtr-spin'); if (s) s.remove();
    });
    root.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('rtr-in'); }); });
    setTimeout(function () { var f = root.querySelector('.rtr-cur'); if (f) f.focus({ preventScroll: true }); }, 50);
  }

  function hide() {
    root.style.display = 'none';
    document.documentElement.style.overflow = '';
    busy = false;
  }

  function close() {
    if (!root) return;
    root.classList.remove('rtr-in');
    setTimeout(function () {
      hide();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }, 250);
  }

  function choose(btn) {
    if (busy) return;
    busy = true;
    var cur = S.currencies[+btn.getAttribute('data-i')];
    btn.classList.add('rtr-picked');
    var spin = document.createElement('span');
    spin.className = 'rtr-spin';
    btn.appendChild(spin);

    // Brief pause on the picked button, then the window shrinks away and the checkout opens in its place.
    setTimeout(function () {
      root.querySelector('.rtr-modal').classList.add('rtr-out');
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        root.classList.add('rtr-handoff');
        root.classList.remove('rtr-in');
        setTimeout(hide, 500);
      }
      var FU = window.FundraiseUp;
      if (FU && typeof FU.openCheckout === 'function') {
        if (typeof FU.on === 'function') FU.on('checkoutOpen', finish);
        FU.openCheckout(cur.campaign);
        setTimeout(finish, 1800);
      } else {
        // Fundraise Up isn't on this page; fall back to the URL method.
        location.search = '?form=' + encodeURIComponent(cur.campaign);
      }
    }, 280);
  }

  // Lets your own code open the picker: window.RoomToReadCurrencyPicker.open()
  window.RoomToReadCurrencyPicker = { open: open, close: close, settings: S };

  if (openOnLoad) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open);
    else open();
  }
})();
