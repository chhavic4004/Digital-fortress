import express from 'express';

const router = express.Router();

// @route   POST /api/url_scan
// @desc    Scan URL for phishing/malware
// @access  Public
router.post('/url_scan', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    let riskScore = 0;
    const reasons = [];
    const urlLower = url.toLowerCase();

    // Check for HTTP (insecure) vs HTTPS (secure)
    if (urlLower.startsWith('http://') && !urlLower.startsWith('https://')) {
      riskScore += 50; // Major risk - HTTP is unencrypted
      reasons.push('Website uses HTTP (unencrypted) - data can be intercepted');
    } else if (urlLower.startsWith('https://')) {
      // HTTPS is secure, but still check other factors
      // No penalty for HTTPS
    } else {
      // No protocol specified, assume HTTP as default risk
      riskScore += 20;
      reasons.push('Protocol not specified - assuming HTTP (unencrypted)');
    }

    // Check for suspicious keywords
    const suspiciousKeywords = ['login', 'verify', 'account', 'update', 'confirm', 'secure', 'bank', 'payment'];
    suspiciousKeywords.forEach((keyword) => {
      if (urlLower.includes(keyword)) {
        riskScore += 10;
        reasons.push(`Contains suspicious keyword: ${keyword}`);
      }
    });

    // Check for IP-based domains (common in phishing)
    const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipPattern.test(url)) {
      riskScore += 40;
      reasons.push('URL contains IP address instead of domain name');
    }

    // Check for long URLs (suspicious)
    if (url.length > 100) {
      riskScore += 15;
      reasons.push('URL is unusually long');
    }

    // Check for hyphenated domains
    const hyphenCount = (url.match(/-/g) || []).length;
    if (hyphenCount > 3) {
      riskScore += 20;
      reasons.push('Multiple hyphens in domain (suspicious pattern)');
    }

    // Check for risky TLDs
    const riskyTLDs = ['.tk', '.xyz', '.top', '.ml', '.ga', '.cf', '.gq'];
    riskyTLDs.forEach((tld) => {
      if (urlLower.includes(tld)) {
        riskScore += 30;
        reasons.push(`Uses risky TLD: ${tld}`);
      }
    });

    // Check for suspicious subdomains
    if (urlLower.includes('verify-') || urlLower.includes('secure-') || urlLower.includes('update-')) {
      riskScore += 25;
      reasons.push('Suspicious subdomain detected');
    }

    // Check for common phishing patterns
    if (urlLower.includes('bit.ly') || urlLower.includes('tinyurl') || urlLower.includes('short.link')) {
      riskScore += 15;
      reasons.push('URL shortener detected (cannot verify destination)');
    }

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);

    // Determine safety (HTTP sites should never be fully safe)
    // Even if riskScore is low, HTTP sites should show at least medium risk
    const isHttp = urlLower.startsWith('http://') && !urlLower.startsWith('https://');
    
    // Force HTTP sites to at least medium risk (minimum 40)
    if (isHttp && riskScore < 40) {
      riskScore = 40; // Minimum medium risk for HTTP
    }
    
    let isSafe = riskScore < 40 && !isHttp; // HTTP sites are never "safe"
    let riskLevel = 'low';
    if (riskScore >= 70) {
      riskLevel = 'high';
    } else if (riskScore >= 40) {
      riskLevel = 'medium';
    } else if (isHttp) {
      // HTTP sites should always be at least medium
      riskLevel = 'medium';
      isSafe = false;
    }

    // Generate reason message
    let reasonMessage = '';
    if (isSafe) {
      reasonMessage = 'URL appears safe, but always verify before entering credentials.';
    } else if (riskLevel === 'high') {
      reasonMessage = 'High risk detected! Do not visit this URL. It may be a phishing site.';
    } else {
      reasonMessage = 'Medium risk detected. Exercise caution when visiting this URL.';
    }

    res.json({
      success: true,
      data: {
        risk_score: Math.round(riskScore),
        safe: isSafe,
        risk_level: riskLevel,
        reason: reasonMessage,
        reasons: reasons.length > 0 ? reasons : ['No obvious risks detected'],
        url,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to scan URL',
    });
  }
});

export default router;

