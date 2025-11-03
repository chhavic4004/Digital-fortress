# 🧪 How to Test Wi-Fi Defender

## ✅ Quick Test Steps

### Step 1: Make Sure Backend is Running

Open Terminal 1 (Backend):
```powershell
cd D:\coding\Digital-fortress\digital-fortress-backend
npm run dev
```

**Wait for:** `Server running in development mode on port 5000`

---

### Step 2: Make Sure Frontend is Running

Open Terminal 2 (Frontend):
```powershell
cd D:\coding\Digital-fortress
npm run dev
```

**Wait for:** `Local: http://localhost:8080/`

---

### Step 3: Open Wi-Fi Defender Page

1. Open your browser
2. Go to: **http://localhost:8080/wi-defend**
3. You should see the Wi-Fi Defender page with a form

---

## 🎯 Test Scenarios

### Test 1: Open/Unsecured Network (High Risk)

1. Fill in the form:
   - **SSID:** `Cafe_Free_WiFi`
   - **Encryption Type:** Select `None (Open Network)`
   - **DNS Server:** Leave blank or enter `192.168.1.1`
   - **Activity:** Select `Banking/Login`

2. Click **"Start Wi-Fi Scan"**

3. **Expected Results:**
   - ✅ Risk Level: **HIGH**
   - ✅ Risk Score: **85-95/100**
   - ✅ Encryption: **OPEN**
   - ✅ Detected Vulnerabilities: Shows badges like "No encryption", "DNS server not verified"
   - ✅ Possible Exposed Data: Shows badges like "Passwords", "OTPs", "Browsing History", "Account Numbers"
   - ✅ Recommendation: "Avoid using this Wi-Fi for sensitive activities..."

---

### Test 2: WPA2 Protected Network (Low Risk)

1. Fill in the form:
   - **SSID:** `MyHomeWiFi`
   - **Encryption Type:** Select `WPA2 (Recommended)`
   - **DNS Server:** Enter `8.8.8.8` (Google DNS)
   - **Activity:** Select `General browsing`

2. Click **"Start Wi-Fi Scan"**

3. **Expected Results:**
   - ✅ Risk Level: **LOW**
   - ✅ Risk Score: **20-30/100**
   - ✅ Encryption: **WPA2**
   - ✅ Certificate: **Valid** or **Unknown**
   - ✅ DNS Status: **Trusted**
   - ✅ Fewer or no exposed data badges
   - ✅ Recommendation: "Network appears relatively safe..."

---

### Test 3: Outdated WEP Network (High Risk)

1. Fill in the form:
   - **SSID:** `OldOfficeNetwork`
   - **Encryption Type:** Select `WEP (Outdated)`
   - **DNS Server:** Enter `10.0.0.1`
   - **Activity:** Select `Payments/Shopping`

2. Click **"Start Wi-Fi Scan"**

3. **Expected Results:**
   - ✅ Risk Level: **HIGH**
   - ✅ Risk Score: **80-90/100**
   - ✅ Encryption: **WEP**
   - ✅ Detected Vulnerabilities: "Weak WEP encryption"
   - ✅ Possible Exposed Data: "Passwords", "OTPs", etc.

---

## 🔍 What to Check

### Visual Elements:
- ✅ **Animated Progress Bar** appears during scan
- ✅ **Risk Level** displayed prominently (HIGH/MEDIUM/LOW)
- ✅ **Risk Score** shown as X/100
- ✅ **Network Name (SSID)** displayed at top
- ✅ **4 Security Detail Cards:** Encryption, Certificate, DNS Status, HTTP Security
- ✅ **Detected Vulnerabilities** section with red badges
- ✅ **Possible Exposed Data** section with outlined badges
- ✅ **Recommendation Card** at bottom (green border)
- ✅ **Two buttons:** "Scan Different Network" and "Scan Again"

### Data Accuracy:
- ✅ Different encryption types show different risk scores
- ✅ Public/open networks show HIGH risk
- ✅ Protected networks (WPA2/WPA3) show LOW risk
- ✅ Exposed data list changes based on network type
- ✅ Recommendations are context-specific

---

## 🐛 Troubleshooting

### Backend Not Responding?
```powershell
# Check if backend is running
curl http://localhost:5000/api/health
```

### Frontend Not Loading?
- Make sure frontend terminal shows "Local: http://localhost:8080/"
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private mode

### API Error?
- Check browser console (F12) for errors
- Verify backend is on port 5000
- Check CORS is configured correctly

---

## 🎯 Quick Test Command

You can also test the API directly:

```powershell
# Test high-risk network
curl -X POST http://localhost:5000/api/wifi_scan -H "Content-Type: application/json" -d '{\"ssid\":\"Cafe_WiFi\",\"encryption\":\"None\",\"dns\":\"192.168.1.1\",\"activity\":\"bank_login\"}'

# Test low-risk network
curl -X POST http://localhost:5000/api/wifi_scan -H "Content-Type: application/json" -d '{\"ssid\":\"HomeWiFi\",\"encryption\":\"WPA2\",\"dns\":\"8.8.8.8\",\"activity\":\"general\"}'
```

---

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 8080
- [ ] Can access http://localhost:8080/wi-defend
- [ ] Form appears with all fields
- [ ] Can fill in network details
- [ ] Progress bar animates during scan
- [ ] Results show correct format (risk level, score, exposed data, etc.)
- [ ] Different networks show different risk scores
- [ ] Badges display correctly for vulnerabilities and exposed data
- [ ] Recommendation card appears with context-specific advice

---

## 🎉 Ready to Test!

Follow the steps above and you should see the new comprehensive Wi-Fi Defender in action!

