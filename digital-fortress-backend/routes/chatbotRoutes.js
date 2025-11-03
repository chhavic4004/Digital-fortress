import express from 'express';

const router = express.Router();

// Voice command mapping
const voiceCommands = {
  'scan wi-fi': 'wifi_scan',
  'scan wifi': 'wifi_scan',
  'check wi-fi': 'wifi_scan',
  'check wifi': 'wifi_scan',
  'scan network': 'wifi_scan',
  'check message': 'detect_fraud',
  'analyze message': 'detect_fraud',
  'check text': 'detect_fraud',
  'check link': 'url_scan',
  'scan url': 'url_scan',
  'check url': 'url_scan',
  'check website': 'url_scan',
  'show scam': 'get_scams',
  'show scam list': 'get_scams',
  'list scams': 'get_scams',
  'scam database': 'get_scams',
  'show awareness feed': 'awareness_feed',
  'awareness feed': 'awareness_feed',
  'show protection events': 'awareness_feed',
  'recent threats': 'awareness_feed',
  'protection feed': 'awareness_feed',
};

// Normal chatbot responses
const chatbotResponses = {
  wifi: [
    'Public Wi-Fi networks can be risky. Always use a VPN when connecting to public networks.',
    'Never access banking or payment apps on public Wi-Fi without a VPN.',
    'Look for networks with WPA2 or WPA3 encryption for better security.',
  ],
  phishing: [
    'Be cautious of emails asking for personal information or urgent action.',
    'Never click links in suspicious emails. Type the website URL manually.',
    'Banks and official services never ask for OTP or passwords via email.',
  ],
  otp: [
    'Never share your OTP with anyone, even if they claim to be from your bank.',
    'Legitimate services will never ask for your OTP over phone or email.',
    'If someone asks for OTP, it\'s definitely a scam. End the call immediately.',
  ],
  default: [
    'I can help you with Wi-Fi security, phishing detection, OTP scams, and more.',
    'Ask me about public Wi-Fi safety, email scams, or how to protect yourself online.',
    'Use voice commands like "Scan Wi-Fi" or "Check message" for quick actions.',
  ],
};

// @route   POST /api/chatbot
// @desc    AI Cyber Guardian Chatbot
// @access  Public
router.post('/chatbot', async (req, res) => {
  try {
    const { query, voiceCommandMode } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query is required',
      });
    }

    const queryLower = query.toLowerCase().trim();

    // Voice command mode
    if (voiceCommandMode === true || voiceCommandMode === 'true') {
      // Check if query matches any voice command
      for (const [command, action] of Object.entries(voiceCommands)) {
        if (queryLower.includes(command)) {
          // Execute integrated actions for wifi_scan and detect_fraud
          if (action === 'wifi_scan') {
            try {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 5000);
              const resp = await fetch('http://localhost:5000/api/auto_wifi_scan', { method: 'GET', signal: controller.signal });
              clearTimeout(timeout);
              if (resp.ok) {
                const j = await resp.json();
                const d = j.data || {};
                const level = (d.risk_level || 'Low');
                const score = Math.round(d.risk_score || 0);
                const exposed = Array.isArray(d.possible_exposed_data) && d.possible_exposed_data.length
                  ? `It may expose ${d.possible_exposed_data.slice(0,3).join(', ')}.`
                  : '';
                return res.json({
                  success: true,
                  data: {
                    response: `Wi‑Defend scan complete. Risk level ${level} (${score}/100). ${exposed}`.trim(),
                    action: action,
                    voiceCommand: true,
                    result: d,
                  },
                });
              }
            } catch (_) {}
            return res.json({
              success: true,
              data: {
                response: 'Starting Wi‑Defend. Opening the Wi‑Defend page for details…',
                action: action,
                voiceCommand: true,
              },
            });
          }

          if (action === 'detect_fraud') {
            // Try to extract text or URL from the query
            const matchQuoted = query.match(/"([^"]+)"/);
            const textCandidate = matchQuoted ? matchQuoted[1] : query;
            const hasUrl = /https?:\/\//i.test(textCandidate);
            if (textCandidate && (hasUrl || textCandidate.split(' ').length > 2)) {
              try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 6000);
                const resp = await fetch('http://localhost:5000/api/detect_fraud', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: textCandidate }),
                  signal: controller.signal,
                });
                clearTimeout(timeout);
                if (resp.ok) {
                  const j = await resp.json();
                  const d = j.data || {};
                  const level = (d.risk_level || d.status || 'Low');
                  const score = Math.round(d.fraud_score || d.confidence || 0);
                  const src = d.external_sources ? Object.keys(d.external_sources).slice(0,2).join(', ') : '';
                  return res.json({
                    success: true,
                    data: {
                      response: `Fraud check done. Risk ${String(level).toUpperCase()} (${score}/100). ${src ? 'Sources: ' + src + '.' : ''}`.trim(),
                      action: action,
                      voiceCommand: true,
                      result: d,
                    },
                  });
                }
              } catch (_) {}
            }
            return res.json({
              success: true,
              data: {
                response: 'Say or paste the message or link you want me to check. For example: "check message: http://example.com/login"',
                action: action,
                voiceCommand: true,
              },
            });
          }

          // Default: acknowledge and let the UI navigate
          return res.json({
            success: true,
            data: {
              response: `Understood! Executing: ${action.replace('_', ' ')}`,
              action: action,
              voiceCommand: true,
            },
          });
        }
      }

      // If no specific command matched, provide general response
      return res.json({
        success: true,
        data: {
          response: 'I can help you scan Wi-Fi, check messages, scan URLs, show scam database, or view awareness feed. Try saying "Scan Wi-Fi", "Check message", or "Show awareness feed".',
          action: null,
          voiceCommand: true,
        },
      });
    }

    // Normal chatbot mode
    let response = '';
    if (queryLower.includes('wifi') || queryLower.includes('network') || queryLower.includes('wi-fi')) {
      response = chatbotResponses.wifi[Math.floor(Math.random() * chatbotResponses.wifi.length)];
    } else if (queryLower.includes('phishing') || queryLower.includes('email') || queryLower.includes('scam email')) {
      response = chatbotResponses.phishing[Math.floor(Math.random() * chatbotResponses.phishing.length)];
    } else if (queryLower.includes('otp') || queryLower.includes('one time password')) {
      response = chatbotResponses.otp[Math.floor(Math.random() * chatbotResponses.otp.length)];
    } else {
      response = chatbotResponses.default[Math.floor(Math.random() * chatbotResponses.default.length)];
    }

    res.json({
      success: true,
      data: {
        response,
        action: null,
        voiceCommand: false,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Chatbot error',
    });
  }
});

export default router;

