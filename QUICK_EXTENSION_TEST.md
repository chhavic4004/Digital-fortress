# ⚡ Quick Extension Test (2 Minutes)

## 🎯 Fastest Way to Check if Extension Works

### 1️⃣ Check Installation (30 seconds)

1. Open: `chrome://extensions/` (or `edge://extensions/`)
2. Look for: "Digital Fortress - AI Cyber Guardian"
3. Status should be: **Enabled** ✅

**❌ Not there?** → Click "Load unpacked" → Select `browser-extension` folder

---

### 2️⃣ Check Icon (10 seconds)

1. Look at browser toolbar (top-right)
2. Should see extension icon
3. Click it → Popup should open

**❌ No icon?** → Click puzzle piece icon (extensions menu) → Pin Digital Fortress

---

### 3️⃣ Test Auto-Scan (1 minute)

1. **Make sure backend is running:**
   ```powershell
   cd digital-fortress-backend
   npm run dev
   ```

2. **Visit any website:**
   - Go to: `https://example.com`

3. **Check badge:**
   - Extension icon should change color
   - Should see badge text (✓ or ! or ⚠)

4. **Check page indicator:**
   - Top-right corner of page
   - Should show shield icon with risk level

---

### 4️⃣ Test Popup (30 seconds)

1. Click extension icon
2. Should see:
   - "Digital Fortress" header
   - Current site info
   - Manual scan options

3. Click "Scan Now"
4. Should show scanning → results

---

## ✅ It's Working If:

- ✅ Badge color changes when you visit sites
- ✅ Visual indicator appears on pages
- ✅ Popup opens when clicking icon
- ✅ Manual scan shows results
- ✅ No red errors in extensions page

---

## ❌ It's NOT Working If:

- ❌ Badge stays gray/never changes
- ❌ No visual indicator on pages
- ❌ Popup shows "Error connecting to backend"
- ❌ Red errors in extensions page console

---

## 🔧 Quick Fixes

**Badge not changing?**
- Restart backend
- Reload extension (click reload button in extensions page)
- Visit website again

**Error connecting?**
- Check backend is running: `http://localhost:5000/api/health`
- Verify API URL in `background.js` is correct

**No indicator?**
- Refresh page (F5)
- Check console for errors (F12)

---

**That's it! If badge changes color when you visit sites, it's working!** 🎉

