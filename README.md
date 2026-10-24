# ✨ Gold Glass v10.1.4 — Premium Transparent Glass UI & Dynamic Themes

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-gold?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Version](https://img.shields.io/badge/Version-10.1.4-d4af37?style=for-the-badge)](manifest.json)
[![Platform](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge%20%7C%20Brave-blue?style=for-the-badge)](https://www.google.com/chrome/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)](LICENSE)

> **Gold Glass v10.1.4**: A futuristic, liquid-glass visual theme and enhancement suite for YouTube. Experience seamless translucent glassmorphism, horizontal instant clear theme carousels, live 16:9 customization preview, cinematic ambient animations, and real-time fine-tuning.

---

## 🌟 What's New in v10.1.4

### 🎛️ Horizontal Desktop Extension Interface
- **Wide Horizontal Layout**: Sized to `760px × 530px` — restored the wide layout giving the 16:9 preview, themes carousel, animation cards, and speed controls room to breathe without vertical crowding or right-side horizontal page scrolling.
- **Gen Z Curved Borders**: Modern 16px–18px rounded pill aesthetics with liquid glass refraction.
- **Selected Gold Glow**: Active theme displays an elevated gold border (`#ffd700`) and amber glow; active animation card displays a gold border and gold text.
- **Pop-In / Pop-Out Center Badge**: Smooth animated pop-in and pop-out preview badge in the center of the live 16:9 canvas when switching themes or animations.

### 💡 Video Player & UI Enhancements
- **Hover-Only Single-Line Tooltips**: Removed forced-display rules on tooltips. "Search with your voice", "Notifications", and player tooltips now strictly show on hover and disappear cleanly on mouse-out, formatted in a single horizontal line.
- **Removed Like/Dislike Row Glow**: Completely removed pulsing glow animations and neon box-shadows when moving the cursor over Like, Dislike, Share, Save, and top action buttons.
- **Permanent Subscribe Separator Removal**: Stripped all inner vertical separator lines and divider borders on the Subscribe and notification bell segmented buttons.
- **Precise Seeking Theme Color**: The "^ Pull up for precise seeking" prompt and arrow are styled in the active theme accent color.
- **75% Transparent Liquid Settings Menu**: Player settings and quality menu now use 25% dark, 75% transparent liquid fluid glass (`backdrop-filter: blur(20px)`) with crisp white labels and gold accents.
- **Instant Ambient Mode Sync & Dotted Borders**: Ambient radiance switches instantaneously to the active theme color with zero delay in normal, theater, and fullscreen modes, accented with delicate dotted theme separator borders around the player.

### 🎬 Dedicated GPU Ambient Animations
- **Firefly**: Organic golden embers swaying softly across the background.
- **Waver**: Smooth, flowing gold ribbons and light waves gliding gently behind the interface.
- **Aurora**: Soft shifting celestial bands of teal, green, and violet light.
- **Stars**: Twinkling starfield with gradual cosmic drift.
- **Embers**: Warm orange-gold sparks rising organically.

### 🖼️ Scenic Wallpaper Gallery
- Instant scenic presets: **Default** (Sunset Alps), **Nature** (Alpine Valley), **City** (Sunset Skyline), **Space** (Cosmic Nebula), **Ocean** (Deep Azure), and **Forest** (Boreal Mist), plus custom photo upload.

---

## 📸 Screenshots

### 🌟 Home Feed with Transparent Glass & Royal Gold Accents
![YouTube Home Feed](screenshots/youtube-home-feed.png)

### 🎬 Video Watch Page & Frosted Glass Player
![YouTube Video Watch Page](screenshots/youtube-video-player.png)

### 💎 Liquid Frosted Glass Panels & Topic Pills
![Liquid Frosted Glass Theme](screenshots/youtube-glass-theme.png)

---

## 🚀 Key Features

### 🧊 Liquid Frosted Glass Interface
- **Dynamic Glass Transparency**: Smooth `-webkit-backdrop-filter` and liquid blur across header masthead, sidebar guides, comment sections, and video descriptions.
- **Natural Light Refraction**: Subtly tinted glass edges that highlight your active wallpaper without interfering with video clarity or text readability.

### 🎨 12 Handcrafted Royal Themes
Seamlessly switch between 12 distinct multi-hue palettes:
- **Royal Gold**: Deep imperial gold with gleaming honey undertones.
- **Noir Gold**: Midnight obsidian base with gilded amber embers.
- **Sapphire**: Deep ocean blues with tidal cyan reflections.
- **Amethyst**: Majestic cosmic purple with nebula pink tones.
- **Emerald**: Lush jade green with glade forest highlights.
- **Crimson**: Velvet rose with ruby-silk gradients.
- **Silver**: Polished moonlit chrome with subtle slate sheen.
- **Northern**: Arctic boreal green with aurora violet transitions.
- **Sunset**: Dusk violet with rich sunburst orange horizons.
- **Deep Sea**: Oceanic turquoise with aquatic wave drifts.
- **Rose Quartz**: Soft sakura pink with champagne highlights.
- **Galaxy**: Deep interstellar violet with starry nebulae.

### 🌌 5 Live Ambient Animations (GPU Accelerated)
Selectable from the extension popup with live thumbnail previews:
1. **Firefly**: Organic glowing embers swaying softly across the background.
2. **Waver**: Gentle wave-form silk bands gliding across the viewport.
3. **Aurora**: Sweeping celestial ribbons of shifting light.
4. **Stars**: Sparkling, drifting stars with multi-layered twinkling.
5. **Embers**: Warm sparks rising gracefully from the bottom.
- **Variable Animation Speed**: Easily toggle from **0.5x** to **3.0x** or pause while scrolling.

### 🎯 Refined Interface Polish
- **Pill-Shaped Topic Chips**: Fully redesigned pill chips with smooth borders. Active topics illuminate with vibrant theme-specific gold/accent gradients—never pitch black.
- **Distraction-Free Video Menus**: Clean, transparent liquid frosted glass dropdown menus. Removed preselected shimmers—menu items highlight elegantly only when your cursor hovers over them.
- **Precise Link Styling**: External links in descriptions and comments stand out in crisp blue (`#7cc0ff`), while timestamps and chapter markers comfortably match the theme typography.
- **Custom Wallpaper Upload**: Set any personal photo or high-res image as your YouTube background with optional subtle Ken Burns slow zoom and blur adjustments.
- **Sponsor & Ad Controls**: Built-in support for auto-skipping video ads and sponsor segments.

---

## 📥 Installation Guide

### Option 1: Load as Unpacked Extension (Recommended)
1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/Sanjeevkumarmd/Transparent-YouTube.git
   ```
   *(Or download and extract the ZIP archive from GitHub).*
2. Open your Chromium-based browser (Google Chrome, Microsoft Edge, Brave, Opera, Vivaldi).
3. Navigate to `chrome://extensions/` (or `edge://extensions/`).
4. Toggle on **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the cloned `Transparent-YouTube` folder (containing `manifest.json`).
6. Open [YouTube](https://www.youtube.com/) and enjoy the new transparent experience!

---

## 🎛️ How to Use

1. Click the **YT Gold Glass** extension icon in your browser toolbar.
2. **Themes Carousel**: Use the large `❮` and `❯` arrow buttons to browse through themes. Click any theme card to activate it immediately.
3. **Animation Wheel**: Choose your preferred background animation with real-time live previews.
4. **Speed Selector**: Pick your desired speed from `0.5x` up to `3.0x`.
5. **Customize Panel**: Click `⚙ Customize` to access advanced developer options (glass fill opacity, wallpaper dimming, photo blur, ambient glow strength, and more).

---

## 🛠️ Built With

- **Manifest V3** - Modern Chrome Extension Architecture
- **Vanilla JavaScript** - High performance, zero dependencies
- **Modern CSS3** - Hardware-accelerated transforms, CSS Variables (`var(--ytg-*)`), `-webkit-backdrop-filter`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
