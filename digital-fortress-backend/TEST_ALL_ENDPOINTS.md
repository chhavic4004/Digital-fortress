# 🧪 Complete Testing Guide - All Backend Endpoints

## Step 1: Restart Backend

First, make sure your backend is running with all new routes:

```bash
cd digital-fortress-backend

# Stop current server (Ctrl+C in terminal running backend)
# Then restart:
npm run dev
```

You should see:
```
MongoDB Connected: ...
Server running in development mode on port 5000
```

---

## Step 2: Test All Endpoints

### Option A: Quick Test Script

I'll create a test script you can run:

```bash
npm test
```

### Option B: Manual Testing (PowerShell/Command Line)

#### 1. Health Check ✅
```powershell
curl http://localhost:5000/api/health
```
**Expected:** `{"success":true,"message":"Digital Fortress API is running"}`

---

#### 2. Wi-Fi Scan 📡
```powershell
curl -X POST http://localhost:5000/api/wifi_scan `
  -H "Content-Type: application/json" `
  -d '{\"ssid\":\"PublicWiFi\",\"encryption\":\"WPA2\",\"dns\":\"8.8.8.8\",\"activity\":\"bank_login\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "risk_score": 75,
    "risk_level": "high",
    "encryption": "WPA2",
    "dns": "8.8.8.8",
    "risk_factors": ["Critical: Banking or payment activity on public network"],
    "data_exposure_awareness": "High risk: Your sensitive data may be exposed..."
  }
}
```

---

#### 3. Fraud Detection 💬
```powershell
curl -X POST http://localhost:5000/api/detect_fraud `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"Your account has been suspended. Click here immediately to verify: http://fake-bank.com/login\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "fraudulent",
    "confidence": 85,
    "fraud_score": 85,
    "risks": ["Urgency language detected", "Suspicious link patterns"],
    "recommendations": ["Do not click on any links", "Report to cybercrime.gov.in"]
  }
}
```

---

#### 4. AI Chatbot (Normal Mode) 🤖
```powershell
curl -X POST http://localhost:5000/api/chatbot `
  -H "Content-Type: application/json" `
  -d '{\"query\":\"How to stay safe on public Wi-Fi?\",\"voiceCommandMode\":false}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "response": "Public Wi-Fi networks can be risky. Always use a VPN...",
    "action": null,
    "voiceCommand": false
  }
}
```

---

#### 5. AI Chatbot (Voice Command Mode) 🎙️
```powershell
curl -X POST http://localhost:5000/api/chatbot `
  -H "Content-Type: application/json" `
  -d '{\"query\":\"Scan Wi-Fi\",\"voiceCommandMode\":true}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "response": "Understood! Executing: wifi scan",
    "action": "wifi_scan",
    "voiceCommand": true
  }
}
```

---

#### 6. URL Scan 🌐
```powershell
curl -X POST http://localhost:5000/api/url_scan `
  -H "Content-Type: application/json" `
  -d '{\"url\":\"http://suspicious-site.tk/login/verify\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "risk_score": 85,
    "safe": false,
    "risk_level": "high",
    "reason": "High risk detected! Do not visit this URL...",
    "reasons": ["Contains suspicious keyword: login", "Uses risky TLD: .tk"]
  }
}
```

---

#### 7. Add Scam to Database 🧾
```powershell
curl -X POST http://localhost:5000/api/add_scam `
  -H "Content-Type: application/json" `
  -d '{\"message\":\"Fake UPI payment request\",\"category\":\"UPI Fraud\",\"user\":\"TestUser\",\"source\":\"Web App\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "message": "Fake UPI payment request",
    "category": "UPI Fraud",
    "riskLevel": "high",
    "reports": 1
  }
}
```

---

#### 8. Get All Scams 📊
```powershell
curl http://localhost:5000/api/get_scams
```

**Expected Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "type": "UPI Fraud",
      "date": "2025-01-15",
      "risk": "high",
      "reports": 342
    }
  ]
}
```

**With Filter:**
```powershell
curl "http://localhost:5000/api/get_scams?category=UPI%20Fraud&limit=5"
```

---

#### 9. Browser Extension - Check URL 🔌
```powershell
curl -X POST http://localhost:5000/api/extension/check_url `
  -H "Content-Type: application/json" `
  -d '{\"currentUrl\":\"http://suspicious-site.com\",\"userId\":\"optional\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "isSafe": false,
    "riskScore": 75,
    "message": "⚠️ WARNING: High risk detected!",
    "reason": "Contains suspicious keyword: login"
  }
}
```

---

#### 10. Browser Extension - Report Scam 🚨
```powershell
curl -X POST http://localhost:5000/api/extension/report_scam `
  -H "Content-Type: application/json" `
  -d '{\"url\":\"http://scam-site.com\",\"category\":\"Phishing\",\"message\":\"Reported from extension\"}'
```

---

#### 11. Senior Citizen Voice Command 🎙️
```powershell
curl -X POST http://localhost:5000/api/senior/voice_command `
  -H "Content-Type: application/json" `
  -d '{\"commandText\":\"Check Wi-Fi\"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "response": "I will check your Wi-Fi network safety. Please wait...",
    "action": "wifi_scan",
    "commandRecognized": true
  }
}
```

---

#### 12. Statistics 📊
```powershell
curl http://localhost:5000/api/stats
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total_detections": 8,
    "total_scam_reports": 2375,
    "top_scam_categories": [...]
  }
}
```

---

## Step 3: Seed Sample Data

To populate scam database with sample data:

```bash
cd digital-fortress-backend
npm run seed-scams
```

This adds 8 sample scams matching your frontend format.

---

## Step 4: Test from Frontend

### Update Frontend API Calls

1. **Wi-Defend Page** (`src/pages/WiDefend.tsx`):
   Change the URL from:
   ```javascript
   "https://digital-fortress-backend.onrender.com/wifi_scan"
   ```
   To:
   ```javascript
   "http://localhost:5000/api/wifi_scan"
   ```

2. **Fraud Detector Page** (`src/pages/FraudDetector.tsx`):
   Add API call:
   ```javascript
   const response = await fetch('http://localhost:5000/api/detect_fraud', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ text: input })
   });
   const data = await response.json();
   setResult({
     status: data.data.status,
     confidence: data.data.confidence,
     risks: data.data.risks,
     recommendations: data.data.recommendations
   });
   ```

---

## Step 5: Use Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `DIGITAL_FORTRESS_API.postman_collection.json`

2. **Set Base URL:**
   - Click collection → Variables
   - Set `base_url` to `http://localhost:5000`

3. **Test All Requests:**
   - Run each request in the collection
   - Verify responses match expected format

---

## Step 6: Test Authentication Flow

1. **Register:**
   ```powershell
   curl -X POST http://localhost:5000/api/auth/register `
     -H "Content-Type: application/json" `
     -d '{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}'
   ```
   **Save the token from response!**

2. **Use Token:**
   ```powershell
   curl http://localhost:5000/api/auth/me `
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

---

## Quick Test Checklist

- [ ] Backend running on port 5000
- [ ] Health check works
- [ ] Wi-Fi scan returns correct format
- [ ] Fraud detection returns correct format
- [ ] Chatbot responds (normal + voice mode)
- [ ] URL scan detects risks
- [ ] Scam database (add + get works)
- [ ] Extension endpoints work
- [ ] Senior voice commands work
- [ ] Stats endpoint works
- [ ] Frontend can connect

---

## Troubleshooting

### "Cannot connect to server"
- Check backend is running: `curl http://localhost:5000/api/health`
- Check port 5000 is listening: `netstat -ano | findstr :5000`

### "Route not found"
- Verify routes are loaded in server.js
- Restart backend after adding routes

### "CORS error"
- Check CORS configuration in server.js
- Verify frontend URL is allowed

### Wrong response format
- Check endpoint implementation
- Verify request body format
- Check console for errors

---

## Expected Results Summary

All endpoints should return:
- ✅ `success: true` for success
- ✅ `data` object with response
- ✅ Error messages for failures
- ✅ Format matches frontend expectations

Your backend is fully functional! 🎉

