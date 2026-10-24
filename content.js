(() => {
  const root = document.documentElement;
  const stage = Object.assign(document.createElement("div"), { id: "ytg-stage", className: "ytg-stage" });
  const FLAGS = ["data-ytg-on", "data-ytg-ads", "data-ytg-mode", "data-ytg-theme", "data-ytg-lum", "data-ytg-simple", "data-ytg-focus", "data-ytg-glow", "data-ytg-cursor", "data-ytg-tback",
    "data-ytg-shimmer", "data-ytg-ambient", "data-ytg-icons", "data-ytg-noshorts", "data-ytg-nocomments"];
  let s = { ...YTG.DEFAULTS }, img = "", applied = [];
  const dark = matchMedia("(prefers-color-scheme: dark)");

  const mode = () => (dark.matches ? "dark" : "light");   // always follows the system theme
  const flag = (n, on) => (on ? root.setAttribute(n, "") : root.removeAttribute(n));

  // ---- Themed cursor: gold arrow + gold HAND on links, with a soft shadow. Native cursor image = zero lag ----
  const curStyle = Object.assign(document.createElement("style"), { id: "ytg-cursor" });
  let curKey = "";
  const svgUrl = svg => 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  function setCursor(base, on) {
    const key = on ? base : "off";
    if (key === curKey) return; curKey = key;
    if (!on) { curStyle.remove(); return; }
    const L = YTG.shade(base, 0.55), M = base, D = YTG.shade(base, -0.45), OUT = YTG.shade(base, -0.65);
    const defs = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${L}"/><stop offset=".55" stop-color="${M}"/><stop offset="1" stop-color="${D}"/></linearGradient>` +
      `<filter id="s" x="-40%" y="-40%" width="190%" height="200%"><feDropShadow in="SourceGraphic" dx="0" dy="0" stdDeviation="1.7" flood-color="${M}" flood-opacity=".95" result="o"/><feDropShadow in="o" dx="1" dy="1.8" stdDeviation="1.1" flood-color="#000" flood-opacity=".5"/></filter></defs>`;
    const arrowPath = "M6 3v20l5.2-4.6 3.4 7.6 3.6-1.6-3.4-7.4H22z";
    const arrow = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${defs}<g filter="url(#s)"><path d="${arrowPath}" fill="url(#g)" stroke="${OUT}" stroke-width="1.3" stroke-linejoin="round"/></g></svg>`);
    // pointing hand built from rounded shapes: outline pass first, gold fill pass on top = one clean silhouette
    const hs = '<path d="M13 3.2c-1.2 0-2.1.9-2.1 2.1v9.3l-1.5-1.4c-.9-.8-2.2-.8-3 0-.7.7-.8 1.8-.1 2.6l5.4 6.5c1.4 1.7 3.4 2.7 5.6 2.7h2.5c3.4 0 6.2-2.8 6.2-6.2v-5c0-1.2-1-2.1-2.1-2.1-.4 0-.8.1-1.1.3-.3-.8-1.1-1.4-2-1.4-.5 0-1 .2-1.4.5-.4-.8-1.2-1.3-2.1-1.3-.3 0-.6.1-.9.2V5.3c0-1.2-.9-2.100-2.1-2.1z"/>';
    const hand = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">${defs}<g filter="url(#s)"><g fill="${OUT}" stroke="${OUT}" stroke-width="1.8" stroke-linejoin="round">${hs}</g><g fill="url(#g)">${hs}</g></g></svg>`);
    curStyle.textContent =
      `html[data-ytg-cursor], html[data-ytg-cursor] * { cursor: ${arrow} 6 3, auto !important; }
       html[data-ytg-cursor] :is(a,button,[role="button"],[role="link"],[role="tab"],[role="menuitem"],[role="option"],summary,label,select,input[type="checkbox"],input[type="radio"],input[type="range"],tp-yt-paper-item,tp-yt-paper-button,yt-icon-button,ytd-thumbnail,.ytp-button,.ytp-progress-bar-container,yt-chip-cloud-chip-renderer,chip-shape) { cursor: ${hand} 14 3, pointer !important; }
       html[data-ytg-cursor] :is(input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),textarea,[contenteditable="true"],[contenteditable=""]) { cursor: text !important; }`;
    if (!curStyle.isConnected) (document.head || root).appendChild(curStyle);
  }

  function apply() {
    if (!s.enabled) {
      FLAGS.forEach(a => root.removeAttribute(a));
      applied.concat("--ytg-v").forEach(k => root.style.removeProperty(k));
      applied = []; stage.remove(); curStyle.remove(); curKey = "";
      document.querySelectorAll("[data-ytg-clear]").forEach(e => e.removeAttribute("data-ytg-clear"));
      return;
    }
    schedule(300);
    if (!stage.isConnected) root.appendChild(stage);
    const m = mode(), v = YTG.vars(s, m);
    for (const k in v) if (root.style.getPropertyValue(k) !== String(v[k])) root.style.setProperty(k, v[k]);
    applied = Object.keys(v);
    root.setAttribute("data-ytg-on", "");
    flag("data-ytg-ads", s.ads && s.adHide);
    root.setAttribute("data-ytg-mode", m);
    root.setAttribute("data-ytg-theme", s.theme);
    flag("data-ytg-simple", s.simple);
    flag("data-ytg-focus", s.focus);
    flag("data-ytg-glow", s.glow);
    flag("data-ytg-cursor", s.cursor);
    flag("data-ytg-tback", s.titleBack);
    flag("data-ytg-shimmer", s.shimmer);
    flag("data-ytg-ambient", s.ambient);
    flag("data-ytg-noshorts", s.hideShorts);
    flag("data-ytg-nocomments", s.hideComments);
    root.setAttribute("data-ytg-icons", s.iconMode);
    setCursor(s.cursorColor === "gold" ? s.gold : v["--ytg-a"], s.cursor);
    if (!s.glow && !s.ambient) {
      root.style.removeProperty("--ytg-v");
    } else if (v["--ytg-a"]) {
      // Instantly switch ambient radiance color with active theme without 1-2s delay
      root.style.setProperty("--ytg-v", v["--ytg-a"]);
    }
    if (!s.glow) root.style.setProperty("--ytg-p", "var(--ytg-a)");
    if (!root.style.getPropertyValue("--ytg-ui")) root.style.setProperty("--ytg-ui", "color-mix(in srgb, var(--ytg-p) 80%, #fff)");
    YTG.stage(stage, s, m, img);
    try { localStorage.setItem("ytg_s", JSON.stringify(s)); } catch (e) {}
  }

  // ---- Live Ambient Light: Edge Scene Analyzer for Theater, Normal & Fullscreen Modes ----
  let amb = null, ambCx = null, ambRun = false, ambT = 0;
  function ambLoop(t) {
    if (!s.enabled || !s.ambient) {
      if (amb) { amb.remove(); amb = null; }
      ambRun = false;
      return;
    }
    const isFs = !!document.fullscreenElement;
    const p = isFs
      ? document.querySelector(".html5-video-player.ytp-fullscreen")
      : (document.querySelector("ytd-watch-flexy[theater] #player-theater-container") ||
         document.querySelector("ytd-watch-flexy #player-container-outer") ||
         document.querySelector("#movie_player"));

    if (!p) {
      if (amb) { amb.remove(); amb = null; }
      requestAnimationFrame(ambLoop);
      return;
    }

    if (t - ambT > 40) { // ~25 FPS real-time scene analysis
      ambT = t;
      const v = document.querySelector("video.html5-main-video") || p.querySelector("video");
      if (v && v.readyState >= 2 && v.videoWidth && !v.paused) {
        if (!amb || amb.parentElement !== p) {
          if (amb) amb.remove();
          amb = document.createElement("canvas");
          amb.className = "ytg-amb";
          amb.width = 64;
          amb.height = 36;
          ambCx = amb.getContext("2d", { willReadFrequently: true });
          p.style.position = "relative";
          p.insertBefore(amb, p.firstChild);
          requestAnimationFrame(() => amb && amb.classList.add("on"));
        }
        try {
          const W = 64, H = 36;
          const pr = p.getBoundingClientRect();
          const vr = v.getBoundingClientRect();
          const vw = v.videoWidth, vh = v.videoHeight;
          const x = Math.max(0, (vr.left - pr.left) * W / (pr.width || 1));
          const y = Math.max(0, (vr.top - pr.top) * H / (pr.height || 1));
          const w = Math.min(W - x, vr.width * W / (pr.width || 1));
          const h = Math.min(H - y, vr.height * H / (pr.height || 1));

          ambCx.globalAlpha = 0.75;
          ambCx.drawImage(v, x, y, w, h);
          // Extend top and bottom scene colors
          if (y > 0.5) {
            ambCx.drawImage(v, 0, 0, vw, Math.max(1, vh * 0.05), 0, 0, W, y);
            ambCx.drawImage(v, 0, Math.max(0, vh * 0.95), vw, Math.max(1, vh * 0.05), 0, y + h, W, Math.max(1, H - y - h));
          }
          // Extend left and right edge scene colors into the surrounding space
          ambCx.drawImage(v, 0, 0, Math.max(1, vw * 0.05), vh, 0, 0, Math.max(1, x || 14), H);
          ambCx.drawImage(v, Math.max(0, vw * 0.95), 0, Math.max(1, vw * 0.05), vh, Math.min(W - 14, x + w), 0, Math.max(1, W - x - w || 14), H);
          ambCx.globalAlpha = 1;

          // Real-time dominant color extraction for UI
          const d = ambCx.getImageData(Math.floor(W / 2), Math.floor(H / 2), 1, 1).data;
          root.style.setProperty("--ytg-v", `rgb(${d[0]},${d[1]},${d[2]})`);
        } catch (e) {}
      }
    }
    requestAnimationFrame(ambLoop);
  }
  const fs = () => {
    root.toggleAttribute("data-ytg-fs", !!document.fullscreenElement);
  };
  document.addEventListener("fullscreenchange", fs); fs();
  if (!ambRun) { ambRun = true; requestAnimationFrame(ambLoop); }

  // ---- Freeze background animation while scrolling (keeps scrolling smooth) ----
  let timer = 0, busy = false;
  addEventListener("scroll", () => {
    if (!s.pauseScroll) return;
    if (!busy) { busy = true; stage.classList.add("busy"); }
    clearTimeout(timer);
    timer = setTimeout(() => { busy = false; stage.classList.remove("busy"); }, 160);
  }, { passive: true, capture: true });

  // ---- Video colours: samples a tiny 8x8 frame of the playing video every 1.5s (very cheap) ----
  const cv = document.createElement("canvas"); cv.width = cv.height = 8;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  let blocked = false, lightScene = false;
  function playingVideo() {
    let best = null, area = 0;
    for (const v of document.querySelectorAll("video")) {
      if (v.paused || v.readyState < 2) continue;
      const r = v.getBoundingClientRect(), a = r.width * r.height;
      if (a > area && r.bottom > 0 && r.top < innerHeight) { best = v; area = a; }
    }
    return best;
  }
  setInterval(() => {
    if (!s.enabled || !(s.glow || s.ambient || s.adaptive) || blocked || document.hidden || busy) return;
    const v = playingVideo();
    if (!v) return;
    try {
      cx.drawImage(v, 0, 0, 8, 8);
      const d = cx.getImageData(0, 0, 8, 8).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      r /= 64; g /= 64; b /= 64;
      const l = 0.3 * r + 0.59 * g + 0.11 * b;
      [r, g, b] = [r, g, b].map(c => l + (c - l) * 1.8);              // boost saturation
      const k = 225 / Math.max(r, g, b, 60);                           // bright enough to read on dark UI
      const f = c => Math.max(0, Math.min(255, Math.round(c * k)));
      root.style.setProperty("--ytg-v", `rgb(${f(r)},${f(g)},${f(b)})`);
      root.style.setProperty("--ytg-p", s.glow ? `rgb(${f(r)},${f(g)},${f(b)})` : "var(--ytg-a)");
      // UI colors: always maintain bright, crisp theme icons (never turn muddy dark)
      root.removeAttribute("data-ytg-lum");
      root.style.setProperty("--ytg-ui", "color-mix(in srgb, var(--ytg-a) 75%, #ffffff)");
    } catch (e) {}
  }, 120);

  // ---- App-wide safety net: find big dark (or, in dark theme, big white) panels and make them see-through ----
  // Works on any page (history, Shorts, library, settings...) without knowing YouTube's class names.
  const SKIP = [
    "ytd-thumbnail", "yt-thumbnail-view-model", "ytd-player", ".html5-video-player", "video", "canvas", "img",
    "ytd-popup-container", "tp-yt-iron-dropdown", "tp-yt-paper-dialog", "ytd-menu-popup-renderer",
    "yt-notification-action-renderer", "tp-yt-paper-tooltip", "ytd-reel-player-overlay-renderer",
    "ytd-miniplayer", "#ytg-stage", "yt-live-chat-renderer", "iframe", "button", "yt-button-shape",
    "ytd-rich-item-renderer", "ytd-video-renderer", "ytd-compact-video-renderer", "ytd-grid-video-renderer",
    "ytd-comment-thread-renderer", "ytd-comment-view-model", "ytd-playlist-panel-video-renderer", "ytd-reel-shelf-renderer"
  ].join(",");
  const MIN_W = 240, MIN_H = 30;          // ignore small things (chips, badges, buttons)
  let scanTimer = 0;

  function parseRGBA(c) {
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  function scan() {
    scanTimer = 0;
    if (!s.enabled) return;
    if (document.hidden || busy) { schedule(4000); return; }
    const app = document.querySelector("ytd-app");
    if (!app) return;
    const darkTheme = mode() === "dark";
    const walker = document.createTreeWalker(app, NodeFilter.SHOW_ELEMENT, {
      acceptNode: n => (n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
    });
    const cand = [];
    (function chunk() {
      const t0 = performance.now();
      let n;
      while ((n = walker.nextNode())) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const c = parseRGBA(bg);
          if (c && c.a >= 0.35 &&
              (Math.max(c.r, c.g, c.b) <= 70 || (darkTheme && Math.min(c.r, c.g, c.b) >= 235))) cand.push(n);
        }
        if (performance.now() - t0 > 8) { setTimeout(chunk, 16); return; }   // never block the page
      }
      // read sizes first, then write (one layout pass)
      const hits = cand.filter(el => { const r = el.getBoundingClientRect(); return r.width >= MIN_W && r.height >= MIN_H; });
      hits.forEach(el => el.setAttribute("data-ytg-clear", ""));
    })();
  }
  function schedule(ms) { if (!scanTimer) scanTimer = setTimeout(scan, ms); }

  document.addEventListener("yt-navigate-finish", () => { schedule(500); setTimeout(() => schedule(100), 3000); setTimeout(() => schedule(100), 7000); });
  setTimeout(() => schedule(100), 1500);

  // ---- YouTube wordmark: gold text only (the red icon stays as it is) ----
  setInterval(() => {
    const svg = document.querySelector("ytd-topbar-logo-renderer #logo-icon svg, #logo-icon svg");
    if (!svg) return;
    const on = s.enabled, vb = svg.viewBox && svg.viewBox.baseVal;
    if (!vb || !vb.width) return;
    if (svg.dataset.ytgLogo === (on ? "1" : "0")) return;
    svg.dataset.ytgLogo = on ? "1" : "0";
    svg.querySelectorAll("path").forEach(p => {
      try { if (p.getBBox().x >= vb.width * 0.28) { if (on) p.style.setProperty("fill", "color-mix(in srgb, var(--ytg-a) 72%, #fff)", "important"); else p.style.removeProperty("fill"); } } catch (e) {}
    });
  }, 1500);

  // ---- Player housekeeping: auto-click Skip, close overlay ads (never touches video playback speed) ----
  setInterval(() => {
    if (!s.enabled || !s.ads) return;
    if (s.adSkip) {
      const b = document.querySelector(".ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-container button");
      hit(b || document.querySelector(SKIP2));
      const c = document.querySelector(".ytp-ad-overlay-close-button, .ytp-ad-overlay-close-container");
      if (c) c.click();
    }
  }, 120);

  // ---- Shorts letterbox killer: ensure side pillars around vertical video are completely transparent ----
  function clearShortsLetterbox() {
    if (!s.enabled) return;
    const isShorts = location.pathname.startsWith("/shorts") || !!document.querySelector("ytd-shorts");
    if (!isShorts) return;
    const selectors = [
      "ytd-shorts",
      "#shorts-container",
      "#shorts-inner-container",
      "ytd-reel-video-renderer",
      "#player-container",
      "#player-container-inner",
      "#shorts-player",
      "ytd-shorts .html5-video-player",
      "ytd-shorts .html5-video-container",
      "ytd-shorts video.video-stream",
      "ytd-shorts video.html5-main-video"
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el && el.style.backgroundColor !== "transparent") {
          el.style.setProperty("background-color", "transparent", "important");
          el.style.setProperty("background", "transparent", "important");
        }
      });
    });
  }
  setInterval(clearShortsLetterbox, 800);
  document.addEventListener("yt-navigate-finish", clearShortsLetterbox);

  // ---- Mini-Guide & Sidebar: Ensure 100% transparent glass with live animated wallpaper visible ----
  function clearMiniSidebar() {
    if (!s.enabled) return;
    const mg = document.querySelector("ytd-mini-guide-renderer");
    if (mg) {
      if (mg.style.backgroundColor !== "transparent") {
        mg.style.setProperty("background", "transparent", "important");
        mg.style.setProperty("background-color", "transparent", "important");
      }
      const items = mg.querySelector("#items");
      if (items && items.style.backgroundColor !== "transparent") {
        items.style.setProperty("background", "transparent", "important");
        items.style.setProperty("background-color", "transparent", "important");
      }
    }
  }
  setInterval(clearMiniSidebar, 800);
  document.addEventListener("yt-navigate-finish", clearMiniSidebar);

  // ---- Universal Scrollbar Killer across Shadow DOM and Main Document ----
  const scrollbarKillerStyle = Object.assign(document.createElement("style"), {
    id: "ytg-scrollbar-killer",
    textContent: `
      html[data-ytg-on], html[data-ytg-on] body, html[data-ytg-on] * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      html[data-ytg-on]::-webkit-scrollbar,
      html[data-ytg-on] *::-webkit-scrollbar,
      html[data-ytg-on] *::-webkit-scrollbar-track,
      html[data-ytg-on] *::-webkit-scrollbar-thumb,
      html[data-ytg-on] *::-webkit-scrollbar-corner,
      html[data-ytg-on] *::-webkit-scrollbar-button {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
    `
  });
  if (!document.getElementById("ytg-scrollbar-killer")) {
    (document.head || root).appendChild(scrollbarKillerStyle);
  }

  // ---- Tag YouTube's "New" badges and Subscribe/Subscribed buttons for theme matching ----
  function updateButtonsAndBadges() {
    if (!s.enabled) return;
    // 1. Tag YouTube's "New" badges on video thumbnails
    const badges = document.querySelectorAll("ytd-thumbnail #overlays badge-shape, yt-thumbnail-view-model badge-shape, ytd-thumbnail-overlay-badge-renderer, .badge-shape-wiz--thumbnail-badge, .yt-badge-shape");
    badges.forEach(b => {
      const txt = (b.textContent || "").trim();
      if (txt === "New" || b.getAttribute("aria-label") === "New") {
        if (!b.hasAttribute("data-ytg-new-badge")) b.setAttribute("data-ytg-new-badge", "1");
      }
    });

    // 2. Tag Subscribe vs Subscribed buttons to prevent white background
    const subBtns = document.querySelectorAll(
      "#subscribe-button button, ytd-subscribe-button-renderer button, yt-subscribe-button-view-model button, " +
      "yt-channel-header-view-model button, .yt-channel-header-view-model-wiz__subscribe-button button, " +
      "ytd-c4-tabbed-header-renderer button, ytd-channel-header-renderer button, " +
      "ytd-subscription-notification-toggle-button-renderer-next button, yt-subscription-notification-toggle-button-renderer-next button, " +
      "#notification-preference-button button, ytd-reel-player-overlay-renderer #subscribe-button button, " +
      "button[aria-label*='Subscribe' i], button[aria-label*='Subscribed' i], button[aria-label*='notification' i]"
    );
    subBtns.forEach(btn => {
      const label = (btn.getAttribute("aria-label") || "").toLowerCase();
      const txt = (btn.textContent || "").trim().toLowerCase();
      const hasBell = !!btn.querySelector("svg, yt-icon");
      const isSubscribed = txt.includes("subscribed") || label.includes("subscribed") || label.includes("notification") || label.includes("unsubscribe") || (hasBell && !txt.includes("subscribe"));
      const state = isSubscribed ? "subscribed" : "subscribe";
      btn.setAttribute("data-ytg-sub-state", state);
      const parent = btn.closest("yt-button-shape, .yt-channel-header-view-model-wiz__subscribe-button, ytd-subscribe-button-renderer, yt-subscribe-button-view-model");
      if (parent) parent.setAttribute("data-ytg-sub-state", state);
    });
  }
  setInterval(updateButtonsAndBadges, 600);

  // ---- Skip button: click the instant it appears (users can still click it themselves) ----
  const SKIP2 = "button[class*=\"skip-button\"], button[class*=\"skip-ad\"], .ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-container button, .ytp-ad-overlay-close-button";
  function hit(b) {
    if (!b || b.offsetParent === null) return false;
    for (const t of ["pointerdown", "mousedown", "pointerup", "mouseup"]) b.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
    b.click(); return true;
  }
  let skipQ = false;
  new MutationObserver(() => {
    if (skipQ || !s.enabled || !s.ads || !s.adSkip) return;
    skipQ = true;
    requestAnimationFrame(() => { skipQ = false; hit(document.querySelector(SKIP2)); });
  }).observe(document, { childList: true, subtree: true });

  // ---- Enforce normal 1.0x default playback speed (undo any stuck 1.35x speed) ----
  function enforceDefaultSpeed() {
    const v = document.querySelector("video.html5-main-video");
    if (v && v.playbackRate !== 1) {
      v.playbackRate = 1;
    }
  }
  addEventListener("yt-navigate-finish", enforceDefaultSpeed);
  document.addEventListener("play", (e) => {
    if (e.target && e.target.tagName === "VIDEO" && e.target.playbackRate !== 1) {
      e.target.playbackRate = 1;
    }
  }, true);

  // ---- feed/search ad cards: hide only standalone ad cards (NEVER hide the suggested videos sidebar) ----
  setInterval(() => {
    if (!s.enabled || !s.ads || !s.adHide) return;
    const sel = "ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, ytd-display-ad-renderer, ytd-promoted-sparkles-web-renderer, ytd-promoted-video-renderer, ytd-search-pyv-renderer, ytd-banner-promo-renderer";
    document.querySelectorAll(sel).forEach(e => {
      const card = e.closest("ytd-rich-item-renderer, ytd-rich-section-renderer, ytd-ad-slot-renderer") || e;
      if (card && card.style.display !== "none") card.style.setProperty("display", "none", "important");
    });
  }, 900);

  // ---- Real In-Video Sponsor Detection (SponsorBlock) + Color-Coded Timeline Bars ----
  let curVideoId = "";
  let curSponsorSegments = [];
  let sponsorBtn = null;

  async function fetchSponsorSegments(vid) {
    if (!vid) return [];
    return new Promise(resolve => {
      try {
        chrome.runtime.sendMessage({ type: "GET_SPONSORS", videoId: vid }, res => {
          if (chrome.runtime.lastError || !Array.isArray(res)) resolve([]);
          else resolve(res);
        });
      } catch (e) {
        resolve([]);
      }
    });
  }

  function getSponsorBtn() {
    if (sponsorBtn && sponsorBtn.isConnected) return sponsorBtn;
    sponsorBtn = document.createElement("button");
    sponsorBtn.id = "ytg-skip-sponsor";
    sponsorBtn.className = "ytg-skip-sponsor";
    sponsorBtn.innerHTML = '<span>Skip Sponsor</span><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M5 18l10-6L5 6v12zm11-12v12h2V6h-2z"/></svg>';
    sponsorBtn.title = "Skip sponsored advertisement segment";
    return sponsorBtn;
  }

  function hideSponsorBtn() {
    if (sponsorBtn && sponsorBtn.isConnected) {
      sponsorBtn.classList.remove("on");
      setTimeout(() => { if (sponsorBtn && !sponsorBtn.classList.contains("on")) sponsorBtn.remove(); }, 200);
    }
  }

  function updateTimelineMarkers() {
    const progBar = document.querySelector(".ytp-progress-bar");
    const v = document.querySelector("video.html5-main-video");
    if (!progBar || !v || !isFinite(v.duration) || v.duration <= 0) return;
    
    // Clear old markers
    progBar.querySelectorAll(".ytg-sponsor-marker").forEach(m => m.remove());

    if (!curSponsorSegments || curSponsorSegments.length === 0) return;

    curSponsorSegments.forEach(seg => {
      const start = seg.segment[0];
      const end = seg.segment[1];
      const left = (start / v.duration) * 100;
      const width = ((end - start) / v.duration) * 100;
      const marker = document.createElement("div");
      marker.className = "ytg-sponsor-marker";
      marker.style.cssText = `position:absolute;left:${left.toFixed(2)}%;width:${width.toFixed(2)}%;top:0;bottom:0;background:#00d68f;box-shadow:0 0 4px #00d68f;z-index:35;pointer-events:none;border-radius:2px;opacity:0.85;`;
      progBar.appendChild(marker);
    });
  }

  // Check current playback against sponsor segments & video ID changes
  setInterval(async () => {
    if (!s.enabled) { hideSponsorBtn(); return; }
    
    const params = new URLSearchParams(location.search);
    const vid = params.get("v") || "";
    
    if (vid && vid !== curVideoId) {
      curVideoId = vid;
      curSponsorSegments = [];
      hideSponsorBtn();
      document.querySelectorAll(".ytg-sponsor-marker").forEach(m => m.remove());
      curSponsorSegments = await fetchSponsorSegments(vid);
      updateTimelineMarkers();
    }

    const player = document.querySelector(".html5-video-player");
    const v = document.querySelector("video.html5-main-video");
    if (!player || !v || v.paused) { hideSponsorBtn(); return; }

    // Ensure markers are present on progress bar
    if (curSponsorSegments.length > 0 && !player.querySelector(".ytg-sponsor-marker")) {
      updateTimelineMarkers();
    }

    // Check if user is currently inside a sponsor segment
    const curTime = v.currentTime;
    const activeSeg = curSponsorSegments.find(seg => curTime >= seg.segment[0] - 0.2 && curTime < seg.segment[1]);

    if (activeSeg) {
      const btn = getSponsorBtn();
      btn.onclick = (e) => {
        e.stopPropagation();
        v.currentTime = activeSeg.segment[1] + 0.1;
        hideSponsorBtn();
      };
      if (!btn.isConnected) {
        player.appendChild(btn);
        requestAnimationFrame(() => btn.classList.add("on"));
      }
    } else {
      hideSponsorBtn();
    }
  }, 400);

  // ---- instant first paint: reuse the last settings synchronously (no flash of plain YouTube while storage loads) ----
  try { const c = JSON.parse(localStorage.getItem("ytg_s") || "null"); if (c) { s = { ...YTG.DEFAULTS, ...c }; apply(); } } catch (e) {}

  // ---- Load + live updates ----
  chrome.storage.local.get({ ...YTG.DEFAULTS, bgImage: "" }, v => {
    img = v.bgImage; delete v.bgImage;
    s = { ...YTG.DEFAULTS, ...v };
    apply();
  });
  chrome.storage.onChanged.addListener((ch, area) => {
    if (area !== "local") return;
    for (const [k, c] of Object.entries(ch)) {
      if (k === "bgImage") img = c.newValue || "";
      else s[k] = c.newValue === undefined ? YTG.DEFAULTS[k] : c.newValue;
    }
    apply();
  });
  dark.addEventListener("change", apply);
})();
