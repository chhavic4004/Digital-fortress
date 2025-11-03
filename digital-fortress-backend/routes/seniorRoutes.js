import express from 'express';

const router = express.Router();

// Voice command mapping for seniors
const seniorVoiceCommands = {
  // Wi-Fi commands
  'check wi-fi': 'wifi_scan',
  'scan wi-fi': 'wifi_scan',
  'check wifi': 'wifi_scan',
  'is wifi safe': 'wifi_scan',
  'check network': 'wifi_scan',

  // Message commands
  'check message': 'detect_fraud',
  'is message safe': 'detect_fraud',
  'check text': 'detect_fraud',
  'analyze message': 'detect_fraud',

  // URL commands
  'check link': 'url_scan',
  'is link safe': 'url_scan',
  'check website': 'url_scan',
  'scan url': 'url_scan',

  // Scam database
  'show scams': 'get_scams',
  'list scams': 'get_scams',
  'scam database': 'get_scams',
};

// Simple responses for seniors
const seniorResponses = {
  wifi_scan: {
    response: 'I will check your Wi-Fi network safety. Please wait...',
    action: 'wifi_scan',
  },
  detect_fraud: {
    response: 'I will analyze your message for fraud. Please share the message...',
    action: 'detect_fraud',
  },
  url_scan: {
    response: 'I will check if the website is safe. Please provide the website address...',
    action: 'url_scan',
  },
  get_scams: {
    response: 'I will show you the list of reported scams...',
    action: 'get_scams',
  },
};

// @route   POST /api/senior/voice_command
// @desc    Voice command handler for senior citizens
// @access  Public
router.post('/senior/voice_command', async (req, res) => {
  try {
    const { commandText } = req.body;

    if (!commandText || commandText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Command text is required',
      });
    }

    const commandLower = commandText.toLowerCase().trim();

    // Check for matching voice command
    for (const [command, action] of Object.entries(seniorVoiceCommands)) {
      if (commandLower.includes(command)) {
        const response = seniorResponses[action];
        return res.json({
          success: true,
          data: {
            response: response.response,
            action: response.action,
            commandRecognized: true,
            originalCommand: commandText,
          },
        });
      }
    }

    // If no command matched, provide helpful response
    res.json({
      success: true,
      data: {
        response: 'I can help you check Wi-Fi safety, analyze messages, scan websites, or show scam database. Try saying "Check Wi-Fi" or "Check message".',
        action: null,
        commandRecognized: false,
        originalCommand: commandText,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Voice command error',
    });
  }
});

export default router;

