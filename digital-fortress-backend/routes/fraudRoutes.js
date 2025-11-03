import express from 'express';

const router = express.Router();

// @route   POST /api/detect_fraud
// @desc    Detect fraud in messages/calls
// @access  Public
router.post('/detect_fraud', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text is required',
      });
    }

    // First, try enhanced detection via Flask backend
    try {
      const flaskUrl = process.env.FLASK_API_URL || 'http://localhost:5001/api';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const resp = await fetch(`${flaskUrl}/detect_fraud`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.success && data.data) {
          const enriched = data.data;
          const riskLevel = (enriched.risk_level || '').toLowerCase();
          const status = riskLevel === 'high' ? 'fraudulent' : riskLevel === 'medium' ? 'suspicious' : 'safe';
          const risks = [];
          if (enriched.external_sources) {
            for (const [k, v] of Object.entries(enriched.external_sources)) {
              risks.push(`${k}: ${v}`);
            }
          }
          if (Array.isArray(enriched.risky_keywords) && enriched.risky_keywords.length) {
            risks.push(`risky_keywords: ${enriched.risky_keywords.join(', ')}`);
          }
          // Heuristic source augmentation (HTTP link and risky keywords)
          const extSources = { ...(enriched.external_sources || {}) };
          if (typeof text === 'string' && text.toLowerCase().includes('http://')) {
            extSources.heuristic = extSources.heuristic
              ? `${extSources.heuristic}; insecure http link`
              : 'insecure http link';
          }
          if (Array.isArray(enriched.risky_keywords) && enriched.risky_keywords.length) {
            const kw = enriched.risky_keywords.slice(0, 5).join(', ');
            extSources.heuristic = extSources.heuristic
              ? `${extSources.heuristic}; suspicious keywords: ${kw}`
              : `suspicious keywords: ${kw}`;
          }

          const mapped = {
            status,
            confidence: Math.round(enriched.fraud_score ?? 0),
            fraud_score: Math.round(enriched.fraud_score ?? 0),
            risks: risks.length ? risks : ['No obvious risks detected'],
            risky_keywords: enriched.risky_keywords || [],
            recommendations: status === 'safe'
              ? ['Message appears safe, but stay vigilant', 'Always verify before sharing sensitive information']
              : [
                  'Do not click on any links',
                  'Do not share personal information',
                  ...(status === 'fraudulent' ? ['Report to cybercrime.gov.in', 'Block the sender'] : []),
                  'Verify the sender through official channels',
                ],
            // Include original enriched fields for advanced UIs
            risk_level: enriched.risk_level,
            external_sources: extSources,
            advice: enriched.advice,
            cached: enriched.cached,
            privacy_notice: enriched.privacy_notice,
            risk_explanation: enriched.risk_explanation,
          };
          return res.json({ success: true, data: mapped, proxied: true });
        }
      }
    } catch (e) {
      // Fallback to local heuristic below on error/timeout
    }

    const textLower = text.toLowerCase();
    let fraudScore = 0;
    const risks = [];
    const riskyKeywords = [];

    // Phishing keywords
    const phishingKeywords = [
      'kyc',
      'otp',
      'verify',
      'bank',
      'account',
      'suspend',
      'block',
      'urgent',
      'immediate',
      'click here',
      'verify now',
      'expired',
      'update',
      'confirm',
      'security',
      'fraud',
      'unauthorized',
      'suspicious',
      'link',
      'login',
    ];

    // High-risk keywords
    const highRiskKeywords = [
      'kyc',
      'otp',
      'suspend',
      'block',
      'expired',
      'unauthorized',
      'verify now',
      'click here',
    ];

    // Check for risky keywords
    phishingKeywords.forEach((keyword) => {
      if (textLower.includes(keyword)) {
        riskyKeywords.push(keyword);
        if (highRiskKeywords.includes(keyword)) {
          fraudScore += 15;
        } else {
          fraudScore += 5;
        }
      }
    });

    // Urgency detection
    const urgencyWords = ['urgent', 'immediate', 'asap', 'now', 'today', 'expired'];
    if (urgencyWords.some((word) => textLower.includes(word))) {
      fraudScore += 20;
      risks.push('Urgency language detected');
    }

    // Personal information requests
    const personalInfoWords = ['verify', 'confirm', 'update', 'provide', 'share'];
    if (personalInfoWords.some((word) => textLower.includes(word))) {
      fraudScore += 25;
      risks.push('Request for personal information');
    }

    // Suspicious link patterns
    if (textLower.includes('http') || textLower.includes('www.') || textLower.includes('.in/') || textLower.includes('.com/')) {
      fraudScore += 20;
      risks.push('Suspicious link patterns');
    }

    // Unusual sender patterns (check for common scam patterns)
    if (textLower.includes('gov.in') || textLower.includes('bank') || textLower.includes('upi')) {
      fraudScore += 10;
      risks.push('Unusual sender domain');
    }

    // Cap fraud score at 100
    fraudScore = Math.min(fraudScore, 100);

    // Determine status
    let status = 'safe';
    if (fraudScore >= 70) {
      status = 'fraudulent';
    } else if (fraudScore >= 40) {
      status = 'suspicious';
    }

    // Generate recommendations
    const recommendations = [];
    if (status !== 'safe') {
      recommendations.push('Do not click on any links');
      recommendations.push('Do not share personal information');
      if (status === 'fraudulent') {
        recommendations.push('Report to cybercrime.gov.in');
        recommendations.push('Block the sender');
      }
      recommendations.push('Verify the sender through official channels');
    } else {
      recommendations.push('Message appears safe, but stay vigilant');
      recommendations.push('Always verify before sharing sensitive information');
    }

    res.json({
      success: true,
      data: {
        status,
        confidence: Math.round(fraudScore),
        fraud_score: Math.round(fraudScore),
        risks: risks.length > 0 ? risks : ['No obvious risks detected'],
        risky_keywords: riskyKeywords,
        recommendations,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to detect fraud',
    });
  }
});

export default router;

