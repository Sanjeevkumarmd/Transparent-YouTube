/* =========================================================================
   GOLD GLASS 2.0 — MASTER STUDIO CONTROLLER (options.js)
   Shared Theme Engine • 3D Carousel • Dynamic Glass & Motion Studio
   ========================================================================= */

(() => {
  const { DEFAULTS, THEMES, WALLS, ANIMS, TRANSPARENT_MODES, WALLPAPERS, vars, stage, resolve } = YTG;
  let s = { ...DEFAULTS, bgImage: "" };

  const THEME_KEYS = ["gold", "noir", "sapphire", "amethyst", "emerald", "silver"];

  // Cache DOM elements
  const $ = id => document.getElementById(id);
  const carouselTrack = $("carouselTrack");
  const carouselDots = $("carouselDots");
  const wallpaperStrip = $("wallpaperStrip");
  const toastPopup = $("toastPopup");
  const bgStage = $("bgStage");

  // Show Toast Message
  let toastTimer = 0;
  function showToast(msg) {
    if (!toastPopup) return;
    toastPopup.textContent = msg;
    toastPopup.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastPopup.classList.remove("show"), 2200);
  }

  // Save Settings to Storage
  function save(patch = {}) {
    Object.assign(s, patch);
    chrome.storage.local.set(s, () => {
      updateScenicBackground();
      updateThemeTokens();
    });
  }

  // Update Scenic Stage Background
  function updateScenicBackground() {
    if (!bgStage) return;
    stage(bgStage, s, s.bgImage);
  }

  // Update Dynamic CSS Variables on Root
  function updateThemeTokens() {
    const v = vars(s, "dark");
    for (const [k, val] of Object.entries(v)) {
      document.documentElement.style.setProperty(k, val);
    }
  }

  // -----------------------------------------------------------------------
  // 1. 3D THEME CAROUSEL
  // -----------------------------------------------------------------------
  function buildCarousel() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = "";

    THEME_KEYS.forEach(k => {
      const t = THEMES[k];
      const card = document.createElement("div");
      card.className = `c-theme-card${s.theme === k ? " active" : ""}`;
      card.dataset.theme = k;

      const bg = document.createElement("div");
      bg.className = "c-theme-bg";
      bg.style.background = WALLS[k] || WALLS.gold;

      const overlay = document.createElement("div");
      overlay.className = "c-theme-overlay";

      const info = document.createElement("div");
      info.className = "c-theme-info";
      info.innerHTML = `
        ${s.theme === k ? '<span class="c-theme-crown">&#128081;</span>' : ""}
        <span class="c-theme-name">${t.name}</span>
      `;

      card.appendChild(bg);
      card.appendChild(overlay);
      card.appendChild(info);

      card.addEventListener("click", () => selectTheme(k));
      carouselTrack.appendChild(card);
    });

    updateCarouselDots();
  }

  function updateCarouselDots() {
    if (!carouselDots) return;
    carouselDots.innerHTML = "";
    THEME_KEYS.forEach(k => {
      const dot = document.createElement("span");
      dot.className = `dot${s.theme === k ? " active" : ""}`;
      dot.addEventListener("click", () => selectTheme(k));
      carouselDots.appendChild(dot);
    });
  }

  function selectTheme(themeKey) {
    if (!THEMES[themeKey]) return;
    save({ theme: themeKey, anim: THEMES[themeKey].anim });
    buildCarousel();

    // Sync Mini Theme Cards on Right
    document.querySelectorAll(".theme-mini-card").forEach(c => {
      c.classList.toggle("active", c.dataset.theme === themeKey);
    });

    // Sync Animation Cards
    document.querySelectorAll(".anim-preview-card").forEach(c => {
      c.classList.toggle("active", c.dataset.anim === THEMES[themeKey].anim);
    });

    showToast(`Theme: ${THEMES[themeKey].name} activated`);
  }

  function prevTheme() {
    let idx = THEME_KEYS.indexOf(s.theme);
    idx = (idx - 1 + THEME_KEYS.length) % THEME_KEYS.length;
    selectTheme(THEME_KEYS[idx]);
  }

  function nextTheme() {
    let idx = THEME_KEYS.indexOf(s.theme);
    idx = (idx + 1) % THEME_KEYS.length;
    selectTheme(THEME_KEYS[idx]);
  }

  if ($("carouselPrev")) $("carouselPrev").addEventListener("click", prevTheme);
  if ($("carouselNext")) $("carouselNext").addEventListener("click", nextTheme);
  if ($("sidePrevTheme")) $("sidePrevTheme").addEventListener("click", prevTheme);
  if ($("sideNextTheme")) $("sideNextTheme").addEventListener("click", nextTheme);

  // Wheel & Trackpad Horizontal Navigation with Momentum Debounce
  let wheelLock = false;
  if ($("carouselViewport")) {
    $("carouselViewport").addEventListener("wheel", e => {
      e.preventDefault();
      if (wheelLock) return;
      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 20) {
        wheelLock = true;
        if (e.deltaX > 0 || e.deltaY > 0) nextTheme();
        else prevTheme();
        setTimeout(() => { wheelLock = false; }, 320);
      }
    }, { passive: false });
  }

  // Keyboard Navigation
  window.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft") prevTheme();
    else if (e.key === "ArrowRight") nextTheme();
  });

  // -----------------------------------------------------------------------
  // 2. WALLPAPER GALLERY STRIP
  // -----------------------------------------------------------------------
  function buildWallpapers() {
    if (!wallpaperStrip) return;
    const uploadBtn = $("uploadWallBtn");

    // Remove existing cards except upload button
    wallpaperStrip.querySelectorAll(".wall-card:not(.upload-btn)").forEach(el => el.remove());

    WALLPAPERS.forEach(w => {
      const card = document.createElement("button");
      card.className = `wall-card${(s.wall === w.wall && !s.bgImage) || (w.id === "default" && s.wall === "auto") ? " active" : ""}`;
      card.dataset.wall = w.wall;
      card.title = `${w.name} — ${w.sub}`;

      const thumb = document.createElement("div");
      thumb.className = "wall-card-thumb";
      thumb.style.background = WALLS[w.wall] || w.preview;

      const label = document.createElement("span");
      label.className = "wall-card-label";
      label.textContent = w.name;

      card.appendChild(thumb);
      card.appendChild(label);

      card.addEventListener("click", () => {
        save({ wall: w.wall, bgImage: "" });
        wallpaperStrip.querySelectorAll(".wall-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        showToast(`Wallpaper: ${w.name} applied`);
      });

      wallpaperStrip.insertBefore(card, uploadBtn);
    });
  }

  // Wallpaper Upload Support
  if ($("wallFileInput")) {
    $("uploadWallBtn").addEventListener("click", () => $("wallFileInput").click());
    $("wallFileInput").addEventListener("change", e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target.result;
        save({ wall: "image", bgImage: dataUrl });
        showToast("Custom wallpaper uploaded successfully!");
      };
      reader.readAsDataURL(file);
    });
  }

  // -----------------------------------------------------------------------
  // 3. TRANSPARENCY MODES (Normal, High Transparency, Ultra Clear)
  // -----------------------------------------------------------------------
  function setupTransparencyModes() {
    document.querySelectorAll(".trans-mode-card").forEach(card => {
      card.addEventListener("click", () => {
        const modeKey = card.dataset.mode;
        const preset = TRANSPARENT_MODES[modeKey];
        if (!preset) return;

        save({
          tint: preset.tint,
          blur: preset.blur,
          wallDim: preset.wallDim,
          popAlpha: preset.popAlpha
        });

        // Update Slider UI
        if ($("rangeTint")) { $("rangeTint").value = preset.tint; $("valTint").textContent = preset.tint + "%"; }
        if ($("rangeBlur")) { $("rangeBlur").value = preset.blur; $("valBlur").textContent = preset.blur + "px"; }
        if ($("rangeWallDim")) { $("rangeWallDim").value = preset.wallDim; $("valWallDim").textContent = preset.wallDim + "%"; }
        if ($("rangePopAlpha")) { $("rangePopAlpha").value = preset.popAlpha; $("valPopAlpha").textContent = preset.popAlpha + "%"; }

        document.querySelectorAll(".trans-mode-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        showToast(`Glass Mode: ${preset.name} applied`);
      });
    });
  }

  // -----------------------------------------------------------------------
  // 4. ANIMATION STUDIO PREVIEWS (Firefly, Waver, Aurora, Stars, Embers)
  // -----------------------------------------------------------------------
  function setupAnimationCards() {
    document.querySelectorAll(".anim-preview-card").forEach(card => {
      card.addEventListener("click", () => {
        const animId = card.dataset.anim;
        save({ anim: animId });
        document.querySelectorAll(".anim-preview-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        const found = ANIMS.find(a => a.id === animId);
        showToast(`Animation: ${found ? found.name : animId} activated`);
      });
    });

    if ($("nextAnimBtn")) {
      $("nextAnimBtn").addEventListener("click", () => {
        const ids = ANIMS.map(a => a.id);
        let idx = ids.indexOf(s.anim);
        idx = (idx + 1) % ids.length;
        const nextId = ids[idx];
        save({ anim: nextId });
        document.querySelectorAll(".anim-preview-card").forEach(c => {
          c.classList.toggle("active", c.dataset.anim === nextId);
        });
        showToast(`Animation: ${ANIMS[idx].name}`);
      });
    }
  }

  // -----------------------------------------------------------------------
  // 5. SLIDERS & CONTROLS BINDING
  // -----------------------------------------------------------------------
  function bindSliders() {
    const pairs = [
      ["rangeTint", "valTint", "tint", "%"],
      ["rangeBlur", "valBlur", "blur", "px"],
      ["rangeShimmerSpeed", "valShimmerSpeed", "shimmerSpeed", "x"],
      ["rangeWallDim", "valWallDim", "wallDim", "%"],
      ["rangeHeaderBlur", "valHeaderBlur", "blur", "px"],
      ["rangePopAlpha", "valPopAlpha", "popAlpha", "%"]
    ];

    pairs.forEach(([sliderId, labelId, key, unit]) => {
      const slider = $(sliderId);
      const label = $(labelId);
      if (!slider || !label) return;

      slider.value = s[key] !== undefined ? s[key] : slider.value;
      label.textContent = slider.value + unit;

      slider.addEventListener("input", () => {
        const val = parseFloat(slider.value);
        label.textContent = slider.value + unit;
        save({ [key]: val });
      });
    });

    // Switches
    if ($("toggleShimmer")) {
      $("toggleShimmer").checked = !!s.shimmer;
      $("toggleShimmer").addEventListener("change", e => save({ shimmer: e.target.checked }));
    }
    if ($("toggleSoftBacking")) {
      $("toggleSoftBacking").checked = !!s.titleBack;
      $("toggleSoftBacking").addEventListener("change", e => save({ titleBack: e.target.checked }));
    }
    if ($("masterToggle")) {
      $("masterToggle").checked = !!s.enabled;
      $("masterToggle").addEventListener("change", e => {
        save({ enabled: e.target.checked });
        showToast(e.target.checked ? "Gold Glass Enabled" : "Gold Glass Disabled");
      });
    }

    // Title Gold Palette Swatches
    document.querySelectorAll(".color-swatch[data-color]").forEach(btn => {
      btn.addEventListener("click", () => {
        const c = btn.dataset.color;
        save({ gold: c });
        document.querySelectorAll(".color-swatch").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        showToast(`Title Gold: ${btn.title}`);
      });
    });

    if ($("customColorPicker")) {
      $("customColorPicker").addEventListener("input", e => {
        save({ gold: e.target.value });
      });
    }

    // Reset Button
    if ($("resetBtn")) {
      $("resetBtn").addEventListener("click", () => {
        if (confirm("Reset all settings to Gold Glass 2.0 defaults?")) {
          s = { ...DEFAULTS, bgImage: "" };
          chrome.storage.local.set(s, () => {
            location.reload();
          });
        }
      });
    }

    // Customize Button
    if ($("customizeBtn")) {
      $("customizeBtn").addEventListener("click", () => {
        showToast("You are inside Gold Glass 2.0 Studio!");
      });
    }
  }

  // -----------------------------------------------------------------------
  // 6. EXTRA FEATURES TO ADD TOGGLES
  // -----------------------------------------------------------------------
  function setupExtrasAndIdeas() {
    document.querySelectorAll(".extra-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        const name = btn.querySelector(".etb-text").textContent;
        const isActive = btn.classList.contains("active");
        showToast(`${name}: ${isActive ? "Active" : "Disabled"}`);
      });
    });

    document.querySelectorAll(".feature-action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.querySelector(".fab-text").textContent;
        showToast(`Idea: ${name} (Ready)`);
      });
    });

    // Nav rail tabs
    document.querySelectorAll(".rail-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".rail-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        showToast(`Workspace: ${btn.dataset.tab} Tab`);
      });
    });

    // Mini preview frames
    document.querySelectorAll(".live-mini-frame").forEach(frame => {
      frame.addEventListener("click", () => {
        document.querySelectorAll(".live-mini-frame").forEach(f => f.classList.remove("active"));
        frame.classList.add("active");
        showToast(`Preview: ${frame.title}`);
      });
    });
  }

  // -----------------------------------------------------------------------
  // INITIALIZATION
  // -----------------------------------------------------------------------
  chrome.storage.local.get({ ...DEFAULTS, bgImage: "" }, res => {
    s = { ...DEFAULTS, ...res };
    buildCarousel();
    buildWallpapers();
    setupTransparencyModes();
    setupAnimationCards();
    bindSliders();
    setupExtrasAndIdeas();
    updateScenicBackground();
    updateThemeTokens();
  });

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    for (const [k, v] of Object.entries(changes)) {
      s[k] = v.newValue;
    }
    updateScenicBackground();
    updateThemeTokens();
  });

})();
