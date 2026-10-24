/* Shared by the page (content script) and the popup, so the preview always matches. */
(function (g) {
  const DEFAULTS = {
    enabled: true, ads: true, adSkip: true, adFast: false, adSpeed: 1, adMute: false, adInstant: false, adHide: true, fsAmbient: true, adaptive: true, popAlpha: 30, titleBack: true, theme: "gold", gold: "#d4af37",
    wall: "auto",          // "auto" = the theme's wallpaper | "none" | "image"
    anim: "auto",          // "auto" = the theme's animation | off | aurora | flow | stars | fireflies | pulse
    speed: 1,            // animation speed
    drift: true, driftSpeed: 1,   // slow colour movement of the wallpaper itself (all themes)
    wallDim: 48, wallOpacity: 100,
    tint: 3, blur: 14,     // glass fill (0 = fully clear) / header + menu blur
    imgBlur: 0, imgMotion: false, zoomSpeed: 1,
    shimmer: true, shimmerSpeed: 1,           // slow gold shimmer on the title you are watching / hovering
    glow: false, iconMode: "video",           // progress bar + player icons: video | gold | white
    ambient: true, ambientAmt: 45,           // soft light behind the video, from the video's colours
    menuAlpha: 42,                           // player menus: how much colour (lower = more see-through)
    cursor: true, cursorColor: "theme",
    hideShorts: false, hideComments: false, simple: true, focus: false,
    pauseScroll: true
  };

  // 12 handcrafted royal themes (Gold Glass 2.0).
  const THEMES = {
    gold:     { name: "Royal Gold", tag: "Warm & Premium", anim: "fireflies", animName: "Firefly", mul: 1,
      dark:  { a: "#F4C542", b: "#E8C878", bg1: "#171006", bg2: "#76551A" },
      light: { a: "#b38600", b: "#d99b1c", bg1: "#fff8e1", bg2: "#f7e3a6" } },
    noir:     { name: "Noir Gold",  tag: "Dark & Classy",  anim: "embers", animName: "Embers", mul: 1,
      dark:  { a: "#FFD700", b: "#C9973A", bg1: "#0A0704", bg2: "#261A08" },
      light: { a: "#8a6a12", b: "#c9a227", bg1: "#faf6ea", bg2: "#efe3bd" } },
    sapphire: { name: "Sapphire",   tag: "Cool & Modern",  anim: "aurora", animName: "Aurora", mul: 1,
      dark:  { a: "#60A5FA", b: "#818CF8", bg1: "#06153D", bg2: "#12338A" },
      light: { a: "#2563eb", b: "#4f46e5", bg1: "#eff6ff", bg2: "#dbeafe" } },
    amethyst: { name: "Amethyst",   tag: "Purple Aesthetic", anim: "stars", animName: "Stars", mul: 1,
      dark:  { a: "#C084FC", b: "#F472B6", bg1: "#1C0B45", bg2: "#4C1D95" },
      light: { a: "#9333ea", b: "#c026d3", bg1: "#faf5ff", bg2: "#f3e8ff" } },
    emerald:  { name: "Emerald",    tag: "Natural & Calm", anim: "fireflies", animName: "Firefly", mul: 1,
      dark:  { a: "#34D399", b: "#2DD4BF", bg1: "#03261A", bg2: "#065F46" },
      light: { a: "#059669", b: "#0d9488", bg1: "#ecfdf5", bg2: "#d1fae5" } },
    silver:   { name: "Arctic Silver", tag: "Frosted Luxury", anim: "stars", animName: "Stars", mul: 1,
      dark:  { a: "#E2E8F0", b: "#94A3B8", bg1: "#141822", bg2: "#374151" },
      light: { a: "#475569", b: "#64748b", bg1: "#f8fafc", bg2: "#e2e8f0" } },
    crimson:  { name: "Crimson",    tag: "Ruby Velvet",    anim: "flow", animName: "Waver", mul: 1,
      dark:  { a: "#fb7185", b: "#f97316", bg1: "#3d0718", bg2: "#881337" },
      light: { a: "#e11d48", b: "#ea580c", bg1: "#fff1f2", bg2: "#ffe4e6" } },
    northern: { name: "Northern",   tag: "Boreal Glow",    anim: "aurora", animName: "Aurora", mul: 1,
      dark:  { a: "#2dd4bf", b: "#a78bfa", bg1: "#04232c", bg2: "#0e4b55" },
      light: { a: "#0d9488", b: "#7c3aed", bg1: "#f0fdfa", bg2: "#ccfbf1" } },
    sunset:   { name: "Sunset",     tag: "Dusk Horizon",   anim: "embers", animName: "Embers", mul: 1,
      dark:  { a: "#fb923c", b: "#f43f5e", bg1: "#220c38", bg2: "#701a4f" },
      light: { a: "#ea580c", b: "#e11d48", bg1: "#fff7ed", bg2: "#ffedd5" } },
    deepsea:  { name: "Deep Sea",   tag: "Ocean Drift",    anim: "flow", animName: "Waver", mul: 1,
      dark:  { a: "#38bdf8", b: "#2dd4bf", bg1: "#032d42", bg2: "#075985" },
      light: { a: "#0284c7", b: "#0d9488", bg1: "#f0f9ff", bg2: "#e0f2fe" } },
    rose:     { name: "Rose Quartz", tag: "Sakura Velvet", anim: "flow", animName: "Waver", mul: 1,
      dark:  { a: "#f472b6", b: "#fb7185", bg1: "#380c25", bg2: "#831843" },
      light: { a: "#db2777", b: "#e11d48", bg1: "#fdf2f8", bg2: "#fce7f3" } },
    galaxy:   { name: "Galaxy",     tag: "Nebula Cosmos",  anim: "stars", animName: "Stars", mul: 1,
      dark:  { a: "#a855f7", b: "#ec4899", bg1: "#140938", bg2: "#3b0764" },
      light: { a: "#7e22ce", b: "#be185d", bg1: "#faf5ff", bg2: "#f3e8ff" } }
  };

  // Multi-hue wallpapers (pure CSS gradients: no downloads, painted once; they drift slowly via GPU transform).
  const WALLS = {
    noir:     "radial-gradient(50% 45% at 20% 20%,rgba(240,200,110,.30),transparent 65%),radial-gradient(45% 40% at 82% 80%,rgba(201,151,58,.28),transparent 65%),radial-gradient(35% 30% at 70% 25%,rgba(255,236,170,.12),transparent 70%),linear-gradient(150deg,#0d0a06 0%,#241a0b 50%,#3d2c10 100%)",
    gold:     "radial-gradient(55% 45% at 18% 18%,rgba(255,226,150,.50),transparent 65%),radial-gradient(50% 45% at 85% 78%,rgba(214,130,60,.45),transparent 65%),radial-gradient(40% 35% at 72% 22%,rgba(255,248,210,.22),transparent 70%),linear-gradient(150deg,#3a2a0a 0%,#7a5718 45%,#a87a26 100%)",
    sapphire: "radial-gradient(55% 45% at 18% 15%,rgba(90,170,255,.55),transparent 65%),radial-gradient(55% 45% at 85% 80%,rgba(160,100,255,.45),transparent 65%),radial-gradient(40% 35% at 70% 22%,rgba(80,230,255,.26),transparent 70%),linear-gradient(150deg,#0d2a73 0%,#1a3fa6 45%,#3a2fa0 100%)",
    amethyst: "radial-gradient(55% 45% at 22% 18%,rgba(210,130,255,.55),transparent 65%),radial-gradient(55% 45% at 82% 82%,rgba(255,110,190,.40),transparent 65%),radial-gradient(40% 35% at 72% 22%,rgba(120,150,255,.30),transparent 70%),linear-gradient(150deg,#2a1470 0%,#5a2bb5 50%,#8a3fa8 100%)",
    emerald:  "radial-gradient(55% 45% at 20% 18%,rgba(90,240,170,.45),transparent 65%),radial-gradient(55% 45% at 84% 80%,rgba(80,220,230,.40),transparent 65%),radial-gradient(40% 35% at 70% 22%,rgba(190,255,120,.22),transparent 70%),linear-gradient(150deg,#06402f 0%,#0d7a55 50%,#1a8f8a 100%)",
    crimson:  "radial-gradient(55% 45% at 20% 18%,rgba(255,120,130,.50),transparent 65%),radial-gradient(55% 45% at 84% 80%,rgba(255,150,80,.40),transparent 65%),radial-gradient(40% 35% at 70% 22%,rgba(255,190,200,.22),transparent 70%),linear-gradient(150deg,#5a0f27 0%,#a3213f 50%,#b5482f 100%)",
    silver:   "linear-gradient(115deg,transparent 35%,rgba(255,255,255,.10) 50%,transparent 65%),radial-gradient(55% 45% at 80% 20%,rgba(190,210,255,.30),transparent 65%),radial-gradient(55% 45% at 15% 85%,rgba(170,180,210,.26),transparent 65%),linear-gradient(150deg,#2a3040 0%,#46506a 50%,#5d6a86 100%)",
    northern: "radial-gradient(70% 40% at 28% 28%,rgba(70,255,190,.45),transparent 70%),radial-gradient(65% 38% at 74% 22%,rgba(150,110,255,.46),transparent 70%),radial-gradient(50% 40% at 50% 95%,rgba(60,180,255,.30),transparent 70%),linear-gradient(170deg,#052a3a 0%,#0a5a5a 55%,#2a3f8f 100%)",
    sunset:   "radial-gradient(circle at 50% 66%,rgba(255,225,160,.85) 0 5%,rgba(255,150,100,.45) 11%,transparent 32%),radial-gradient(55% 40% at 15% 20%,rgba(150,110,255,.40),transparent 70%),linear-gradient(180deg,#2a1457 0%,#a8325f 55%,#ff8a4c 100%)",
    deepsea:  "radial-gradient(60% 40% at 50% 0%,rgba(110,220,255,.40),transparent 70%),radial-gradient(50% 40% at 82% 88%,rgba(40,220,190,.32),transparent 70%),radial-gradient(45% 35% at 12% 70%,rgba(110,120,255,.22),transparent 70%),linear-gradient(180deg,#05486b 0%,#0a7a9a 60%,#14a3a8 100%)",
    rose:     "radial-gradient(55% 45% at 82% 18%,rgba(255,215,235,.40),transparent 65%),radial-gradient(60% 50% at 15% 82%,rgba(255,120,170,.42),transparent 70%),radial-gradient(40% 35% at 55% 55%,rgba(200,120,255,.22),transparent 70%),linear-gradient(150deg,#5a1b3f 0%,#b83a78 55%,#e0707f 100%)",
    galaxy:   "radial-gradient(ellipse 120% 40% at 50% 50%,rgba(170,130,255,.50),transparent 70%),radial-gradient(40% 30% at 72% 62%,rgba(255,110,210,.38),transparent 70%),radial-gradient(40% 30% at 20% 25%,rgba(90,160,255,.30),transparent 70%),linear-gradient(200deg,#1c1050 0%,#4a1f9a 60%,#a02a8a 100%)"
  };

  const ANIMS = [
    { id: "fireflies", name: "Firefly", desc: "Drifting golden embers" },
    { id: "flow",      name: "Waver",   desc: "Flowing light ribbons" },
    { id: "aurora",    name: "Aurora",  desc: "Sweeping northern lights" },
    { id: "stars",     name: "Stars",   desc: "Twinkling starfield" },
    { id: "embers",    name: "Embers",  desc: "Warm rising sparks" }
  ];

  const TRANSPARENT_MODES = {
    normal: { id: "normal", name: "Normal", desc: "Smooth glass", tint: 15, blur: 14, wallDim: 48, popAlpha: 30 },
    high:   { id: "high",   name: "High Transparency", desc: "See-through", tint: 4, blur: 6, wallDim: 30, popAlpha: 15 },
    ultra:  { id: "ultra",  name: "Ultra Clear", desc: "Almost invisible", tint: 0, blur: 2, wallDim: 15, popAlpha: 8 }
  };

  const WALLPAPERS = [
    { id: "default", name: "Default", sub: "Sunset Alps", wall: "gold", preview: "linear-gradient(135deg, #f59e0b 0%, #ea580c 40%, #1e1b4b 100%)" },
    { id: "nature",  name: "Nature",  sub: "Alpine Valley", wall: "emerald", preview: "linear-gradient(135deg, #10b981 0%, #047857 50%, #064e3b 100%)" },
    { id: "city",    name: "City",    sub: "Sunset Skyline", wall: "sunset", preview: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #1e1b4b 100%)" },
    { id: "space",   name: "Space",   sub: "Cosmic Nebula", wall: "galaxy", preview: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #0f172a 100%)" },
    { id: "ocean",   name: "Ocean",   sub: "Azure Waters", wall: "deepsea", preview: "linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #082f49 100%)" },
    { id: "forest",  name: "Forest",  sub: "Boreal Mist", wall: "northern", preview: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 50%, #042f2e 100%)" }
  ];

  const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
  // shade(hex, +0.4) = 40% towards white, shade(hex, -0.4) = 40% towards black
  function shade(hex, amt) {
    const n = parseInt(hex.replace("#", ""), 16), ch = [n >> 16, (n >> 8) & 255, n & 255];
    return "#" + ch.map(x => clamp(amt >= 0 ? x + (255 - x) * amt : x * (1 + amt)).toString(16).padStart(2, "0")).join("");
  }

  const themeOf = s => THEMES[s.theme] || THEMES.gold;
  const themeId = s => (THEMES[s.theme] ? s.theme : "gold");
  function resolve(s) {
    const id = themeId(s);
    const wall = s.wall === "none" || s.wall === "image" ? s.wall : id;
    const anim = ANIMS.some(a => a.id === s.anim) ? s.anim : themeOf(s).anim;
    return { wall, anim, name: ANIMS.some(a => a.id === s.anim) ? (ANIMS.find(a => a.id === s.anim).name) : (themeOf(s).animName || "") };
  }

  function vars(s, mode) {
    const t = themeOf(s), c = t[mode] || t.dark, dark = mode === "dark", f = s.tint / 100;
    const veil = dark ? s.wallDim / 100 : Math.min(0.9, 0.52 + s.wallDim / 250);
    const a1 = dark ? 0.05 + f * 2.4 : 0.30 + f * 2.2, a2 = dark ? f * 0.8 : 0.12 + f * 1.2;
    // metallic gold: deep -> gold -> pale highlight -> gold -> deep (loops seamlessly for the shimmer)
    const deep = shade(s.gold, dark ? -0.32 : -0.55), mid = dark ? s.gold : shade(s.gold, -0.35), hi = shade(s.gold, dark ? 0.62 : 0.15);
    return {
      "--ytg-a": c.a, "--ytg-a2": c.b, "--ytg-bg1": c.bg1, "--ytg-bg2": c.bg2,
      "--ytg-text": dark ? `color-mix(in srgb, ${c.a} 14%, #f2efe8)` : `color-mix(in srgb, ${c.a} 22%, #1a1814)`,
      "--ytg-sub": dark ? `color-mix(in srgb, ${c.a} 20%, #ece8dc)` : "#625c50",
      "--ytg-star": dark ? "#ffffff" : c.a,
      "--ytg-border": dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)",
      "--ytg-gold": s.gold,
      "--ytg-gold-eff": mid,
      "--ytg-gold-grad": `linear-gradient(100deg,${deep} 0%,${mid} 28%,${hi} 50%,${mid} 72%,${deep} 100%)`,
      "--ytg-icon-gold": shade(s.gold, dark ? 0.3 : -0.2),
      "--ytg-shimmer": (14 / s.shimmerSpeed).toFixed(1) + "s",
      "--ytg-tint": dark ? f : Math.min(0.9, f + 0.25),
      "--ytg-blur": s.blur + "px",
      "--ytg-speed": s.speed * (t.mul || 1), "--ytg-zoom": s.zoomSpeed, "--ytg-dspeed": s.driftSpeed,
      "--ytg-wallo": s.wallOpacity / 100,
      "--ytg-amb": s.ambientAmt, "--ytg-menu-a": s.menuAlpha,
      "--ytg-dimc": dark ? `rgba(0,0,0,${veil})` : `rgba(255,255,255,${veil})`,
      "--ytg-imgblur": s.imgBlur + "px",
      "--ytg-fill": `linear-gradient(145deg,rgba(255,255,255,${Math.min(.9, a1).toFixed(3)}),rgba(255,255,255,${Math.min(.8, a2).toFixed(3)}))`,
      "--ytg-edge": dark ? "rgba(255,255,255,.20)" : "rgba(255,255,255,.95)",
      "--ytg-shine": dark ? "inset 0 1px 0 rgba(255,255,255,.28)" : "inset 0 1px 0 rgba(255,255,255,.9)",
      "--ytg-pop": `color-mix(in srgb, ${c.bg2} ${dark ? s.popAlpha - 6 : s.popAlpha + 10}%, transparent)`,
      "--yt-spec-call-to-action": c.a,
      "--yt-spec-brand-button-background": c.a
    };
  }

  function stage(el, s, mode, img) {
    if (!el.firstChild) {
      el.innerHTML = '<div class="wall"></div><div class="img"></div><div class="dim"></div><div class="a1"></div><div class="a2"></div>';
    }
    const r = resolve(s), wall = el.children[0], im = el.children[1];
    const key = r.wall + "|" + r.anim + "|" + (img ? img.length : 0) + "|" + s.theme;
    const bv = vars(s, mode), cur = { w: (r.wall !== "image" && r.wall !== "none" ? WALLS[r.wall] : ""), a: bv["--ytg-bg1"], b: bv["--ytg-bg2"] };
    const oldAnim = el.dataset.anim;
    const isAnimChange = oldAnim && oldAnim !== r.anim;
    const isThemeChange = el._cur && (el._cur.a !== cur.a || el._cur.b !== cur.b || el._cur.w !== cur.w);

    if (el._key && el._key !== key && !el.closest(".tc") && el.id !== "bg") {
      if (isAnimChange) {
        // Silky smooth crossfade between animations
        let oldA = el.querySelector(".old-anim"); if (oldA) oldA.remove();
        oldA = document.createElement("div");
        oldA.className = "old-anim";
        const a1 = el.querySelector(".a1"), a2 = el.querySelector(".a2");
        if (a1) oldA.appendChild(a1.cloneNode(true));
        if (a2) oldA.appendChild(a2.cloneNode(true));
        oldA.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:3;opacity:1;transition:opacity 0.5s cubic-bezier(.2,.8,.2,1);will-change:opacity;";
        el.appendChild(oldA);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          oldA.style.opacity = "0";
        }));
        setTimeout(() => oldA.remove(), 520);
      }
      if (isThemeChange && el._cur) {
        // Silky smooth crossfade between themes
        let old = el.querySelector(".old"); if (old) old.remove();
        old = document.createElement("div"); old.className = "old";
        const p = el._cur;
        old.style.cssText = `background:${p.w ? p.w + "," : ""}linear-gradient(135deg,${p.a},${p.b});background-size:cover;opacity:1;transition:none;will-change:opacity;z-index:1`;
        el.appendChild(old);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          old.style.transition = "opacity 0.5s cubic-bezier(.2,.8,.2,1)";
          old.style.opacity = "0";
        }));
        setTimeout(() => old.remove(), 520);
      }
    }
    el._cur = cur;
    el._key = key;
    const useImg = r.wall === "image" && !!img;
    const css = !useImg && r.wall !== "none" && r.wall !== "image" ? WALLS[r.wall] : "";
    wall.style.background = css || "none";
    wall.style.backgroundSize = "cover";
    if (el._img !== (useImg ? img : "")) {
      el._img = useImg ? img : "";
      im.style.backgroundImage = useImg ? `url("${img}")` : "";
    }
    el.dataset.anim = r.anim;
    el.dataset.wall = (css || useImg) ? "1" : "0";
    el.dataset.img = useImg ? "1" : "0";
    el.dataset.motion = s.imgMotion ? "1" : "0";
    el.dataset.drift = s.drift ? "1" : "0";
  }

  g.YTG = { DEFAULTS, THEMES, WALLS, ANIMS, TRANSPARENT_MODES, WALLPAPERS, vars, stage, resolve, shade };
})(typeof self !== "undefined" ? self : this);
