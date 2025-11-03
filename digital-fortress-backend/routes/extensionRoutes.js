import express from 'express';
import Scam from '../models/Scam.js';

const router = express.Router();

// Use the same URL scan logic
const analyzeUrl = (url) => {
  let riskScore = 0;
  const reasons = [];
  const urlLower = url.toLowerCase();

  // Same logic as url_scan route
  const suspiciousKeywords = ['login', 'verify', 'account', 'update', 'confirm', 'secure', 'bank', 'payment'];
  suspiciousKeywords.forEach((keyword) => {
    if (urlLower.includes(keyword)) {
      riskScore += 10;
      reasons.push(`Contains suspicious keyword: ${keyword}`);
    }
  });

  const ipPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  if (ipPattern.test(url)) {
    riskScore += 40;
    reasons.push('URL contains IP address');
  }

  if (url.length > 100) {
    riskScore += 15;
    reasons.push('URL is unusually long');
  }

  const hyphenCount = (url.match(/-/g) || []).length;
  if (hyphenCount > 3) {
    riskScore += 20;
    reasons.push('Multiple hyphens in domain');
  }

  const riskyTLDs = ['.tk', '.xyz', '.top', '.ml', '.ga', '.cf', '.gq'];
  riskyTLDs.forEach((tld) => {
    if (urlLower.includes(tld)) {
      riskScore += 30;
      reasons.push(`Uses risky TLD: ${tld}`);
    }
  });

  riskScore = Math.min(riskScore, 100);
  const isSafe = riskScore < 40;

  return { riskScore, isSafe, reasons };
};

// @route   POST /api/extension/check_url
// @desc    Fast URL check for browser extension
// @access  Public
router.post('/extension/check_url', async (req, res) => {
  try {
    const { currentUrl, userId } = req.body;

    if (!currentUrl || currentUrl.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    // Fast analysis
    const { riskScore, isSafe, reasons } = analyzeUrl(currentUrl);

    let message = '';
    if (isSafe) {
      message = 'This website appears safe.';
    } else if (riskScore >= 70) {
      message = '⚠️ WARNING: High risk detected! This site may be unsafe.';
    } else {
      message = '⚠️ CAUTION: This site has some risk factors.';
    }

    res.json({
      success: true,
      data: {
        isSafe,
        riskScore: Math.round(riskScore),
        message,
        reason: reasons.length > 0 ? reasons[0] : 'No obvious risks',
        reasons,
        url: currentUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check URL',
    });
  }
});

// @route   POST /api/extension/report_scam
// @desc    Quick scam report from extension
// @access  Public
router.post('/extension/report_scam', async (req, res) => {
  try {
    const { url, category = 'Phishing', message } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required',
      });
    }

    // Create scam report
    const scam = await Scam.create({
      message: message || `Suspicious website reported: ${url}`,
      category,
      user: 'Browser Extension User',
      source: 'Browser Extension',
      riskLevel: 'high',
    });

    res.json({
      success: true,
      message: 'Scam reported successfully',
      data: {
        id: scam._id,
        type: scam.category,
        date: scam.date,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to report scam',
    });
  }
});

export default router;

