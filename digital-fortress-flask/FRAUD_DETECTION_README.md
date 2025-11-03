# Multi-Source Fraud Detection API System

This module enhances Digital Fortress with a powerful fraud detection system that integrates multiple external security APIs to identify fraudulent or phishing URLs, messages, and domains in real-time.

## Features

- **Enhanced `/detect_fraud` Endpoint**: Combines local heuristic analysis with external API checks
- **Multiple API Integrations**:
  - Google Safe Browsing API
  - PhishTank / OpenPhish
  - WHOIS / RDAP for domain age checking
  - VirusTotal (optional)
- **Intelligent Scoring System**: Weighted combination of local and external signals
- **Privacy-Focused**: Only URLs are sent to external APIs, not full message content
- **Caching System**: Reduces API calls and improves response time
- **Async Support**: Optional async endpoint for background processing

## Setup

1. Copy `.env.sample` to `.env` and configure your API keys:
   ```
   cp .env.sample .env
   ```

2. Edit the `.env` file to add your API keys:
   ```
   GOOGLE_SAFE_BROWSING_KEY=your_key_here
   PHISHTANK_API=your_key_here
   VIRUSTOTAL_KEY=your_key_here
   ```

3. Install required dependencies:
   ```
   pip install -r requirements.txt
   ```

## API Endpoints

### POST `/api/detect_fraud`

Analyzes text for potential fraud by combining local heuristics with external API checks.

**Request:**
```json
{
  "text": "Click here to verify your account: http://suspicious-site.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fraud_score": 82,
    "risk_level": "High",
    "risky_keywords": ["verify", "click here", "account"],
    "external_sources": {
      "google_safe_browsing": "phishing",
      "phishtank": "confirmed",
      "whois": "new_domain (5 days old)"
    },
    "advice": "Do not click unknown links or share OTP/passwords.",
    "cached": false,
    "privacy_notice": "External APIs used only for URL reputation checks.",
    "risk_explanation": "Suspicious keywords in URL + google_safe_browsing: phishing + whois: new_domain (5 days old)"
  }
}
```

### POST `/api/detect_fraud_async`

Asynchronous version of the fraud detection endpoint for background processing.

### GET `/api/fraud_stats`

Returns usage statistics about the fraud detection system.

**Response:**
```json
{
  "success": true,
  "data": {
    "cache_stats": {
      "cached_items": 12,
      "cache_size_kb": 45.2
    },
    "api_usage": {
      "google_safe_browsing": {"calls": 24},
      "phishtank": {"calls": 18},
      "virustotal": {"calls": 5}
    }
  }
}
```

## Scoring System

The fraud detection system uses a weighted scoring approach:
- Local heuristics (keyword matching): 50%
- External reputation APIs: 30%
- Domain age factors: 20%

## Browser Extension Integration

To integrate with the browser extension:

1. Before a user opens a link, send it to the backend `/detect_fraud` endpoint
2. Show a browser pop-up alert for high-risk URLs:
   ```
   "⚠️ Suspicious Link — Risk Level: High (Phishing Site Detected via Google Safe Browsing). Proceed with Caution."
   ```

## Graceful Degradation

The system is designed to work even if some API integrations fail:
- Each API check is optional and modular
- If an external API fails, the system falls back to available data
- If all external APIs fail, the system uses only local heuristic analysis