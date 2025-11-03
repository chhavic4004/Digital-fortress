// Digital Fortress Extension Popup Script
const API_BASE_URL = 'http://localhost:5001/api'; // Change in production

// DOM Elements
const scanCurrentBtn = document.getElementById('scan-current');
const scanUrlBtn = document.getElementById('scan-url');
const analyzeTextBtn = document.getElementById('analyze-text');
const urlInput = document.getElementById('url-input');
const textInput = document.getElementById('text-input');
const siteInfo = document.getElementById('site-info');
const resultsCard = document.getElementById('results-card');
const resultsContent = document.getElementById('results-content');
const viewHistoryBtn = document.getElementById('view-history');
const historyModal = document.getElementById('history-modal');
const historyList = document.getElementById('history-list');
const closeHistoryBtn = document.getElementById('close-history');
const clearHistoryBtn = document.getElementById('clear-history');
const closeResultsBtn = document.getElementById('close-results');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Load current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url) {
    loadCurrentSite(tab.url);
  }

  // Event Listeners
  scanCurrentBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url) {
      await scanUrlAction(tab.url);
    }
  });

  scanUrlBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
      scanUrlAction(url);
    }
  });

  analyzeTextBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text) {
      analyzeTextAction(text);
    }
  });

  viewHistoryBtn.addEventListener('click', () => {
    showHistory();
  });

  closeHistoryBtn.addEventListener('click', () => {
    historyModal.style.display = 'none';
  });

  closeResultsBtn.addEventListener('click', () => {
    resultsCard.style.display = 'none';
  });

  clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
  });

  // Enter key support
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      scanUrlBtn.click();
    }
  });

  textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      analyzeTextBtn.click();
    }
  });
});

// Load current site info
async function loadCurrentSite(url) {
  try {
    const result = await chrome.storage.local.get(['currentRisk', 'currentData']);
    
    siteInfo.innerHTML = `
      <div class="site-url">${truncateUrl(url)}</div>
      ${result.currentRisk ? `
        <div class="risk-badge ${result.currentRisk}">
          ${result.currentRisk.toUpperCase()}
          ${result.currentData?.risk_score ? ` - ${result.currentData.risk_score}/100` : ''}
        </div>
      ` : '<div class="loading">No scan data available</div>'}
    `;
  } catch (error) {
    console.error('Error loading current site:', error);
  }
}

// Scan URL
async function scanUrlAction(url) {
  try {
    siteInfo.innerHTML = '<div class="loading">Scanning...</div>';
    
    // Send message to background to scan
    chrome.runtime.sendMessage({
      action: 'SCAN_URL',
      url: url,
    });

    // Also call API directly for immediate result
    const response = await fetch(`${API_BASE_URL}/url_scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      displayResults(data.data, 'url');
      updateCurrentSite(url, data.data);
    } else {
      showError('Failed to scan URL');
    }
  } catch (error) {
    console.error('Error scanning URL:', error);
    showError('Error connecting to backend. Make sure it\'s running.');
  }
}

// Analyze text
async function analyzeTextAction(text) {
  try {
    resultsCard.style.display = 'block';
    resultsContent.innerHTML = '<div class="loading">Analyzing text...</div>';

    const response = await fetch(`${API_BASE_URL}/detect_fraud`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      displayResults(data.data, 'text');
    } else {
      showError('Failed to analyze text');
    }
  } catch (error) {
    console.error('Error analyzing text:', error);
    showError('Error connecting to backend.');
  }
}

// Display results
function displayResults(data, type) {
  const riskLevel = type === 'url' 
    ? (data.safe === true ? 'safe' : data.risk_score >= 70 ? 'danger' : data.risk_score >= 40 ? 'medium' : 'safe')
    : (data.level === 'high' ? 'danger' : data.level === 'medium' ? 'medium' : 'safe');

  resultsContent.innerHTML = `
    <div class="result-item">
      <div class="result-label">Risk Level</div>
      <div class="result-value risk-badge ${riskLevel}">${riskLevel.toUpperCase()}</div>
    </div>
    ${data.risk_score !== undefined ? `
      <div class="result-item">
        <div class="result-label">Risk Score</div>
        <div class="result-value">${data.risk_score}/100</div>
      </div>
    ` : ''}
    ${data.confidence !== undefined ? `
      <div class="result-item">
        <div class="result-label">Confidence</div>
        <div class="result-value">${data.confidence}%</div>
      </div>
    ` : ''}
    ${data.reason ? `
      <div class="result-item">
        <div class="result-label">Analysis</div>
        <div class="result-value" style="font-size: 12px; font-weight: normal;">${data.reason}</div>
      </div>
    ` : ''}
    ${data.risky_keywords ? `
      <div class="result-item">
        <div class="result-label">Risky Keywords</div>
        <div class="result-value" style="font-size: 12px;">
          ${data.risky_keywords.map(kw => `<span class="risk-badge medium" style="margin-right: 4px; margin-top: 4px; display: inline-block;">${kw}</span>`).join('')}
        </div>
      </div>
    ` : ''}
    ${data.advice ? `
      <div class="result-item">
        <div class="result-label">Recommendation</div>
        <div class="result-value" style="font-size: 12px; font-weight: normal;">${data.advice}</div>
      </div>
    ` : ''}
  `;

  resultsCard.style.display = 'block';
}

// Update current site display
function updateCurrentSite(url, data) {
  const riskLevel = data.safe === true ? 'safe' : data.risk_score >= 70 ? 'danger' : data.risk_score >= 40 ? 'medium' : 'safe';
  
  siteInfo.innerHTML = `
    <div class="site-url">${truncateUrl(url)}</div>
    <div class="risk-badge ${riskLevel}">
      ${riskLevel.toUpperCase()} - ${data.risk_score || 0}/100
    </div>
  `;
}

// Show history
async function showHistory() {
  historyModal.style.display = 'flex';
  
  try {
    const response = await chrome.runtime.sendMessage({ action: 'GET_SCAN_HISTORY' });
    const history = response?.history || [];

    if (history.length === 0) {
      historyList.innerHTML = '<div class="loading">No scan history yet</div>';
      return;
    }

    historyList.innerHTML = history.map(item => `
      <div class="history-item ${item.riskLevel}">
        <div class="history-url">${truncateUrl(item.url)}</div>
        <div class="history-meta">
          <span>${item.riskLevel.toUpperCase()} (${item.riskScore}/100)</span>
          <span>${formatDate(item.timestamp)}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading history:', error);
    historyList.innerHTML = '<div class="loading">Error loading history</div>';
  }
}

// Clear history
async function clearHistory() {
  if (confirm('Are you sure you want to clear all scan history?')) {
    await chrome.runtime.sendMessage({ action: 'CLEAR_HISTORY' });
    historyList.innerHTML = '<div class="loading">History cleared</div>';
    setTimeout(() => {
      historyModal.style.display = 'none';
    }, 1000);
  }
}

// Show error
function showError(message) {
  resultsContent.innerHTML = `
    <div class="result-item">
      <div class="result-value" style="color: #ef4444;">⚠️ ${message}</div>
    </div>
  `;
  resultsCard.style.display = 'block';
}

// Helper functions
function truncateUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname.substring(0, 30);
  } catch {
    return url.substring(0, 50);
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

