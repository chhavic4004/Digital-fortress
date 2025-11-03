import express from 'express';

const router = express.Router();

// @route   POST /api/wifi_scan
// @desc    Analyze Wi-Fi network security with comprehensive detection
// @access  Public
router.post('/wifi_scan', async (req, res) => {
  try {
    const { ssid, encryption, dns, activity, certificate, captivePortal, httpTest } = req.body;

    // Normalize encryption to match expected values (OPEN, WEP, WPA, WPA2, WPA3)
    let detectedEncryption = encryption || 'Unknown';
    if (encryption === 'None' || encryption === 'NONE' || encryption === 'Open' || encryption === 'OPEN') {
      detectedEncryption = 'OPEN';
    } else if (encryption === 'WEP') {
      detectedEncryption = 'WEP';
    } else if (encryption === 'WPA') {
      detectedEncryption = 'WPA';
    } else if (encryption === 'WPA2') {
      detectedEncryption = 'WPA2';
    } else if (encryption === 'WPA3') {
      detectedEncryption = 'WPA3';
    }

    // Calculate risk score (0-100)
    let riskScore = 0;
    const detectionReasons = [];
    const possibleExposedData = [];

    // Analyze encryption (40% weight)
    let encryptionScore = 50;
    if (detectedEncryption === 'OPEN' || detectedEncryption === 'NONE') {
      encryptionScore = 90;
      detectionReasons.push('No encryption');
      possibleExposedData.push('Passwords');
      possibleExposedData.push('OTPs');
      possibleExposedData.push('Browsing History');
      possibleExposedData.push('Account Numbers');
    } else if (detectedEncryption === 'WEP') {
      encryptionScore = 85;
      detectionReasons.push('Weak WEP encryption');
      possibleExposedData.push('Passwords');
      possibleExposedData.push('OTPs');
      possibleExposedData.push('Browsing History');
      possibleExposedData.push('Account Numbers');
    } else if (detectedEncryption === 'WPA') {
      encryptionScore = 60;
      detectionReasons.push('Outdated WPA encryption');
      possibleExposedData.push('Form Data');
    } else if (detectedEncryption === 'WPA2' || detectedEncryption === 'WPA3') {
      encryptionScore = 20;
    }

    riskScore += encryptionScore * 0.4;

    // Analyze DNS (20% weight)
    let dnsScore = 30;
    const trustedDNS = ['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']; // Google & Cloudflare
    let dnsStatus = 'trusted';
    
    if (!dns || dns === 'Unknown' || dns === 'System DNS') {
      dnsStatus = 'unknown';
      dnsScore = 40;
      detectionReasons.push('DNS server not verified');
      possibleExposedData.push('DNS Queries');
    } else if (dns.includes('192.168') || dns.includes('10.0') || dns.includes('172.16')) {
      dnsStatus = 'suspicious';
      dnsScore = 75;
      detectionReasons.push('DNS server not trusted');
      possibleExposedData.push('DNS Queries');
      possibleExposedData.push('Phishing Risk');
    } else if (trustedDNS.includes(dns.replace(/[^0-9.]/g, ''))) {
      dnsStatus = 'trusted';
      dnsScore = 10;
    } else {
      dnsStatus = 'unknown';
      dnsScore = 50;
      detectionReasons.push('DNS server not verified');
    }
    
    riskScore += dnsScore * 0.2;

    // Analyze certificate (20% weight)
    let certScore = 30;
    let certStatus = certificate || 'unknown';
    
    if (certStatus === 'invalid' || certStatus === 'Invalid' || certStatus === 'self-signed') {
      certScore = 85;
      detectionReasons.push('Invalid TLS certificate');
      possibleExposedData.push('Full Data Interception');
      possibleExposedData.push('Login Credentials');
      possibleExposedData.push('Banking Details');
    } else if (certStatus === 'valid' || certStatus === 'Valid') {
      certScore = 10;
      certStatus = 'valid';
    } else {
      certScore = 50;
      certStatus = 'unknown';
    }

    riskScore += certScore * 0.2;

    // Analyze captive portal (10% weight)
    let captiveScore = 10;
    if (captivePortal === true || captivePortal === 'detected') {
      captiveScore = 80;
      detectionReasons.push('Captive portal detected');
      possibleExposedData.push('Email/Phone Number');
      possibleExposedData.push('Registration Data');
    }
    riskScore += captiveScore * 0.1;

    // Analyze HTTP vs HTTPS (10% weight)
    let httpScore = 20;
    if (httpTest === false || httpTest === 'insecure') {
      httpScore = 70;
      detectionReasons.push('HTTP traffic detected (non-HTTPS)');
      possibleExposedData.push('Form Submissions');
      possibleExposedData.push('Session Cookies');
    }
    riskScore += httpScore * 0.1;

    // Activity-based adjustments
    if (activity && ['bank_login', 'payment', 'crypto'].includes(activity)) {
      if (!possibleExposedData.includes('Banking Details')) {
        possibleExposedData.push('Banking Details');
      }
      if (!possibleExposedData.includes('Payment Information')) {
        possibleExposedData.push('Payment Information');
      }
      riskScore = Math.min(95, riskScore + 15);
      detectionReasons.push('Sensitive activity detected');
    }

    // Finalize risk level
    let riskLevel = 'Low';
    if (riskScore >= 70) {
      riskLevel = 'High';
    } else if (riskScore >= 40) {
      riskLevel = 'Medium';
    }

    // Remove duplicates from exposed data
    const uniqueExposedData = [...new Set(possibleExposedData)];

    // Generate recommendation
    let recommendation = '';
    if (riskScore >= 70) {
      recommendation = 'Avoid using this Wi-Fi for sensitive activities. Use a VPN or mobile data instead.';
    } else if (riskScore >= 40) {
      recommendation = 'Exercise caution when accessing sensitive information. Use a VPN for banking or payments.';
    } else {
      recommendation = 'Network appears relatively safe, but always use VPN for sensitive activities.';
    }

    // If no detection reasons, add a neutral one
    if (detectionReasons.length === 0) {
      detectionReasons.push('Network security parameters checked');
    }

    // If no exposed data detected, add a safe message
    if (uniqueExposedData.length === 0 && riskScore < 40) {
      uniqueExposedData.push('No major data exposure detected');
    }

    res.json({
      success: true,
      ssid: ssid || 'Unknown Network',
      encryption: detectedEncryption,
      risk_score: Math.round(riskScore),
      risk_level: riskLevel,
      possible_exposed_data: uniqueExposedData,
      detection_reason: detectionReasons,
      recommendation: recommendation,
      // Additional details for frontend
      details: {
        dns_status: dnsStatus,
        certificate_status: certStatus,
        captive_portal: captivePortal === true || captivePortal === 'detected',
        http_security: httpTest !== false && httpTest !== 'insecure' ? 'HTTPS detected' : 'HTTP traffic detected',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze Wi-Fi network',
    });
  }
});

// @route   GET /api/auto_wifi_scan
// @desc    Auto Wi‑Fi scan via Flask enrichment (ipapi, dns.google, captive portal, AbuseIPDB, SSL Labs)
// @access  Public
router.get('/auto_wifi_scan', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const resp = await fetch('http://localhost:5001/api/auto_wifi_scan', {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      return res.json(data);
    }
    return res.status(resp.status).json({ success: false, error: 'Flask auto_wifi_scan error' });
  } catch (e) {
    return res.status(502).json({ success: false, error: 'auto_wifi_scan unavailable', detail: String(e) });
  }
});

export default router;

