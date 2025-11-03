# 🛡️ Digital Fortress Browser Extension

AI-powered browser extension for real-time protection against phishing, fraud, and malicious websites.

## ✨ Features

1. **Automatic Protection** - Scans every website you visit in real-time
2. **Visual Indicators** - Color-coded badges (🟢 Green = Safe, 🟡 Yellow = Caution, 🔴 Red = Danger)
3. **Manual Scans** - Scan URLs or analyze suspicious text/messages
4. **Scan History** - View your scan history locally (no account needed)
5. **Real-time Alerts** - Desktop notifications for dangerous sites
6. **Backend Integration** - Connects to Digital Fortress backend APIs

## 📦 Installation

### For Development:

1. **Build the extension:**
   ```bash
   # The extension files are ready in the browser-extension/ folder
   ```

2. **Load in Chrome/Edge:**
   - Open Chrome/Edge browser
   - Go to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `browser-extension/` folder

3. **Make sure backend is running:**
   - Backend must be running on `http://localhost:5000`
   - Or update `API_BASE_URL` in `background.js` and `popup.js`

## 🔧 Configuration

### Update API URL (for production):

Edit these files:
- `background.js` - Line 2: `const API_BASE_URL = 'https://your-backend-url.com/api';`
- `popup.js` - Line 1: `const API_BASE_URL = 'https://your-backend-url.com/api';`

### Icons:

You need to create icons (16x16, 48x48, 128x128 PNG files) and place them in:
- `browser-extension/icons/icon16.png`
- `browser-extension/icons/icon48.png`
- `browser-extension/icons/icon128.png`

Or use a placeholder service like:
- https://via.placeholder.com/128 (temporary)

## 🎯 How It Works

### Automatic Scanning:
- When you visit a website, the extension automatically sends the URL to `/api/url_scan`
- Updates the badge color based on risk level
- Shows visual indicator on the page

### Manual Scanning:
1. Click the extension icon
2. Enter a URL or paste suspicious text
3. Click "Scan" or "Analyze Text"
4. View detailed results

### Visual Indicators:
- **Green Badge (✓)** = Safe website
- **Yellow Badge (!)** = Medium risk, exercise caution
- **Red Badge (⚠)** = Dangerous/phishing detected
- **Gray Badge (?)** = Scanning or unknown

## 🔌 Backend Integration

The extension uses these backend endpoints:

- `POST /api/url_scan` - Scan URL for phishing/malicious content
- `POST /api/detect_fraud` - Analyze text for fraud patterns
- `GET /api/health` - Health check (periodic)

## 📝 Manifest V3 Compliance

- Uses Service Worker instead of background pages
- Follows Chrome Extension Manifest V3 standards
- Secure permissions (only requests what's needed)

## 🚀 Production Deployment

1. **Update API URLs** in `background.js` and `popup.js`
2. **Create icons** and add to `icons/` folder
3. **Test thoroughly** on different websites
4. **Package extension**:
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select `browser-extension/` folder
   - Generate `.crx` file for distribution

5. **Publish to Chrome Web Store** (optional):
   - Create developer account
   - Upload packaged extension
   - Submit for review

## 🔒 Security Features

- ✅ HTTPS-only API communication (in production)
- ✅ Local storage for scan history (no cloud sync)
- ✅ No personal data collection
- ✅ Permission-based access (only requests necessary permissions)

## 📊 Scan History

- Stored locally in browser (no account needed)
- Limited to 100 recent scans
- Can be cleared anytime
- Privacy-focused (never sent to server)

## 🐛 Troubleshooting

### Extension not working?
- Check if backend is running on `http://localhost:5000`
- Check browser console for errors (F12)
- Verify extension is enabled in `chrome://extensions/`

### API errors?
- Make sure CORS is enabled on backend
- Check backend logs for errors
- Verify API endpoints are correct

### Badge not updating?
- Refresh the page after installing extension
- Check service worker in `chrome://extensions/` → Service Worker link

## 📱 Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Opera 74+
- ❌ Firefox (requires Manifest V2, needs port)

## 🎨 Customization

Edit `popup.css` and `content.css` to customize colors, fonts, and styling.

## 📄 License

Part of Digital Fortress cybersecurity platform.

---

**Built with ❤️ for Digital Fortress**

