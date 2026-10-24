const { DEFAULTS: D, THEMES, ANIMS, vars, stage, resolve } = YTG;
let s = { ...D, bgImage: "" };
const $ = id => document.getElementById(id);
const dq = matchMedia("(prefers-color-scheme: dark)");
const mode = () => (dq.matches ? "dark" : "light");
const setVars = (el, o) => { for (const k in o) el.style.setProperty(k, o[k]); };

const SPEEDS = [
  { v: 0.5, label: "0.5x" },
  { v: 0.8, label: "0.8x" },
  { v: 1.0, label: "1.0x" },
  { v: 1.2, label: "1.2x" },
  { v: 1.5, label: "1.5x" },
  { v: 2.0, label: "2.0x" },
  { v: 2.5, label: "2.5x" },
  { v: 3.0, label: "3.0x" }
];

// ---------- Hidden developer panel (Customize button or Ctrl+Shift+D) ----------
const DEV = {
  Look: [
    ["range", "tint", "Glass fill (0 = crystal clear)", 0, 30, 1, "%"],
    ["range", "blur", "Header & menu blur", 0, 35, 1, "px"],
    ["range", "popAlpha", "Popup & menu fill (lower = clearer)", 0, 80, 1, "%"],
    ["range", "wallDim", "Wallpaper dim level", 0, 85, 1, "%"],
    ["range", "wallOpacity", "Wallpaper strength", 10, 100, 1, "%"],
    ["switch", "titleBack", "Soft backing behind video title"],
    ["switch", "shimmer", "Gold title shimmer animation"],
    ["range", "shimmerSpeed", "Title shimmer speed", 0.3, 3, 0.1, "x"],
    ["gold"]
  ],
  Transparent: [
    ["pills", "transPreset", "Quick Glass Preset", [["normal", "Normal"], ["high", "High Clear"], ["ultra", "Ultra Clear"]]],
    ["range", "tint", "Glass surface tint", 0, 30, 1, "%"],
    ["range", "blur", "Surface backdrop blur", 0, 35, 1, "px"],
    ["range", "popAlpha", "Popup menu transparency", 0, 80, 1, "%"],
    ["range", "menuAlpha", "Player controls transparency", 0, 80, 1, "%"],
    ["range", "wallDim", "Scenic dimming strength", 0, 85, 1, "%"]
  ],
  Animation: [
    ["range", "speed", "Animation speed", 0.2, 4, 0.1, "x"],
    ["range", "driftSpeed", "Wallpaper drift speed", 0.2, 4, 0.1, "x"],
    ["switch", "drift", "Slow wallpaper drift"],
    ["range", "zoomSpeed", "Photo zoom speed", 0.2, 4, 0.1, "x"],
    ["range", "imgBlur", "Photo blur", 0, 30, 1, "px"],
    ["switch", "imgMotion", "Slow zoom on photo"],
    ["switch", "pauseScroll", "Pause motion while scrolling"]
  ],
  Player: [
    ["range", "ambientAmt", "Ambient light strength", 0, 100, 1, "%"],
    ["range", "menuAlpha", "Player menu colour (lower = clearer)", 0, 90, 1, "%"],
    ["switch", "ambient", "Ambient light behind video"],
    ["switch", "fsAmbient", "Ambient light in fullscreen"],
    ["switch", "glow", "Use video colours (else theme)"],
    ["pills", "iconMode", "Player icons", [["video", "Video"], ["gold", "Gold"], ["white", "White"]]],
    ["switch", "cursor", "Themed luxury cursor"],
    ["pills", "cursorColor", "Cursor colour", [["gold", "Gold"], ["theme", "Theme"]]]
  ],
  Ads: [
    ["switch", "ads", "Block ads (master toggle)"],
    ["switch", "adHide", "Hide ad slots in feeds"],
    ["switch", "adSkip", "Auto-click Skip instantly"],
    ["switch", "adFast", "Speed up video ads"],
    ["switch", "adInstant", "Jump straight to end of ads"],
    ["range", "adSpeed", "Ad playback speed multiplier", 1, 16, 1, "x"],
    ["switch", "adMute", "Mute video ads automatically"]
  ],
  Extras: [
    ["switch", "hideShorts", "Hide Shorts shelf"],
    ["switch", "hideComments", "Hide comments section"],
    ["switch", "simple", "Simple mode (promos, end cards)"],
    ["switch", "focus", "Focus mode (video only)"]
  ]
};
let tab = "Look";

function renderDev() {
  $("tabs").innerHTML = Object.keys(DEV).map(t => `<button class="tab${t === tab ? " on" : ""}" data-t="${t}">${t}</button>`).join("");
  $("devBody").innerHTML = DEV[tab].map(it => {
    const [type, k, label, a, b, step, unit] = it;
    if (type === "range") return `<div class="range"><span>${label}</span><b data-for="${k}" data-unit="${unit}"></b><input type="range" data-k="${k}" min="${a}" max="${b}" step="${step}"></div>`;
    if (type === "switch") return `<label class="row"><span>${label}</span><span class="sw"><input type="checkbox" data-k="${k}"><i></i></span></label>`;
    if (type === "pills") return `<div class="full"><div class="lbl2">${label}</div><div class="pills">${a.map(([v, n]) => `<button class="pill" data-k="${k}" data-v="${v}">${n}</button>`).join("")}</div></div>`;
    if (type === "gold") return `<div class="full"><div class="lbl2">Title gold</div><div class="gold" id="goldRow">` +
      [["#d4af37", "Royal"], ["#c9a227", "Deep"], ["#e6cf94", "Champagne"], ["#c9a46c", "Rose gold"]].map(([c, n]) => `<button class="g" data-c="${c}" style="--c:${c}" title="${n}"></button>`).join("") +
      `<input type="color" id="goldPick" title="Custom gold"></div></div>`;
  }).join("");
  paintControls();
}

function paintControls() {
  document.querySelectorAll("[data-k]").forEach(el => {
    const k = el.dataset.k;
    if (el.type === "checkbox") el.checked = !!s[k];
    else if (el.type === "range") { el.value = s[k]; const b = document.querySelector(`b[data-for="${k}"]`); if (b) b.textContent = s[k] + b.dataset.unit; }
    else if (el.dataset.v) {
      if (k === "transPreset") {
        const p = YTG.TRANSPARENT_MODES && YTG.TRANSPARENT_MODES[el.dataset.v];
        el.classList.toggle("on", p && Math.abs(p.tint - s.tint) <= 4);
      } else {
        el.classList.toggle("on", s[k] === el.dataset.v);
      }
    }
  });
  document.querySelectorAll("#goldRow .g").forEach(b => b.classList.toggle("on", b.dataset.c === s.gold));
  if ($("goldPick")) $("goldPick").value = s.gold;
}

// ---------- Themes horizontal track: mini live previews ----------
function tile(cls, html) {
  const b = document.createElement("button");
  b.className = "tc " + cls; b.innerHTML = html; return b;
}
let lastImg = null;
function buildGrid() {
  const grid = $("grid"); if (!grid) return;
  grid.innerHTML = "";
  const m = mode();
  for (const id in THEMES) {
    const b = tile("theme", `<div class="ytg-stage"></div><span class="lbl">${THEMES[id].name}</span>`);
    b.dataset.id = id;
    const ts = { ...D, theme: id, wall: "auto", anim: "auto" };
    setVars(b, vars(ts, m));
    stage(b.firstChild, ts, m, "");
    b.addEventListener("click", () => {
      save({ theme: id, wall: "auto" });
      b.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setTimeout(updateCarouselArrows, 300);
    });
    grid.appendChild(b);
  }
  const up = tile("add", `<span><b>+</b>Photo</span>`);
  up.addEventListener("click", () => $("file").click());
  grid.appendChild(up);
  if (s.bgImage) {
    const mine = tile("mine", `<span class="lbl">Your photo</span>`);
    mine.dataset.id = "image";
    mine.style.background = `center/cover url("${s.bgImage}")`;
    mine.addEventListener("click", () => {
      save({ wall: "image" });
      mine.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setTimeout(updateCarouselArrows, 300);
    });
    grid.appendChild(mine);
  } else {
    const none = tile("clear", `<span class="lbl">None</span>`);
    none.dataset.id = "none";
    none.addEventListener("click", () => {
      save({ wall: "none" });
      none.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setTimeout(updateCarouselArrows, 300);
    });
    grid.appendChild(none);
  }
  setTimeout(updateCarouselArrows, 60);
}

function flashText(text) {
  const f = $("flash");
  const df = $("devFlash");
  [f, df].forEach(el => {
    if (!el || !text) return;
    el.textContent = text;
    el.classList.remove("on");
    void el.offsetWidth;
    el.classList.add("on");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("on"), 1200);
  });
}

// ---------- Horizontal controls for Animation (with live preview) and Speed ----------
function buildMotionWheel() {
  const list = $("pills"); if (!list) return;
  list.innerHTML = "";
  for (const a of ANIMS) {
    const b = document.createElement("button");
    b.className = "wheel-item anim-card";
    b.dataset.id = a.id;
    b.title = a.name;
    b.innerHTML = `
      <div class="ytg-stage" data-anim="${a.id}" data-wall="0" data-drift="0">
        <div class="wall"></div><div class="img"></div><div class="dim"></div><div class="a1"></div><div class="a2"></div>
      </div>
      <span class="lbl">${a.name}</span>
    `;
    b.addEventListener("click", () => {
      save({ anim: a.id });
      flashText(a.name);
    });
    list.appendChild(b);
  }
}

function buildSpeedWheel() {
  const list = $("speedList"); if (!list) return;
  list.innerHTML = "";
  for (let i = 0; i < SPEEDS.length; i++) {
    const sp = SPEEDS[i];
    const b = document.createElement("button");
    b.className = "wheel-item speed-wheel-item";
    b.dataset.speed = String(sp.v);
    b.dataset.index = i;
    b.textContent = sp.label;
    b.addEventListener("click", () => {
      save({ speed: sp.v });
      b.scrollIntoView({ behavior: "smooth", block: "center" });
      updateSpeedArrows();
    });
    list.appendChild(b);
  }
}

function updateSpeedArrows() {
  const up = $("speedUp"), down = $("speedDown");
  if (!up || !down) return;
  const cur = parseFloat(s.speed || 1);
  const idx = SPEEDS.findIndex(sp => Math.abs(sp.v - cur) < 0.15);
  // When at top (first speed), hide upper arrow
  if (idx <= 0) {
    up.classList.add("hidden");
  } else {
    up.classList.remove("hidden");
  }
  // When at bottom (last speed), hide lower arrow
  if (idx >= SPEEDS.length - 1 || idx === -1) {
    down.classList.add("hidden");
  } else {
    down.classList.remove("hidden");
  }
}

function initSpeedArrows() {
  const up = $("speedUp"), down = $("speedDown"), track = $("speedList");
  if (!track) return;
  if (up) {
    up.addEventListener("click", () => {
      const cur = parseFloat(s.speed || 1);
      const idx = SPEEDS.findIndex(sp => Math.abs(sp.v - cur) < 0.15);
      if (idx > 0) {
        save({ speed: SPEEDS[idx - 1].v });
        const target = track.children[idx - 1];
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        updateSpeedArrows();
      }
    });
  }
  if (down) {
    down.addEventListener("click", () => {
      const cur = parseFloat(s.speed || 1);
      const idx = SPEEDS.findIndex(sp => Math.abs(sp.v - cur) < 0.15);
      if (idx < SPEEDS.length - 1) {
        save({ speed: SPEEDS[idx + 1].v });
        const target = track.children[idx + 1];
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        updateSpeedArrows();
      }
    });
  }
  updateSpeedArrows();
}

function updateCarouselArrows() {
  const prev = $("themePrev"), next = $("themeNext"), track = $("grid");
  if (!track || !prev || !next) return;
  const sl = track.scrollLeft;
  const max = track.scrollWidth - track.clientWidth;
  
  // When at start (first theme displayed), hide backward arrow
  if (sl <= 6) {
    prev.classList.add("hidden");
  } else {
    prev.classList.remove("hidden");
  }
  
  // When at end (last theme displayed), hide forward arrow
  if (sl >= max - 6) {
    next.classList.add("hidden");
  } else {
    next.classList.remove("hidden");
  }
}

function initCarouselArrows() {
  const prev = $("themePrev"), next = $("themeNext"), track = $("grid");
  if (!track) return;
  if (prev) {
    prev.addEventListener("click", () => {
      track.scrollBy({ left: -200, behavior: "smooth" });
      setTimeout(updateCarouselArrows, 200);
      setTimeout(updateCarouselArrows, 450);
    });
  }
  if (next) {
    next.addEventListener("click", () => {
      track.scrollBy({ left: 200, behavior: "smooth" });
      setTimeout(updateCarouselArrows, 200);
      setTimeout(updateCarouselArrows, 450);
    });
  }
  track.addEventListener("scroll", updateCarouselArrows, { passive: true });
}

// ---------- Paint ----------
function paint() {
  const m = mode();
  if ($("pv")) {
    setVars($("pv"), vars(s, m));
    $("pv").dataset.shimmer = s.shimmer ? "1" : "0";
    if ($("stage")) stage($("stage"), s, m, s.bgImage);
  }
  if ($("devPv")) {
    setVars($("devPv"), vars(s, m));
    $("devPv").dataset.shimmer = s.shimmer ? "1" : "0";
    if ($("devStage")) stage($("devStage"), s, m, s.bgImage);
  }
  setVars(document.body, vars(s, "dark"));
  if ($("bg")) stage($("bg"), { ...s, anim: "off", drift: false }, "dark", s.bgImage);

  if (lastImg !== s.bgImage) { lastImg = s.bgImage; buildGrid(); }

  // Highlight active theme in the horizontal track
  document.querySelectorAll(".dqp-btn").forEach(b => {
    const k = b.dataset.mode;
    const p = YTG.TRANSPARENT_MODES && YTG.TRANSPARENT_MODES[k];
    b.classList.toggle("active", p && Math.abs(p.tint - s.tint) <= 4);
  });
  document.querySelectorAll("#grid .tc.theme").forEach(b => {
    const isActive = b.dataset.id === s.theme && s.wall !== "image" && s.wall !== "none";
    b.classList.toggle("on", isActive);
  });
  document.querySelectorAll("#grid .tc.mine, #grid .tc.clear").forEach(b => b.classList.toggle("on", b.dataset.id === s.wall));

  // Highlight active animation item and set preview vars
  document.querySelectorAll("#pills .wheel-item").forEach(b => {
    const isActive = b.dataset.id === s.anim;
    b.classList.toggle("on", isActive);
    const st = b.querySelector(".ytg-stage");
    if (st) setVars(st, vars(s, m));
  });

  // Highlight active speed wheel item and scroll into center
  const currentSpeed = parseFloat(s.speed || 1);
  document.querySelectorAll("#speedList .wheel-item").forEach(b => {
    const sv = parseFloat(b.dataset.speed);
    const isActive = Math.abs(sv - currentSpeed) < 0.15;
    b.classList.toggle("on", isActive);
    if (isActive && !paint._speedScrolled) {
      paint._speedScrolled = true;
      setTimeout(() => b.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  });

  const r = resolve(s), an = ANIMS.find(a => a.id === r.anim);
  const nm = (YTG.THEMES[s.theme] || THEMES.gold).name;
  const animNm = an ? an.name : (r.name || r.anim);

  if (paint.lastTheme !== undefined && paint.lastTheme !== s.theme) {
    flashText(nm);
  } else if (paint.lastAnim !== undefined && paint.lastAnim !== s.anim) {
    flashText(animNm);
  }
  paint.lastTheme = s.theme;
  paint.lastAnim = s.anim;

  if ($("curName")) $("curName").textContent = nm;
  if ($("curAnim")) $("curAnim").textContent = "• " + animNm;
  if ($("devCurName")) $("devCurName").textContent = nm;
  if ($("devCurAnim")) $("devCurAnim").textContent = "• " + animNm;
  paintControls();
  updateCarouselArrows();
  updateSpeedArrows();

  if (!paint._themeScrolled) {
    const activeThemeCard = document.querySelector("#grid .tc.on");
    if (activeThemeCard) {
      paint._themeScrolled = true;
      setTimeout(() => {
        activeThemeCard.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        updateCarouselArrows();
      }, 120);
    }
  }
}

// ---------- Save ----------
let pending = {}, timer = 0;
function save(patch, slow) {
  Object.assign(s, patch);
  paint();
  if (!slow) { chrome.storage.local.set(patch); return; }
  Object.assign(pending, patch);
  clearTimeout(timer);
  timer = setTimeout(() => { chrome.storage.local.set(pending); pending = {}; }, 80);
}

// ---------- Wire controls ----------
document.addEventListener("input", e => {
  const el = e.target, k = el.dataset && el.dataset.k;
  if (el.id === "goldPick") return save({ gold: el.value }, true);
  if (!k) return;
  if (el.type === "range") save({ [k]: parseFloat(el.value) }, true);
});
document.addEventListener("change", e => {
  const el = e.target, k = el.dataset && el.dataset.k;
  if (k && el.type === "checkbox") save({ [k]: el.checked });
});
document.addEventListener("click", e => {
  const dqp = e.target.closest(".dqp-btn");
  if (dqp) {
    const modeKey = dqp.dataset.mode;
    const preset = YTG.TRANSPARENT_MODES && YTG.TRANSPARENT_MODES[modeKey];
    if (preset) {
      save({
        tint: preset.tint,
        blur: preset.blur,
        wallDim: preset.wallDim,
        popAlpha: preset.popAlpha
      });
      flashText(preset.name);
    }
    return;
  }
  const el = e.target.closest("button");
  if (!el) return;
  if (el.dataset.k === "transPreset" && el.dataset.v) {
    const preset = YTG.TRANSPARENT_MODES && YTG.TRANSPARENT_MODES[el.dataset.v];
    if (preset) {
      save({
        tint: preset.tint,
        blur: preset.blur,
        wallDim: preset.wallDim,
        popAlpha: preset.popAlpha
      });
      flashText(preset.name);
    }
    return;
  }
  if (el.dataset.k && el.dataset.v) save({ [el.dataset.k]: el.dataset.v });
  else if (el.classList.contains("g")) save({ gold: el.dataset.c });
  else if (el.classList.contains("tab")) { tab = el.dataset.t; renderDev(); }
});
if ($("reset")) $("reset").addEventListener("click", () => save({ ...D }));

// ---------- Developer panel entrance ----------
function toggleDev(force) {
  const show = force !== undefined ? force : $("viewDev").hidden;
  $("viewDev").hidden = !show; $("viewGallery").hidden = show;
  if (show) {
    renderDev();
    paint();
  }
  document.body.classList.toggle("dev", show); $("devbtn").hidden = show;
  const t = $("toast"); if (t) { t.textContent = show ? "Customize" : ""; t.classList.toggle("on", show); }
}
let clicks = 0, clickTimer = 0;
$("logo").addEventListener("click", () => {
  clicks++; clearTimeout(clickTimer); clickTimer = setTimeout(() => (clicks = 0), 2000);
  if (clicks >= 5) { clicks = 0; toggleDev(); }
});
document.addEventListener("keydown", e => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") toggleDev(); });
$("devbtn").addEventListener("click", () => toggleDev(true));
$("exitDev").addEventListener("click", () => toggleDev(false));

// ---------- Photo upload ----------
function toDataUrl(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = rej;
    fr.onload = () => {
      if (file.type === "image/gif") return res(fr.result);
      const im = new Image();
      im.onerror = rej;
      im.onload = () => {
        const k = Math.min(1, 1920 / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.85));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
$("file").addEventListener("change", async e => {
  const f = e.target.files[0]; e.target.value = "";
  $("msg").textContent = "";
  if (!f) return;
  if (!f.type.startsWith("image/")) { $("msg").textContent = "Please choose an image file."; return; }
  if (f.size > 20 * 1024 * 1024) { $("msg").textContent = "Image too large (max 20 MB)."; return; }
  try {
    const url = await toDataUrl(f);
    s.bgImage = url;
    await chrome.storage.local.set({ bgImage: url, wall: "image" });
    save({ wall: "image" });
  } catch { $("msg").textContent = "Could not load that image."; }
});

// ---------- Mouse scroll wheel support: select one by one ----------
function initWheelNavigation() {
  const themeSection = document.querySelector(".themes-section-wide");
  const animSection = document.querySelector(".anim-col-wide");
  const speedSection = document.querySelector(".speed-col-vertical");

  let themeWheelCooldown = 0;
  if (themeSection) {
    themeSection.addEventListener("wheel", e => {
      e.preventDefault();
      const now = Date.now();
      if (now - themeWheelCooldown < 140) return;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 4) return;
      themeWheelCooldown = now;

      const themeKeys = Object.keys(THEMES);
      const curIdx = themeKeys.indexOf(s.theme);
      const dir = delta > 0 ? 1 : -1;
      let nextIdx = curIdx + dir;
      if (nextIdx < 0) nextIdx = 0;
      if (nextIdx >= themeKeys.length) nextIdx = themeKeys.length - 1;

      if (nextIdx !== curIdx) {
        const nextTheme = themeKeys[nextIdx];
        save({ theme: nextTheme, wall: "auto" });
        const targetBtn = document.querySelector(`#grid .tc.theme[data-id="${nextTheme}"]`);
        if (targetBtn) {
          targetBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
        setTimeout(updateCarouselArrows, 320);
      }
    }, { passive: false });
  }

  let animWheelCooldown = 0;
  if (animSection) {
    animSection.addEventListener("wheel", e => {
      e.preventDefault();
      const now = Date.now();
      if (now - animWheelCooldown < 140) return;
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 4) return;
      animWheelCooldown = now;

      const curAnimId = resolve(s).anim;
      let curIdx = ANIMS.findIndex(a => a.id === s.anim || a.id === curAnimId);
      if (curIdx === -1) curIdx = 0;
      const dir = delta > 0 ? 1 : -1;
      let nextIdx = curIdx + dir;
      if (nextIdx < 0) nextIdx = 0;
      if (nextIdx >= ANIMS.length) nextIdx = ANIMS.length - 1;

      if (nextIdx !== curIdx) {
        const nextAnim = ANIMS[nextIdx];
        save({ anim: nextAnim.id });
        flashText(nextAnim.name);
      }
    }, { passive: false });
  }

  let speedWheelCooldown = 0;
  if (speedSection) {
    speedSection.addEventListener("wheel", e => {
      e.preventDefault();
      const now = Date.now();
      if (now - speedWheelCooldown < 140) return;
      if (Math.abs(e.deltaY) < 4) return;
      speedWheelCooldown = now;

      const cur = parseFloat(s.speed || 1);
      let curIdx = SPEEDS.findIndex(sp => Math.abs(sp.v - cur) < 0.15);
      if (curIdx === -1) curIdx = 2; // 1.0x default
      const dir = e.deltaY > 0 ? 1 : -1;
      let nextIdx = curIdx + dir;
      if (nextIdx < 0) nextIdx = 0;
      if (nextIdx >= SPEEDS.length) nextIdx = SPEEDS.length - 1;

      if (nextIdx !== curIdx) {
        save({ speed: SPEEDS[nextIdx].v });
        const track = $("speedList");
        if (track && track.children[nextIdx]) {
          track.children[nextIdx].scrollIntoView({ behavior: "smooth", block: "center" });
        }
        updateSpeedArrows();
      }
    }, { passive: false });
  }
}

// ---------- Init ----------
buildMotionWheel();
buildSpeedWheel();
initCarouselArrows();
initSpeedArrows();
initWheelNavigation();

function openFullscreenTab() {
  const isDevOpen = $("viewDev") && !$("viewDev").hidden;
  const url = chrome.runtime.getURL(`popup.html?fullscreen=1${isDevOpen ? "&view=dev" : ""}`);
  chrome.tabs.create({ url });
}
if ($("fullTabBtn")) $("fullTabBtn").addEventListener("click", openFullscreenTab);
if ($("devFullTabBtn")) $("devFullTabBtn").addEventListener("click", openFullscreenTab);

// Detect fullscreen tab mode
if (window.innerWidth > 800 || window.innerHeight > 600 || window.location.search.includes("fullscreen")) {
  document.body.classList.add("is-fullscreen");
  if ($("fullTabBtn")) $("fullTabBtn").style.display = "none";
  if ($("devFullTabBtn")) $("devFullTabBtn").style.display = "none";
}

// Auto open dev customize if requested in URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("view") === "dev") {
  toggleDev(true);
}

chrome.storage.local.get({ ...D, bgImage: "" }, v => { s = { ...D, ...v }; paint(); });
dq.addEventListener("change", () => { lastImg = null; paint(); });

