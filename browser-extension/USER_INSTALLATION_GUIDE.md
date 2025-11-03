# 📥 User Installation Guide - Digital Fortress Extension

## 🎯 Quick Install (For End Users)

### Method 1: Chrome Web Store (Easiest - Coming Soon)
1. Open Chrome Web Store
2. Search "Digital Fortress"
3. Click "Add to Chrome"
4. Done!

---

### Method 2: Install from .crx File (Current Method)

#### Step 1: Download Extension
- Download `digital-fortress.crx` file from:
  - Website download link
  - GitHub releases
  - Direct share from developer

#### Step 2: Install in Chrome/Edge
1. **Open Extensions Page:**
   - Chrome: Type `chrome://extensions/` in address bar
   - Edge: Type `edge://extensions/` in address bar
   - Press Enter

2. **Enable Developer Mode:**
   - Look for toggle switch in top-right corner
   - Turn it ON (blue/colored)

3. **Drag & Drop File:**
   - Find the downloaded `digital-fortress.crx` file
   - Drag it into the extensions page
   - Or click "Load unpacked" and navigate to folder

4. **Confirm Installation:**
   - Click "Add Extension" button
   - Extension appears in list
   - Icon appears in browser toolbar

#### Step 3: Verify Installation
- Extension icon should appear in browser toolbar (top-right)
- Click icon → Popup should open
- Visit any website → Extension should scan automatically

---

### Method 3: Install from Folder (Developer/Testing)

#### Step 1: Get Extension Folder
- Download/extract `browser-extension` folder
- Or clone from GitHub repository

#### Step 2: Load in Browser
1. Open `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked" button
4. Select the `browser-extension` folder
5. Click "Select Folder"

#### Step 3: Done!
- Extension loads and appears in extensions list
- Ready to use!

---

## 🔧 Troubleshooting

### "Extension could not be loaded"
- Check if all files are in the folder
- Verify `manifest.json` exists
- Make sure Developer mode is enabled

### "Extension is corrupted"
- Download the file again
- Check if file was downloaded completely
- Try Method 3 (Load unpacked) instead

### "Icons missing" warning
- Extension still works
- Icons are optional (just for display)
- Can ignore this warning

### Extension not scanning websites
- Make sure backend is running (for development)
- Check API URL is correct (for production)
- Verify extension is enabled in `chrome://extensions/`

---

## ✅ After Installation

**Extension should:**
- ✅ Show icon in browser toolbar
- ✅ Display badge color when visiting sites
- ✅ Show visual indicator on pages
- ✅ Allow manual URL scanning
- ✅ Analyze suspicious text

**First Time Setup:**
- No setup required!
- Extension works immediately
- Just start browsing

---

## 🎨 What You'll See

### Badge Colors:
- **🟢 Green (✓)** = Safe website
- **🟡 Yellow (!)** = Medium risk, be cautious
- **🔴 Red (⚠)** = Dangerous/phishing detected

### Visual Indicators:
- Shield icon appears on pages (top-right corner)
- Shows risk level (Safe/Caution/Danger)
- Click to see detailed analysis

---

## 📱 System Requirements

- **Browser:** Chrome 88+ or Edge 88+
- **OS:** Windows, Mac, Linux (all supported)
- **Permissions:** 
  - Tabs (to scan URLs)
  - Storage (for scan history - local only)
  - Notifications (for dangerous site alerts)

---

## 🔒 Privacy & Security

- ✅ All scans happen in real-time
- ✅ Scan history stored locally (not sent to server)
- ✅ No personal data collected
- ✅ Open source code (transparent)
- ✅ HTTPS-only API communication (production)

---

## 🆘 Need Help?

**Common Questions:**

**Q: Do I need an account?**
A: No! Extension works immediately after installation.

**Q: Does it slow down browsing?**
A: No, scans happen in background. Minimal impact.

**Q: Is my data sent anywhere?**
A: Only URLs are sent to backend for scanning (same as any security tool). Scan history stays on your device.

**Q: Can I disable it?**
A: Yes, go to `chrome://extensions/` → Toggle OFF

**Q: How to update?**
A: If installed from Chrome Web Store, updates automatically. Otherwise, download new version and reinstall.

---

**That's it! Extension is ready to protect you!** 🛡️

