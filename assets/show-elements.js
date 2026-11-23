window.FRU_SHOW_LABELS = {};
/* clone-demo: hold the E key (about 1 second) to outline every Fundraise Up Element on the page; hold E again, or press Esc, to hide.
   Also on with ?elements in the address. Ignored while typing in a field, and Fundraise Up's own checkout runs in
   its own frame, so typing there never reaches this page. Nothing shows until it is turned on. */
(function () {
  if (window.__fruShowElements) return;
  window.__fruShowElements = true;
  var HOLD_MS = 900, on = false, timer = null, boxes = [], raf = null;
  var SKIP = { testModePanel: 1 };
  var NAMES = { donateButton: "Donate Button", simpleForm: "Donation Form", imageCard: "Image Card",
    goalMeter: "Goal Meter", socialProof: "Social Proof", stickyButton: "Sticky Button",
    floatingButton: "Floating Button", reminder: "Reminder", zakatAlMalCalculator: "Zakat al-Mal Calculator",
    zakatAlFitrCalculator: "Zakat al-Fitr Calculator", fidiyahKaffarahCalculator: "Fidya & Kaffara Calculator" };
  function label(type) {
    if (NAMES[type]) return NAMES[type];
    var s = type.replace(/([a-z])([A-Z])/g, "$1 $2");
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  /* Gift Cart and Sponsorship catalogs are one frame each (id gift-catalog-<catalog ID>) plus a cart button
     (gift-basket-button-<catalog ID>). The publish step names sponsorship catalogs in window.FRU_SHOW_LABELS. */
  var CATALOG = /^gift-(catalog|basket-button)-(FUN[A-Z0-9]+)$/;
  /* Links the build made: lock-links switches off every link that leaves the demo (data-fru-off), so a live link
     to another demo page or the Donor Portal is one the build put there. A data-fru-show-label attribute overrides. */
  var PAGES = { giftcart: "Gift Cart page", sponsor: "Sponsorship page", "sponsor-animals": "Animal sponsorship page",
    p2p: "P2P page", email: "Marketing email", "social-ad": "Social ad" };
  function norm(p) { return p.replace(/\/index(\.html)?$/, "/").replace(/\.html$/, "").replace(/(.)\/$/, "$1"); }
  function linkName(a) {
    var h = a.getAttribute("href") || "";
    if (a.hasAttribute("data-fru-off") || !h || h.charAt(0) === "#" || /^(mailto|tel|javascript|data):/i.test(h)) return null;
    var u;
    try { u = new URL(h, location.href); } catch (e) { return null; }
    if (/\.donorsupport\.co$/i.test(u.hostname)) return "Link \u2192 Donor Portal";
    if (u.origin !== location.origin) return null;
    if (/[?&]form=/.test(u.search)) return "Link \u2192 Fundraise Up checkout";
    var p = norm(u.pathname);
    if (p === norm(location.pathname)) return null;
    if (p === "/" || p === "") return "Link \u2192 Home page";
    var key = decodeURIComponent(p.split("/").pop()).toLowerCase();
    if (PAGES[key]) return "Link \u2192 " + PAGES[key];
    if (/^[a-z]{2}$/.test(key)) return "Link \u2192 " + key.toUpperCase() + " language page";
    var seg = key.replace(/[-_]+/g, " ");
    return "Link \u2192 " + seg.charAt(0).toUpperCase() + seg.slice(1) + " page";
  }
  function nameOf(el) {
    if (el.getAttribute("data-fru-show-label")) return el.getAttribute("data-fru-show-label");
    var c = (el.id || "").match(CATALOG);
    if (c) {
      var kind = (window.FRU_SHOW_LABELS || {})[c[2]] || "Gift Cart";
      return c[1] === "catalog" ? kind : (kind === "Gift Cart" ? "Gift Cart Button" : "Sponsorship Cart Button");
    }
    var m = String(el.className || "").match(/fun-element-([A-Za-z]+)/);
    if (m) return SKIP[m[1]] ? null : label(m[1]);
    return el.tagName === "A" ? linkName(el) : null;
  }
  function draw() {
    boxes.forEach(function (b) { b.remove(); });
    boxes = [];
    if (!on) return;
    var els = document.querySelectorAll('[class*="fun-element-"], iframe[id^="gift-catalog-"], iframe[id^="gift-basket-button-"], a[href], [data-fru-show-label]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], name = nameOf(el);
      /* Elements are the focal point: bold pink with a glow ("everything in pink is Fundraise Up"; pink reads for
         colour-blind viewers too). Links the build made are a quiet reminder for the presenter: thin dashed slate blue. */
      var link = name && /^Link /.test(name) || (el.hasAttribute && el.hasAttribute("data-fru-show-label"));
      if (!name) continue;
      var r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      var fixed = getComputedStyle(el).position === "fixed";
      if (fixed && (r.top > innerHeight - 8 || r.bottom < 8 || r.left > innerWidth - 8 || r.right < 8)) continue; /* parked off-screen (a pop-up not showing yet) */
      var b = document.createElement("div");
      b.setAttribute("data-fru-show", "");
      b.style.cssText = "position:" + (fixed ? "fixed" : "absolute") + ";z-index:2147483646;pointer-events:none;" +
        "left:" + (r.left + (fixed ? 0 : scrollX) - 4) + "px;top:" + (r.top + (fixed ? 0 : scrollY) - 4) + "px;" +
        "width:" + (r.width + 8) + "px;height:" + (r.height + 8) + "px;border-radius:8px;box-sizing:border-box;" +
        (link ? "border:2px dashed rgba(71,85,105,.7)" : "border:3px solid #ff2d87;box-shadow:0 0 0 4px rgba(255,45,135,.25)");
      var tag = document.createElement("span");
      tag.textContent = name;
      tag.style.cssText = "position:absolute;left:-3px;" + (r.top < 26 && fixed ? "bottom:-26px" : "top:-26px") + ";" +
        (link ? "background:rgba(71,85,105,.85);color:#fff;font:500 11px/1 -apple-system,Segoe UI,Arial,sans-serif;padding:4px 6px;"
              : "background:#ff2d87;color:#fff;font:600 12px/1 -apple-system,Segoe UI,Arial,sans-serif;padding:6px 8px;") +
        "border-radius:6px;white-space:nowrap;letter-spacing:.2px";
      b.appendChild(tag);
      document.body.appendChild(b);
      boxes.push(b);
    }
  }
  function redraw() { if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
  function toggle(v) { on = (v === undefined) ? !on : v; draw(); }
  function typing(e) {
    var a = document.activeElement, t = e.target;
    var el = (t && t.nodeType === 1) ? t : a;
    if (!el) return false;
    var n = el.tagName;
    return n === "INPUT" || n === "TEXTAREA" || n === "SELECT" || el.isContentEditable;
  }
  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && on) { toggle(false); return; }
    if ((e.key !== "e" && e.key !== "E") || e.metaKey || e.ctrlKey || e.altKey || typing(e)) return;
    if (e.repeat) { e.preventDefault(); return; }
    clearTimeout(timer);
    timer = setTimeout(function () { timer = null; toggle(); }, HOLD_MS);
  });
  addEventListener("keyup", function (e) {
    if (e.key === "e" || e.key === "E") { clearTimeout(timer); timer = null; }
  });
  addEventListener("blur", function () { clearTimeout(timer); timer = null; });
  addEventListener("scroll", function () { if (on) redraw(); }, { passive: true });
  addEventListener("resize", function () { if (on) redraw(); });
  setInterval(function () { if (on) draw(); }, 1500); /* Elements that load or move later */
  window.fruShowElements = toggle;
  if (/[?&]elements\b/.test(location.search)) {
    var tries = 0, t2 = setInterval(function () {
      tries++;
      if (document.querySelector('[class*="fun-element-"]') || tries > 20) { clearInterval(t2); setTimeout(function () { toggle(true); }, 800); }
    }, 500);
  }
})();
