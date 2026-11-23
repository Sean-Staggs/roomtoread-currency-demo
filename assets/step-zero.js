/* Room to Read demo: "step zero" currency picker.
 * Every donate link on the page (and ?form=donate in the URL) opens this picker, styled like the
 * Fundraise Up checkout modal. Choosing a currency animates the picker away and opens the real
 * Fundraise Up checkout for that currency's campaign. Test mode stays on (window.fundraiseup_livemode = false).
 * Loaded in <head> before the Fundraise Up loader, so its click listener runs first. */
(function () {
  'use strict';

  var CURRENCIES = [
    { code: 'AUD', name: 'Australian dollar', symbol: '$',   flag: '🇦🇺', campaign: 'FUNUBTYAUGE' },
    { code: 'CAD', name: 'Canadian dollar',   symbol: '$',   flag: '🇨🇦', campaign: 'FUNJSLTFLYN' },
    { code: 'CHF', name: 'Swiss franc',       symbol: 'CHF', flag: '🇨🇭', campaign: 'FUNDUTKFQNZ' },
    { code: 'EUR', name: 'Euro',              symbol: '€',   flag: '🇪🇺', campaign: 'FUNENEAEUGW' },
    { code: 'GBP', name: 'British pound',     symbol: '£',   flag: '🇬🇧', campaign: 'FUNBNHJYBBJ' },
    { code: 'HKD', name: 'Hong Kong dollar',  symbol: '$',   flag: '🇭🇰', campaign: 'FUNACGEAZEY' },
    { code: 'SGD', name: 'Singapore dollar',  symbol: '$',   flag: '🇸🇬', campaign: 'FUNEDKNVFVB' },
    { code: 'USD', name: 'US dollar',         symbol: '$',   flag: '🇺🇸', campaign: 'FUNBKPYBFEE' }
  ];

  // Links that should open the picker instead of their own checkout.
  function isDonateLink(a) {
    var href = a.getAttribute('href') || '';
    return /donorsupport\.co\/-\//i.test(href) || /[?&]form=donate\b/i.test(href) || href === '#choose-currency';
  }

  // ?form=donate would make Fundraise Up open its own checkout on load. Strip it now (before the
  // loader reads the URL) and open the picker instead.
  var params = new URLSearchParams(location.search);
  var openOnLoad = params.get('form') === 'donate';
  if (openOnLoad) {
    params.delete('form');
    var qs = params.toString();
    history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
  }

  // Capture phase on window runs before Fundraise Up's own link handling.
  window.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !isDonateLink(a)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    open();
  }, true);

  var CSS = "\
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');\
.sz-backdrop{position:fixed;inset:0;z-index:2147483647;background:rgba(17,24,39,.62);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:24px 16px;opacity:0;transition:opacity .25s ease;font-family:'IBM Plex Sans',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;overflow-y:auto}\
.sz-backdrop.sz-in{opacity:1}\
.sz-backdrop.sz-handoff{background:rgba(17,24,39,.62);transition:opacity .35s ease .15s}\
.sz-close{position:fixed;top:14px;right:14px;width:28px;height:28px;border-radius:50%;border:0;background:#fff;color:#1f2937;font-size:18px;line-height:28px;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.25);padding:0}\
.sz-close:hover{background:#f3f4f6}\
.sz-modal{flex-shrink:0;margin-top:auto;display:flex;width:960px;max-width:100%;min-height:640px;background:#fff;border-radius:16px;padding:8px;gap:8px;box-shadow:0 20px 50px rgba(0,0,0,.35);transform:translateY(12px) scale(.98);transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .3s ease;opacity:0}\
.sz-in .sz-modal{transform:none;opacity:1}\
.sz-modal.sz-out{transform:scale(.96);opacity:0;transition:transform .32s cubic-bezier(.4,0,.2,1),opacity .28s ease}\
.sz-left{flex:1 1 0;display:flex;flex-direction:column;min-width:0}\
.sz-photo{width:100%;height:300px;object-fit:cover;border-radius:12px;display:block}\
.sz-story{padding:22px 24px 16px;display:flex;flex-direction:column;flex:1;color:#1f2937}\
.sz-logo{width:56px;height:auto;margin-bottom:18px}\
.sz-story h2{font-size:22px;font-weight:600;margin:0 0 12px;letter-spacing:-.01em;color:#111827}\
.sz-story p{font-size:15px;line-height:1.5;margin:0;color:#1f2937}\
.sz-links{margin-top:auto;padding-top:20px;font-size:12px;color:#4b5563}\
.sz-links a{color:#4b5563;text-decoration:underline;text-underline-offset:2px}\
.sz-right{flex:0 0 380px;border:1px solid #e5e7eb;border-radius:12px;padding:24px 24px 18px;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(0,0,0,.04)}\
.sz-secure{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:600;color:#111827;margin-bottom:20px}\
.sz-secure svg{width:22px;height:22px;flex:none}\
.sz-ask{font-size:15px;font-weight:500;color:#111827;margin:0 0 4px}\
.sz-sub{font-size:13px;color:#6b7280;margin:0 0 16px}\
.sz-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}\
.sz-cur{display:flex;align-items:center;gap:10px;text-align:left;border:1px solid #d1d5db;border-radius:8px;background:#fff;padding:10px 12px;cursor:pointer;font:inherit;color:#1f2937;transition:border-color .15s,background .15s,box-shadow .15s}\
.sz-cur:hover{border-color:#9ca3af}\
.sz-cur:focus-visible{outline:2px solid #3370e3;outline-offset:2px}\
.sz-cur.sz-picked{border:2px solid #3370e3;background:#ebf2fe;padding:9px 11px}\
.sz-flag{font-size:20px;line-height:1}\
.sz-code{display:block;font-size:15px;font-weight:600}\
.sz-name{display:block;font-size:12px;color:#6b7280;margin-top:1px}\
.sz-foot{margin-top:auto;padding-top:18px;text-align:center;font-size:12px;color:#6b7280}\
.sz-lock{display:inline-flex;align-items:center;gap:6px}\
.sz-below{width:960px;max-width:100%;text-align:center;color:rgba(255,255,255,.85);font-size:11px;margin-top:10px;margin-bottom:auto}\
.sz-spin{display:inline-block;width:14px;height:14px;border:2px solid #3370e3;border-right-color:transparent;border-radius:50%;animation:sz-r .7s linear infinite;margin-left:auto}\
@keyframes sz-r{to{transform:rotate(360deg)}}\
@media (max-width:820px){.sz-backdrop{padding:16px 8px 24px}.sz-modal{flex-direction:column;min-height:0;gap:0;border-radius:16px}.sz-photo{height:auto;aspect-ratio:1.72;border-radius:12px}.sz-story{padding:28px 12px 20px}.sz-logo{width:34px;margin-bottom:22px}.sz-story h2{font-size:20px;margin-bottom:10px}.sz-story p{font-size:16px;line-height:1.4}.sz-links{display:block;padding-top:16px}.sz-right{flex:none;border:0;border-top:1px solid #e5e7eb;border-radius:0;box-shadow:none;padding:24px 12px 12px}.sz-secure{font-size:20px;margin-bottom:18px}.sz-secure svg{width:28px;height:28px}.sz-ask{font-size:16px}.sz-cur{padding:10px}.sz-cur.sz-picked{padding:9px}.sz-flag{font-size:18px}.sz-close{top:12px;right:12px;width:32px;height:32px;line-height:32px;font-size:22px;background:#f3f4f6;color:#4b5563;box-shadow:none}.sz-below{margin-top:16px;font-size:12px}}\
@media (prefers-reduced-motion:reduce){.sz-backdrop,.sz-modal,.sz-modal.sz-out{transition:none}}";

  var SHIELD = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.5 4 5.5v6c0 4.7 3.3 8.9 8 10 4.7-1.1 8-5.3 8-10v-6l-8-3Z" stroke="#12b886" stroke-width="2" stroke-linejoin="round"/><rect x="9" y="10.5" width="6" height="5" rx="1" fill="#12b886"/><path d="M10.2 10.5V9.2a1.8 1.8 0 0 1 3.6 0v1.3" stroke="#12b886" stroke-width="1.6"/></svg>';

  var root = null, lastFocus = null, busy = false;

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    root = document.createElement('div');
    root.className = 'sz-backdrop';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'sz-ask');
    root.innerHTML =
      '<button class="sz-close" type="button" aria-label="Close">&times;</button>' +
      '<div class="sz-modal">' +
        '<div class="sz-left">' +
          '<img class="sz-photo" src="assets/picker-photo.jpg" alt="Students in a Room to Read program">' +
          '<div class="sz-story">' +
            '<img class="sz-logo" src="assets/logo-160.png" alt="Room to Read">' +
            '<h2>Invest in children\'s futures</h2>' +
            '<p>Help children access the quality education they need to create a better tomorrow. Your gift supports life-changing literacy and gender equality programming in communities experiencing deep educational, gender and economic inequities.</p>' +
            '<div class="sz-links"><a href="#" data-sz-close>Other ways to give</a> &middot; <a href="#" data-sz-close>Privacy policy</a></div>' +
          '</div>' +
        '</div>' +
        '<div class="sz-right">' +
          '<div class="sz-secure">' + SHIELD + 'Secure donation</div>' +
          '<p class="sz-ask" id="sz-ask">Choose your currency to make a donation</p>' +
          '<p class="sz-sub">Your gift is processed in the currency you pick.</p>' +
          '<div class="sz-grid">' + CURRENCIES.map(function (c, i) {
            return '<button type="button" class="sz-cur" data-i="' + i + '">' +
              '<span class="sz-flag" aria-hidden="true">' + c.flag + '</span>' +
              '<span><span class="sz-code">' + c.code + ' ' + (c.symbol === c.code ? '' : c.symbol) + '</span>' +
              '<span class="sz-name">' + c.name + '</span></span></button>';
          }).join('') + '</div>' +
          '<div class="sz-foot"><span class="sz-lock">' + SHIELD.replace('<svg', '<svg width="14" height="14"') + 'Secure checkout by Fundraise Up</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="sz-below">Room to Read is a tax-exempt organization as described in Section 501(c)(3) of the United States Internal Revenue Code.</div>';
    document.body.appendChild(root);

    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.closest('.sz-close') || e.target.closest('[data-sz-close]')) {
        e.preventDefault();
        close();
        return;
      }
      var btn = e.target.closest('.sz-cur');
      if (btn) choose(btn);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root && root.style.display !== 'none' && !busy) close();
    });
  }

  function open() {
    if (!document.body) return;
    if (!root) build();
    busy = false;
    lastFocus = document.activeElement;
    var modal = root.querySelector('.sz-modal');
    modal.classList.remove('sz-out');
    root.classList.remove('sz-handoff');
    [].forEach.call(root.querySelectorAll('.sz-cur'), function (b) {
      b.classList.remove('sz-picked');
      var s = b.querySelector('.sz-spin'); if (s) s.remove();
    });
    root.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('sz-in'); }); });
    setTimeout(function () { var f = root.querySelector('.sz-cur'); if (f) f.focus({ preventScroll: true }); }, 50);
  }

  function close() {
    if (!root) return;
    root.classList.remove('sz-in');
    setTimeout(function () {
      root.style.display = 'none';
      document.documentElement.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }, 250);
  }

  function choose(btn) {
    if (busy) return;
    busy = true;
    var cur = CURRENCIES[+btn.getAttribute('data-i')];
    btn.classList.add('sz-picked');
    btn.insertAdjacentHTML('beforeend', '<span class="sz-spin" aria-hidden="true"></span>');

    // Short beat on the picked state, then the card scales away while the backdrop stays,
    // so the Fundraise Up checkout appears in the same spot.
    setTimeout(function () {
      root.querySelector('.sz-modal').classList.add('sz-out');
      var FU = window.FundraiseUp;
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        root.classList.add('sz-handoff');
        root.classList.remove('sz-in');
        setTimeout(function () {
          root.style.display = 'none';
          document.documentElement.style.overflow = '';
          busy = false;
        }, 500);
      }
      if (FU && typeof FU.openCheckout === 'function') {
        if (typeof FU.on === 'function') FU.on('checkoutOpen', finish);
        FU.openCheckout(cur.campaign);
        setTimeout(finish, 1800); // fallback if the event never fires
      } else {
        finish();
        console.warn('Fundraise Up is not loaded yet; could not open', cur.campaign);
      }
    }, 280);
  }

  window.roomToReadStepZero = { open: open, close: close, currencies: CURRENCIES };

  if (openOnLoad) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open);
    else open();
  }
})();
