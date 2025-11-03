# Digital Fortress Backend API Documentation

Complete API documentation for all endpoints.

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url.onrender.com/api`

## Authentication

All endpoints that require authentication need a JWT token in the header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "token": "jwt_token_here"
  }
}
```

### POST /api/auth/login
Login user.

**Request:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### GET /api/auth/me
Get current user (Protected)

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

## 📡 Wi-Fi Defense

### POST /api/wifi_scan
Analyze Wi-Fi network security.

**Request:**
```json
{
  "ssid": "MyPublicWiFi",
  "encryption": "WPA2",
  "dns": "8.8.8.8",
  "activity": "bank_login"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "risk_score": 75,
    "risk_level": "high",
    "encryption": "WPA2",
    "dns": "8.8.8.8",
    "risk_factors": [
      "Critical: Banking or payment activity on public network"
    ],
    "data_exposure_awareness": "High risk: Your sensitive data may be exposed...",
    "ssid": "MyPublicWiFi"
  }
}
```

---

## 💬 Fraud Detection

### POST /api/detect_fraud
Detect fraud in messages/calls.

**Request:**
```json
{
  "text": "Your account has been suspended. Click here to verify: http://fake-bank.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "fraudulent",
    "confidence": 87,
    "fraud_score": 87,
    "risks": [
      "Urgency language detected",
      "Request for personal information",
      "Suspicious link patterns"
    ],
    "risky_keywords": ["verify", "account", "click", "link"],
    "recommendations": [
      "Do not click on any links",
      "Do not share personal information",
      "Report to cybercrime.gov.in",
      "Block the sender"
    ]
  }
}
```

---

## 🤖 AI Chatbot

### POST /api/chatbot
AI Cyber Guardian Chatbot.

**Request (Normal Mode):**
```json
{
  "query": "How to stay safe on public Wi-Fi?",
  "voiceCommandMode": false
}
```

**Response:**
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

**Request (Voice Command Mode):**
```json
{
  "query": "Scan Wi-Fi",
  "voiceCommandMode": true
}
```

**Response:**
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

**Supported Voice Commands:**
- "Scan Wi-Fi" / "Check Wi-Fi" → `wifi_scan`
- "Check message" / "Analyze message" → `detect_fraud`
- "Check link" / "Scan URL" → `url_scan`
- "Show scam list" → `get_scams`

---

## 🌐 URL Scan

### POST /api/url_scan
Scan URL for phishing/malware.

**Request:**
```json
{
  "url": "http://suspicious-site.tk/login/verify"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "risk_score": 85,
    "safe": false,
    "risk_level": "high",
    "reason": "High risk detected! Do not visit this URL...",
    "reasons": [
      "Contains suspicious keyword: login",
      "Uses risky TLD: .tk",
      "Contains suspicious keyword: verify"
    ],
    "url": "http://suspicious-site.tk/login/verify"
  }
}
```

---

## 🧾 Scam Database

### POST /api/add_scam
Add a scam to database.

**Request:**
```json
{
  "message": "Fake UPI payment request",
  "category": "UPI Fraud",
  "user": "Anonymous",
  "source": "Web App"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "message": "Fake UPI payment request",
    "category": "UPI Fraud",
    "riskLevel": "high",
    "reports": 1,
    "date": "2025-11-01"
  }
}
```

### GET /api/get_scams
Get all scams.

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Limit results (default: 100)

**Response:**
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

---

## 🔌 Browser Extension

### POST /api/extension/check_url
Fast URL check for browser extension.

**Request:**
```json
{
  "currentUrl": "http://suspicious-site.com",
  "userId": "optional_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isSafe": false,
    "riskScore": 75,
    "message": "⚠️ WARNING: High risk detected!",
    "reason": "Contains suspicious keyword: login",
    "reasons": ["..."],
    "url": "http://suspicious-site.com"
  }
}
```

### POST /api/extension/report_scam
Quick scam report from extension.

**Request:**
```json
{
  "url": "http://scam-site.com",
  "category": "Phishing",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scam reported successfully",
  "data": {
    "id": "...",
    "type": "Phishing",
    "date": "2025-11-01"
  }
}
```

---

## 🎙️ Senior Citizen Mode

### POST /api/senior/voice_command
Voice command handler for seniors.

**Request:**
```json
{
  "commandText": "Check Wi-Fi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I will check your Wi-Fi network safety. Please wait...",
    "action": "wifi_scan",
    "commandRecognized": true,
    "originalCommand": "Check Wi-Fi"
  }
}
```

**Supported Commands:**
- "Check Wi-Fi" / "Scan Wi-Fi"
- "Check message" / "Is message safe"
- "Check link" / "Is link safe"
- "Show scams"

---

## 📊 Statistics

### GET /api/stats
Get platform statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_scans": 0,
    "total_detections": 8,
    "total_scam_reports": 2375,
    "total_url_checks": 0,
    "scams_by_category": [...],
    "top_scam_categories": [
      {
        "category": "Bank Call",
        "reports": 512,
        "count": 1
      }
    ]
  }
}
```

---

## 🏥 Health Check

### GET /api/health
Check API status.

**Response:**
```json
{
  "success": true,
  "message": "Digital Fortress API is running",
  "timestamp": "2025-11-01T20:00:00.000Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Testing

### Seed Sample Data
```bash
npm run seed        # Seed users and posts
npm run seed-scams  # Seed scam database
```

### Test Endpoints
Use Postman or curl to test endpoints. Import `DIGITAL_FORTRESS_API.postman_collection.json` for ready-made requests.

---

## CORS Configuration

Allowed Origins:
- `http://localhost:8080`
- `http://localhost:5173`
- `https://digital-fortress-q6jn.vercel.app`
- `chrome-extension://*` (Browser extensions)

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Applies to**: All `/api/*` routes

---

## Deployment

Ready for Render deployment. Set environment variables:
- `PORT` (auto-set by Render)
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `FRONTEND_URL`
- `NODE_ENV=production`

