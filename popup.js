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

// ---------- Themes horizontal track: mini live previews ----------
function tile(cls, html) {
  const b = document.createElement("button");
  b.className = "tc " + cls;
  b.innerHTML = html;
  return b;
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
      setTimeout(updateCarouselArrows, 280);
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
      setTimeout(updateCarouselArrows, 280);
    });
    grid.appendChild(mine);
  } else {
    const none = tile("clear", `<span class="lbl">None</span>`);
    none.dataset.id = "none";
    none.addEventListener("click", () => {
      save({ wall: "none" });
      none.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setTimeout(updateCarouselArrows, 280);
    });
    grid.appendChild(none);
  }
  setTimeout(updateCarouselArrows, 60);
}

// Pop-in and pop-out center badge animation
function flashText(text) {
  const f = $("flash");
  if (!f || !text) return;
  f.textContent = text;
  f.classList.remove("on");
  void f.offsetWidth;
  f.classList.add("on");
  clearTimeout(f._t);
  f._t = setTimeout(() => f.classList.remove("on"), 1250);
}

// ---------- Animations and Speed Wheels ----------
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
  if (idx <= 0) up.classList.add("hidden");
  else up.classList.remove("hidden");
  if (idx >= SPEEDS.length - 1 || idx === -1) down.classList.add("hidden");
  else down.classList.remove("hidden");
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
      if (idx < SPEEDS.length - 1 && idx !== -1) {
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
  if (sl <= 6) prev.classList.add("hidden");
  else prev.classList.remove("hidden");
  if (sl >= max - 6) next.classList.add("hidden");
  else next.classList.remove("hidden");
}

function initCarouselArrows() {
  const prev = $("themePrev"), next = $("themeNext"), track = $("grid");
  if (!track) return;
  if (prev) {
    prev.addEventListener("click", () => {
      track.scrollBy({ left: -140, behavior: "smooth" });
      setTimeout(updateCarouselArrows, 200);
      setTimeout(updateCarouselArrows, 400);
    });
  }
  if (next) {
    next.addEventListener("click", () => {
      track.scrollBy({ left: 140, behavior: "smooth" });
      setTimeout(updateCarouselArrows, 200);
      setTimeout(updateCarouselArrows, 400);
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
  setVars(document.body, vars(s, "dark"));
  if ($("bg")) stage($("bg"), { ...s, anim: "off", drift: false }, "dark", s.bgImage);

  if (lastImg !== s.bgImage) { lastImg = s.bgImage; buildGrid(); }

  // Highlight active theme in the horizontal track with gold glowing border
  document.querySelectorAll("#grid .tc.theme").forEach(b => {
    const isActive = b.dataset.id === s.theme && s.wall !== "image" && s.wall !== "none";
    b.classList.toggle("on", isActive);
  });
  document.querySelectorAll("#grid .tc.mine, #grid .tc.clear").forEach(b => b.classList.toggle("on", b.dataset.id === s.wall));

  // Highlight active animation item with gold border and gold text
  document.querySelectorAll("#pills .wheel-item").forEach(b => {
    const isActive = b.dataset.id === s.anim;
    b.classList.toggle("on", isActive);
    const st = b.querySelector(".ytg-stage");
    if (st) setVars(st, vars(s, m));
  });

  // Highlight active speed wheel item
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

  // Trigger smooth pop-in and pop-out badge in the center
  if (paint.lastTheme !== undefined && paint.lastTheme !== s.theme) {
    flashText(nm);
  } else if (paint.lastAnim !== undefined && paint.lastAnim !== s.anim) {
    flashText(animNm);
  }
  paint.lastTheme = s.theme;
  paint.lastAnim = s.anim;

  if ($("curName")) $("curName").textContent = nm;
  if ($("curAnim")) $("curAnim").textContent = "• " + animNm;

  // Master switch status
  const sw = document.querySelector('input[data-k="enabled"]');
  if (sw) sw.checked = !!s.enabled;

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
  if (!slow) {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(patch);
    }
    return;
  }
  Object.assign(pending, patch);
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(pending);
    }
    pending = {};
  }, 80);
}

// Master enable checkbox
document.addEventListener("change", e => {
  const el = e.target, k = el.dataset && el.dataset.k;
  if (k && el.type === "checkbox") save({ [k]: el.checked });
});

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
if ($("file")) {
  $("file").addEventListener("change", async e => {
    const f = e.target.files[0]; e.target.value = "";
    if ($("msg")) $("msg").textContent = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) { if ($("msg")) $("msg").textContent = "Please choose an image file."; return; }
    if (f.size > 20 * 1024 * 1024) { if ($("msg")) $("msg").textContent = "Image too large (max 20 MB)."; return; }
    try {
      const url = await toDataUrl(f);
      s.bgImage = url;
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ bgImage: url, wall: "image" });
      }
      save({ wall: "image" });
    } catch { if ($("msg")) $("msg").textContent = "Could not load that image."; }
  });
}

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
        setTimeout(updateCarouselArrows, 280);
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

if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
  chrome.storage.local.get({ ...D, bgImage: "" }, v => { s = { ...D, ...v }; paint(); });
} else {
  paint();
}
dq.addEventListener("change", () => { lastImg = null; paint(); });
