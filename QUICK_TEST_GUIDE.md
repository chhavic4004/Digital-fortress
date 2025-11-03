# ⚡ Quick Testing Guide

## 🚀 Fastest Way to Test Everything

### Step 1: Start Backend
```bash
cd digital-fortress-backend
npm run dev
```

### Step 2: Run Automated Tests
```bash
# In a new terminal, same directory:
npm run test-all
```

This will test ALL endpoints automatically and show you which ones pass/fail!

---

## 🧪 Manual Testing (One by One)

### 1. Health Check ✅
Open in browser: **http://localhost:5000/api/health**

### 2. Wi-Fi Scan 📡
**Browser Test:**
- Open: http://localhost:5000/api/wifi_scan
- Should show "Method not allowed" (GET not allowed, need POST)

**Use Postman or run:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/wifi_scan" -Method POST -ContentType "application/json" -Body '{"ssid":"TestWiFi","encryption":"WPA2","dns":"8.8.8.8","activity":"bank_login"}'
```

### 3. Fraud Detection 💬
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/detect_fraud" -Method POST -ContentType "application/json" -Body '{"text":"Your account suspended. Click to verify"}'
```

### 4. URL Scan 🌐
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/url_scan" -Method POST -ContentType "application/json" -Body '{"url":"http://suspicious-site.tk/login"}'
```

### 5. Get Scams 📊
Open in browser: **http://localhost:5000/api/get_scams**

### 6. Statistics 📈
Open in browser: **http://localhost:5000/api/stats**

---

## 🌐 Test from Frontend

### Update WiDefend.tsx:
```typescript
const response = await fetch('http://localhost:5000/api/wifi_scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ssid: 'MyPublicWiFi',
    encryption: 'WPA2',
    dns: '8.8.8.8',
    activity: 'bank_login'
  })
});
const data = await response.json();
setResult({
  riskLevel: data.data.risk_level?.toLowerCase() || 'unknown',
  encryption: data.data.encryption || 'WPA2',
  dnsSafety: data.data.dns || 'Secure',
  certificate: 'Valid',
  exposedData: data.data.risk_factors?.length 
    ? data.data.risk_factors 
    : ['No major data exposure detected']
});
```

### Update FraudDetector.tsx:
```typescript
const analyzeMessage = async () => {
  setAnalyzing(true);
  try {
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
  } catch (error) {
    setResult({
      status: 'error',
      confidence: 0,
      risks: ['Failed to analyze'],
      recommendations: ['Please try again']
    });
  }
  setAnalyzing(false);
};
```

---

## ✅ Verification Checklist

After running tests, verify:

- [ ] Health check returns success
- [ ] Wi-Fi scan returns risk_level, encryption, dns, risk_factors
- [ ] Fraud detection returns status, confidence, risks, recommendations  
- [ ] Chatbot responds (both modes)
- [ ] URL scan returns risk_score, safe, reason
- [ ] Scam database (add + get work)
- [ ] Extension endpoints respond
- [ ] Stats endpoint works
- [ ] Frontend can connect and display results

---

## 🐛 Common Issues

**"Cannot connect"**
→ Check backend is running: `curl http://localhost:5000/api/health`

**"Route not found"**
→ Restart backend server

**"CORS error"**
→ Already configured, should work. Check browser console.

**Wrong data format**
→ Check response matches frontend expectations

---

## 📊 Expected Results

All endpoints should return:
```json
{
  "success": true,
  "data": { ... }
}
```

Test script will show you exactly what's working! 🎉

