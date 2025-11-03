# 🛡️ Digital Fortress Browser Extension - Setup Guide

## ✅ What's Been Created

Complete browser extension with:
- ✅ Manifest V3 configuration
- ✅ Automatic URL scanning
- ✅ Visual indicators on pages
- ✅ Manual scan popup
- ✅ Text fraud detection
- ✅ Scan history
- ✅ Real-time alerts

## 📦 Files Created

```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js         # Service worker (auto-scanning)
├── content.js            # Page indicators
├── content.css           # Styles for indicators
├── popup.html            # Extension popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── README.md             # Extension documentation
└── icons/                # Icon files (need to create)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Quick Start

### Step 1: Create Icons (Required)

You need to create 3 icon files. You can:

**Option A: Use Placeholder Service**
- Download: https://via.placeholder.com/16 (for 16x16)
- Download: https://via.placeholder.com/48 (for 48x48)
- Download: https://via.placeholder.com/128 (for 128x128)
- Save them as `icon16.png`, `icon48.png`, `icon128.png` in `browser-extension/icons/`

**Option B: Create Custom Icons**
- Use any image editor (or AI image generator)
- Create 16x16, 48x48, and 128x128 PNG files
- Use a shield/security icon theme
- Save in `browser-extension/icons/`

### Step 2: Install Extension

1. **Open Chrome/Edge:**
   - Chrome: Go to `chrome://extensions/`
   - Edge: Go to `edge://extensions/`

2. **Enable Developer Mode:**
   - Toggle "Developer mode" in top right corner

3. **Load Extension:**
   - Click "Load unpacked"
   - Navigate to: `D:\coding\Digital-fortress\browser-extension`
   - Select the folder

4. **Verify Installation:**
   - You should see "Digital Fortress - AI Cyber Guardian" in extensions list
   - Extension icon should appear in browser toolbar

### Step 3: Make Sure Backend is Running

```powershell
cd D:\coding\Digital-fortress\digital-fortress-backend
npm run dev
```

Backend must be running on `http://localhost:5000`

### Step 4: Test Extension

1. **Visit any website** (e.g., `https://example.com`)
   - Extension should automatically scan
   - Badge should change color based on risk

2. **Click extension icon:**
   - Should open popup
   - Shows current site status
   - Try manual scan

3. **Test manual scan:**
   - Enter URL: `https://example.com`
   - Click "Scan"
   - Should show results

4. **Test text analysis:**
   - Paste suspicious text
   - Click "Analyze Text"
   - Should show fraud detection results

## 🎯 Features

### ✅ Automatic Protection
- Every page you visit is automatically scanned
- Badge color updates in real-time
- Visual indicator appears on page

### ✅ Manual Scanning
- Click extension icon → Enter URL → Scan
- Or paste text → Analyze

### ✅ Visual Indicators
- **Green** = Safe
- **Yellow** = Caution
- **Red** = Dangerous

### ✅ Scan History
- Click "Scan History" in popup
- View all previous scans
- Stored locally (private)

## 🔧 Configuration

### For Production Deployment:

Edit `background.js` (line 2) and `popup.js` (line 1):
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

Change from `http://localhost:5000/api` to your production backend URL.

## 🐛 Troubleshooting

### Extension Not Appearing?
- Check if Developer Mode is enabled
- Verify folder path is correct
- Check for errors in `chrome://extensions/`

### Not Scanning Websites?
- Make sure backend is running
- Check browser console (F12) for errors
- Verify API URL is correct in `background.js`

### Badge Not Updating?
- Refresh the page
- Check service worker: `chrome://extensions/` → Click "Service Worker" link
- Check console for errors

### Icons Missing?
- Extension will work without icons, but badge might look broken
- Create icon files as described in Step 1

## 📊 Testing Checklist

- [ ] Extension loads without errors
- [ ] Badge appears in toolbar
- [ ] Visiting a website triggers scan
- [ ] Badge color updates based on risk
- [ ] Visual indicator appears on page
- [ ] Popup opens when clicking icon
- [ ] Manual URL scan works
- [ ] Text analysis works
- [ ] Scan history saves and displays
- [ ] Notifications appear for dangerous sites

## 🎨 Customization

- Edit `popup.css` for popup styling
- Edit `content.css` for page indicator styling
- Modify colors in `background.js` (BADGE_COLORS)

## 📦 Packaging for Distribution

1. Go to `chrome://extensions/`
2. Click "Pack extension"
3. Select `browser-extension` folder
4. Click "Pack Extension"
5. This creates `.crx` file (for Chrome Web Store)

## ✅ Success!

Your browser extension is ready! It will:
- ✅ Automatically protect you on every website
- ✅ Show real-time risk indicators
- ✅ Allow manual scans
- ✅ Integrate with Digital Fortress backend

**Test it now by visiting a website!**

