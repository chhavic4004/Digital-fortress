// Digital Fortress Browser Extension - Background Service Worker
const API_BASE_URL = 'http://localhost:5001/api'; // Change to your backend URL in production

// Badge color mapping
const BADGE_COLORS = {
  safe: '#10b981',      // Green
  medium: '#f59e0b',     // Yellow
  danger: '#ef4444',     // Red
  unknown: '#6b7280',    // Gray
};

// Function to log deception events
async function logDeceptionEvent(url, scanData, riskLevel) {
  try {
    // Determine severity based on risk level
    let severity = 'Medium';
    if (riskLevel === 'danger') {
      severity = scanData.risk_score >= 80 ? 'Critical' : 'High';
    }

    // Determine protected items based on risk factors
    const protectedItems = [];
    if (scanData.reasons) {
      if (scanData.reasons.some(r => r.toLowerCase().includes('password') || r.toLowerCase().includes('login'))) {
        protectedItems.push('Passwords', 'Account Info');
      }
      if (scanData.reasons.some(r => r.toLowerCase().includes('payment') || r.toLowerCase().includes('bank'))) {
        protectedItems.push('Banking Details', 'Credit Card');
      }
      if (scanData.reasons.some(r => r.toLowerCase().includes('personal'))) {
        protectedItems.push('Personal Data');
      }
    }
    if (protectedItems.length === 0) {
      protectedItems.push('Other');
    }

    // Determine type
    let type = 'Suspicious Link';
    if (scanData.reasons?.some(r => r.toLowerCase().includes('phishing'))) {
      type = 'Phishing';
    } else if (scanData.reasons?.some(r => r.toLowerCase().includes('fake'))) {
      type = 'Fake Website';
    }

    const eventData = {
      title: `${type} Blocked - Suspicious Website`,
      summary: `Digital Fortress blocked access to a suspicious website. ${scanData.reason || 'Potential security threat detected.'}`,
      type: type,
      threat_source: url,
      protected_items: protectedItems,
      severity: severity,
      source: 'Browser Extension',
      timeline: {
        detection: {
          timestamp: new Date().toISOString(),
          method: 'Extension',
        },
        deception_deployed: {
          timestamp: new Date().toISOString(),
          action: 'Access blocked, user notified',
        },
        user_protected: {
          timestamp: new Date().toISOString(),
          result: 'User prevented from accessing dangerous site',
        },
      },
    };

    const response = await fetch(`${API_BASE_URL}/deceptions/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const result = await response.json();
    
    if (result.success) {
      // Show notification that event was logged
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: '🚨 Event Logged',
        message: 'Suspicious site details added to Awareness Feed',
        priority: 1,
      });
    }
  } catch (error) {
    console.error('Error logging deception event:', error);
    // Fail silently - don't interrupt user experience
  }
}

// Scan history storage
const STORAGE_KEY = 'digital_fortress_scans';

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Digital Fortress Extension Installed');
  chrome.action.setBadgeText({ text: '🛡️' });
  chrome.action.setBadgeBackgroundColor({ color: BADGE_COLORS.safe });
});

// Monitor URL changes and auto-scan
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Skip chrome://, edge://, extension://, etc.
    if (tab.url.startsWith('chrome://') || 
        tab.url.startsWith('edge://') || 
        tab.url.startsWith('moz-extension://') ||
        tab.url.startsWith('chrome-extension://')) {
      return;
    }

    // Auto-scan the URL
    await scanUrl(tab.url, tabId);
  }
});

// Scan URL function
async function scanUrl(url, tabId) {
  try {
    // Update badge to scanning state
    chrome.action.setBadgeText({ text: '...' });
    chrome.action.setBadgeBackgroundColor({ color: BADGE_COLORS.unknown });

    // Call backend API
    const response = await fetch(`${API_BASE_URL}/url_scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      const riskLevel = determineRiskLevel(data.data);
      
      // Update badge
      updateBadge(riskLevel, data.data);
      
      // Send message to content script
      chrome.tabs.sendMessage(tabId, {
        type: 'SCAN_RESULT',
        result: data.data,
        riskLevel: riskLevel,
      }).catch(() => {
        // Tab might not be ready yet
      });

      // Store in history
      await saveScanHistory(url, data.data, riskLevel);

      // Log to deception feed if dangerous
      if (riskLevel === 'danger' || riskLevel === 'medium') {
        logDeceptionEvent(url, data.data, riskLevel);
      }

      // Show notification for dangerous sites
      if (riskLevel === 'danger') {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: '⚠️ Dangerous Website Detected',
          message: `${data.data.reason || 'This website may be fraudulent or malicious.'}`,
          priority: 2,
        });
      }
    } else {
      // Error or unknown
      updateBadge('unknown', null);
    }
  } catch (error) {
    console.error('Error scanning URL:', error);
    updateBadge('unknown', null);
  }
}

// Determine risk level from backend response
function determineRiskLevel(data) {
  if (!data) return 'unknown';
  
  const riskScore = data.risk_score || 0;
  const isSafe = data.safe;
  
  // Check if URL is HTTP (insecure)
  const url = data.url || '';
  const isHttp = url.toLowerCase().startsWith('http://') && !url.toLowerCase().startsWith('https://');
  
  // HTTP sites should never be considered safe
  if (isHttp) {
    return riskScore >= 70 ? 'danger' : 'medium';
  }
  
  if (isSafe === true && riskScore < 30) {
    return 'safe';
  } else if (riskScore >= 70) {
    return 'danger';
  } else if (riskScore >= 30 || !isSafe) {
    return 'medium';
  } else {
    return 'safe';
  }
}

// Update badge based on risk level
function updateBadge(riskLevel, data) {
  const colors = {
    safe: BADGE_COLORS.safe,
    medium: BADGE_COLORS.medium,
    danger: BADGE_COLORS.danger,
    unknown: BADGE_COLORS.unknown,
  };

  const texts = {
    safe: '✓',
    medium: '!',
    danger: '⚠',
    unknown: '?',
  };

  chrome.action.setBadgeText({ text: texts[riskLevel] });
  chrome.action.setBadgeBackgroundColor({ color: colors[riskLevel] });
  
  // Store current status
  chrome.storage.local.set({ 
    currentRisk: riskLevel,
    currentData: data,
  });
}

// Save scan history
async function saveScanHistory(url, data, riskLevel) {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const history = result[STORAGE_KEY] || [];
    
    const scanEntry = {
      url: url,
      riskLevel: riskLevel,
      riskScore: data.risk_score || 0,
      reason: data.reason || 'No reason provided',
      timestamp: new Date().toISOString(),
    };

    // Add to beginning, limit to 100 entries
    history.unshift(scanEntry);
    if (history.length > 100) {
      history.pop();
    }

    await chrome.storage.local.set({ [STORAGE_KEY]: history });
  } catch (error) {
    console.error('Error saving scan history:', error);
  }
}

// Handle messages from popup/content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SCAN_URL') {
    scanUrl(request.url, sender.tab?.id).then(() => {
      sendResponse({ success: true });
    });
    return true; // Async response
  }

  if (request.action === 'GET_SCAN_HISTORY') {
    chrome.storage.local.get([STORAGE_KEY]).then((result) => {
      sendResponse({ history: result[STORAGE_KEY] || [] });
    });
    return true;
  }

  if (request.action === 'CLEAR_HISTORY') {
    chrome.storage.local.set({ [STORAGE_KEY]: [] }).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'ANALYZE_TEXT') {
    analyzeText(request.text).then((result) => {
      sendResponse(result);
    });
    return true;
  }
});

// Analyze text for fraud
async function analyzeText(text) {
  try {
    const response = await fetch(`${API_BASE_URL}/detect_fraud`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing text:', error);
    return { success: false, error: error.message };
  }
}

// Periodic health check (every 5 minutes)
chrome.alarms.create('healthCheck', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'healthCheck') {
    // Check if backend is reachable
    fetch(`${API_BASE_URL}/health`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.warn('Backend health check failed');
        }
      })
      .catch(err => {
        console.error('Backend unreachable:', err);
      });
  }
});

