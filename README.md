# 💍 Rishabh & Simran — Wedding Invitation Website

A luxury, responsive digital wedding invitation built with React, TypeScript, Tailwind CSS, and Vite. Designed to be lightweight, elegant, and ready for deployment on Netlify's free tier.

---

## 📌 Quick Summary of Where Everything Lives

| What you want to do | File or Folder |
| :--- | :--- |
| **Edit wedding details** (names, date, time, venue, stories, family, text) | [`src/data/wedding-data.ts`](src/data/wedding-data.ts) |
| **Add or replace background music & audio** | [`public/uploads/`](public/uploads/) |
| **Add or replace photos** | [`public/`](public/) or directly in [`src/data/wedding-data.ts`](src/data/wedding-data.ts) |
| **Visual In-Browser Editor** | Open `http://localhost:5173/editor` when running locally |
| **Folder to deploy to Netlify** | `dist/` (generated after running `npm run build`) |

---

## 🚀 How to Run Locally

1. Open your terminal in this project directory:
   ```bash
   cd C:\Users\PC\.gemini\antigravity\scratch\shaadi
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser:
   - **Public Invitation**: [http://localhost:5173/](http://localhost:5173/)
   - **Visual Editor**: [http://localhost:5173/editor](http://localhost:5173/editor)
   - **Mobile Testing (Same Wi-Fi)**: Use the Network URL shown in your terminal (e.g., `http://192.168.1.11:5173/`)

---

## ✏️ How to Edit Wedding Information

### Option 1: Direct File Edit (Recommended — Fast & Persistent)
Open [`src/data/wedding-data.ts`](src/data/wedding-data.ts) in any code editor (VS Code, Notepad, etc.). 
All your wedding data is neatly organized into clear sections:
- **`couple`**: Names (`Rishabh` & `Simran`), nicknames, monogram initials (`R&S`).
- **`wedding`**: Date (`2026-11-26`), time (`6:00 PM`), city (`Kanpur`), invitation letter.
- **`venue`**: Name (`The Jagdamba Guest House`), address, Google Maps URL.
- **`events`**: Haldi, Wedding Ceremony, and any additional events with time, date, venue, and dress code.
- **`story`**: Your milestones ("Where It All Began", "Forever Starts Here").
- **`family`**: Bride's family and Groom's family members and titles.
- **`music`**: Background music track, volume, and autoplay setting.
- **`scratchCard`**: Secret reveal date, celebration sound effect, and scratch sensitivity.
- **`text`**: Section titles, subtitles, and footer credit (`Made with ❤️ by Hritik and Krishna`).

Once you save the file, the local dev server updates instantly via Hot Module Replacement!

### Option 2: Visual Editor UI
1. Run `npm run dev` and navigate to `http://localhost:5173/editor`.
2. Edit names, dates, colors, or music visually in the side panel.
3. Click the **"Save to Project"** button in the top right. This automatically updates both `src/data/wedding-data.ts` and `src/data/savedConfig.json` on disk.

---

## 🔨 How to Build for Production

Before deploying, always compile the latest source code into static production files:

```bash
npm run build
```

This compiles all TypeScript, optimizes images/styles, and places the complete, ready-to-host website into the **`dist/`** directory.

---

## 🌐 How to Deploy to Netlify

### Method A: Manual Drag-and-Drop (Netlify Drop) — Simplest
1. Run the build command in your project:
   ```bash
   npm run build
   ```
2. Log into [Netlify](https://app.netlify.com/).
3. Go to **Sites** and locate the **"Drag and drop your site output folder here"** area.
4. Drag and drop the **`dist`** folder (inside `shaadi/dist`).
   > ⚠️ **CRITICAL**: Drag the **`dist`** folder, **NOT** the parent project folder! Netlify Drop does not run a compiler; it needs the static HTML/CSS/JS files located inside `dist`.

### Method B: Git Integration (Automatic Continuous Deployment)
If you push this project to GitHub or GitLab:
1. In Netlify, click **"Add new site"** → **"Import an existing project"**.
2. Select your repository.
3. Use the following exact settings (which match [`netlify.toml`](netlify.toml)):
   - **Base directory**: (leave blank or `./` if root of repo)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**.
Now, whenever you push changes to Git, Netlify will automatically build and publish your latest edits!

---

## 🔍 Why the "Nothing Changed on Netlify" Problem Happened & How It Was Fixed

1. **LocalStorage Masking**:
   - The in-browser editor previously saved changes only into browser `localStorage`. Netlify's build servers have no access to browser `localStorage`, so Netlify built fallback defaults instead of what was edited in the browser.
   - **Fix**: Created [`src/data/wedding-data.ts`](src/data/wedding-data.ts) as the single authoritative source of truth, and updated the visual editor so clicking "Save" writes directly to disk. In addition, the public invitation page now always loads from `wedding-data.ts`, preventing stale cache from hiding your edits.
2. **Deploying the Wrong Directory in Netlify Drop**:
   - Dropping the raw project folder (`shaadi`) fails because browsers cannot run uncompiled `.tsx` files.
   - **Fix**: Documented that only the compiled **`dist`** folder should be deployed when using Netlify Drop.
3. **HTML Browser Caching on Netlify**:
   - If Netlify serves `index.html` with long cache headers, visitors' browsers keep showing the older version.
   - **Fix**: Added cache-busting headers in [`netlify.toml`](netlify.toml) (`no-cache` on `index.html`, immutable caching on hashed assets).

---

## 📱 Responsive Testing Checklist

The website is fully responsive across all device breakpoints:
- **Mobile (320px – 767px)**: iPhone SE, iPhone 12/13/14/15, Samsung Galaxy, Pixel. All text fits without horizontal scrolling, touch targets are comfortable (≥ 44px), and the scratch card supports smooth touch gestures.
- **Tablet (768px – 1023px)**: iPad Mini, iPad Air, iPad Pro, Android tablets in portrait/landscape.
- **Desktop & Laptop (1024px and above)**: Full-screen editorial magazine hero, multi-column event cards, and masonry gallery.
