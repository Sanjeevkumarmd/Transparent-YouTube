# ✨ Gold Glass v10.1.3 — Premium Transparent Glass UI & Dynamic Themes

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-gold?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Version](https://img.shields.io/badge/Version-10.1.3-d4af37?style=for-the-badge)](manifest.json)
[![Platform](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge%20%7C%20Brave-blue?style=for-the-badge)](https://www.google.com/chrome/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)](LICENSE)

> **Gold Glass v10.1.3**: A futuristic, liquid-glass visual theme and enhancement suite for YouTube. Experience seamless translucent glassmorphism, instant clear theme carousels, live 16:9 customization preview, cinematic ambient animations, and real-time fine-tuning.

---

## 🌟 What's New in v10.1.3

### ⚡ Lightweight, Fast & Zero-Lag Popup
- **Compact 440px Dimensions**: Perfectly fitted to Chrome's native extension popup dimensions without horizontal scrollbars or page overflow.
- **Removed Fullscreen & 2.0 Design**: Eliminated heavy dual-view DOM trees and fullscreen buttons, restoring blazing-fast, buttery smooth responsiveness when switching themes.
- **Gen Z Curved Borders**: Modern 16px–18px rounded pill aesthetics with liquid glass refraction.
- **Gold Selection Glow**: Selected theme card features an elevated gold border (`#ffd700`) and glow; selected animation card displays gold text and borders.
- **Pop-In / Pop-Out Center Badge**: Smooth animated pop-in and pop-out preview badge in the center of the live 16:9 canvas when switching themes or animations.

### 🎬 Player & UI Fixes
- **High-Contrast Player Settings Menu**: Dark liquid frosted glass (`rgba(22, 16, 10, 0.90)`) with 32px blur, pure white option labels (`#ffffff`), and gold accents ensures Quality and playback settings are 100% readable even over pure white video backgrounds.
- **Subscribe Button Separator Removed**: Cleanly stripped the vertical divider line in the Subscribe / Notification bell segmented pill.
- **Single-Line Microphone Tooltip**: Tooltips for "Search with your voice" and other top bar controls now strictly render on a single horizontal line without awkward vertical wrapping.
- **Create Button Hover Stabilized**: Fixed hover behavior to scale gently without rotation or unwanted menu popups.

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
