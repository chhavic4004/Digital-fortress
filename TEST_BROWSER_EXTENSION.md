# 🧪 How to Test & Verify Browser Extension

## ✅ Quick Test Checklist

### Step 1: Verify Extension is Installed

1. **Open Extensions Page:**
   - Chrome: Go to `chrome://extensions/`
   - Edge: Go to `edge://extensions/`

2. **Check Extension List:**
   - Look for "Digital Fortress - AI Cyber Guardian"
   - Should see extension icon in list
   - Make sure it's **Enabled** (toggle switch ON)

3. **Check Extension Icon in Toolbar:**
   - Look at top-right of browser
   - Should see extension icon (shield icon or placeholder)
   - If not visible, click puzzle piece icon (extensions menu)

---

### Step 2: Check Extension Status

1. **In Extensions Page:**
   - Find "Digital Fortress" extension
   - Status should be "Enabled"
   - No error messages in red

2. **Click "Service Worker" Link (if visible):**
   - Should open Developer Tools
   - Check Console tab for errors
   - Should see: "Digital Fortress Extension Installed"

3. **Click Extension Icon:**
   - Should open popup window
   - Should show "Digital Fortress" header
   - Should display "Current Site" section

---

### Step 3: Test Automatic Scanning

1. **Visit Any Website:**
   - Go to: `https://example.com`
   - Or: `https://google.com`

2. **Check Extension Badge:**
   - Look at extension icon in toolbar
   - Badge should change color:
     - **🟢 Green** = Safe
     - **🟡 Yellow** = Medium Risk
     - **🔴 Red** = Dangerous
     - **⚪ Gray** = Scanning/Unknown

3. **Check Page Indicator:**
   - After page loads, look at top-right corner
   - Should see floating indicator with shield icon
   - Shows risk level (Safe/Caution/Danger)
   - Auto-hides after 5 seconds if safe

4. **Check Badge Text:**
   - Badge should show:
     - **✓** = Safe
     - **!** = Medium Risk
     - **⚠** = Dangerous
     - **?** = Unknown

---

### Step 4: Test Manual Scanning

1. **Click Extension Icon:**
   - Popup should open

2. **Check Current Site:**
   - Should show current website URL
   - Click "Scan Now" button
   - Should show scanning status

3. **Test URL Scan:**
   - Enter URL: `https://example.com`
   - Click "Scan" button
   - Should show results with risk level

4. **Test Text Analysis:**
   - Paste suspicious text in textarea
   - Example: "Your account has been suspended. Click here to verify: http://fake-bank.com"
   - Click "Analyze Text"
   - Should show fraud detection results

---

### Step 5: Test Backend Connection

**Option A: Check Console for Errors**
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Visit a website
4. Look for errors (red text)
5. Should see: "Wi-Fi Scan Response:" or API calls

**Option B: Check Network Tab**
1. Press `F12` → Go to "Network" tab
2. Visit a website
3. Look for requests to `localhost:5000/api/url_scan`
4. Should show:
   - Status: 200 (OK)
   - Response with `success: true`

**Option C: Test API Directly**
```powershell
# Make sure backend is running first
curl http://localhost:5000/api/health
```

---

## 🔍 Troubleshooting

### ❌ Extension Not Appearing?

**Check:**
- Is Developer Mode enabled? (top-right toggle in extensions page)
- Did you load the correct folder? (`browser-extension/`)
- Any red error messages in extensions page?

**Fix:**
- Click "Reload" button on extension card
- Or remove and re-add extension

---

### ❌ Badge Not Changing?

**Check:**
- Is backend running? (`npm run dev` in backend folder)
- Open Console (F12) → Check for errors
- Check Service Worker status in extensions page

**Fix:**
1. Stop backend (Ctrl+C)
2. Restart: `npm run dev`
3. Refresh extension: Click "Reload" in extensions page
4. Visit website again

---

### ❌ "Error connecting to backend"?

**Check:**
- Backend URL in `background.js` (should be `http://localhost:5000/api`)
- Is backend running on port 5000?
- CORS enabled on backend?

**Test:**
```powershell
curl http://localhost:5000/api/health
```

Should return: `{"success":true,...}`

---

### ❌ No Visual Indicator on Page?

**Check:**
- Content script loaded? (F12 → Console → Type: `document.getElementById('digital-fortress-indicator')`)
- Any console errors?
- Page might block content scripts (some sites do)

**Fix:**
- Refresh the page
- Check console for errors
- Try different website

---

### ❌ Popup Not Opening?

**Check:**
- Extension enabled?
- Click extension icon again
- Check for popup.html file exists

**Fix:**
- Reload extension
- Check file permissions

---

## ✅ Success Indicators

**Extension is working if:**
- ✅ Extension appears in toolbar
- ✅ Badge color changes when visiting sites
- ✅ Visual indicator appears on pages
- ✅ Popup opens and shows current site
- ✅ Manual scan returns results
- ✅ Text analysis works
- ✅ No errors in console
- ✅ Network requests show API calls to backend

---

## 🧪 Test Scenarios

### Test 1: Safe Website
- Visit: `https://example.com`
- Expected: Green badge, "Safe" indicator

### Test 2: Suspicious URL
- Visit: `http://test-phishing-site.example`
- Expected: Yellow/Red badge, warning indicator

### Test 3: Manual Scan
- Click extension → Enter URL → Scan
- Expected: Results card appears with risk level

### Test 4: Text Analysis
- Click extension → Paste suspicious text → Analyze
- Expected: Fraud detection results

---

## 📊 Expected Behavior

### Automatic Scanning:
1. **Visit website** → Extension detects
2. **Sends URL to backend** → `/api/url_scan`
3. **Receives response** → Risk score and level
4. **Updates badge** → Color changes
5. **Shows indicator** → On-page visual
6. **Saves to history** → Local storage

### Manual Scanning:
1. **Click extension** → Popup opens
2. **Enter URL/text** → Input field
3. **Click Scan/Analyze** → Sends to backend
4. **Shows results** → Risk level, score, details

---

## 🔧 Debug Commands

**In Browser Console (F12):**
```javascript
// Check if extension is loaded
chrome.runtime.sendMessage({action: 'GET_SCAN_HISTORY'}, console.log);

// Check current status
chrome.storage.local.get(['currentRisk', 'currentData'], console.log);
```

**In Service Worker Console:**
- Go to `chrome://extensions/`
- Find extension
- Click "Service Worker" link
- Check console for logs

---

## ✅ Quick Verification

Run these quick checks:

1. **Extension Installed?**
   - `chrome://extensions/` → See "Digital Fortress"

2. **Backend Running?**
   - `http://localhost:5000/api/health` → Returns success

3. **Badge Working?**
   - Visit website → Badge color changes

4. **Popup Working?**
   - Click icon → Popup opens

5. **Scanning Working?**
   - Manual scan → Results appear

**If all ✅, extension is working perfectly!**

---

## 📝 Test Log

Keep track:
- [ ] Extension loads without errors
- [ ] Badge appears and updates
- [ ] Visual indicator shows on pages
- [ ] Popup opens correctly
- [ ] Manual URL scan works
- [ ] Text analysis works
- [ ] Scan history saves
- [ ] Notifications appear for danger
- [ ] Backend API calls succeed
- [ ] No console errors

---

**Follow these steps and you'll know exactly if your extension is working!** 🎯

