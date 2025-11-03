// Digital Fortress Content Script - Visual Indicators on Pages
(function() {
  'use strict';

  let currentRiskLevel = 'unknown';
  let scanIndicator = null;

  // Create visual indicator
  function createIndicator(riskLevel, data) {
    // Remove existing indicator
    if (scanIndicator) {
      scanIndicator.remove();
    }

    const indicator = document.createElement('div');
    indicator.id = 'digital-fortress-indicator';
    
    const colors = {
      safe: { bg: '#10b981', text: '#ffffff', label: 'Safe' },
      medium: { bg: '#f59e0b', text: '#ffffff', label: 'Caution' },
      danger: { bg: '#ef4444', text: '#ffffff', label: 'Danger' },
      unknown: { bg: '#6b7280', text: '#ffffff', label: 'Scanning...' },
    };

    const config = colors[riskLevel] || colors.unknown;

    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${config.bg};
        color: ${config.text};
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        animation: slideIn 0.3s ease-out;
      ">
        <span>🛡️</span>
        <span>${config.label}</span>
        ${riskLevel === 'danger' ? '<span style="margin-left: 8px;">⚠️</span>' : ''}
      </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      #digital-fortress-indicator:hover {
        transform: scale(1.05);
        transition: transform 0.2s;
      }
    `;
    document.head.appendChild(style);

    // Click to show details
    indicator.addEventListener('click', () => {
      showDetailsModal(data, riskLevel);
    });

    document.body.appendChild(indicator);
    scanIndicator = indicator;

    // Auto-hide after 5 seconds if safe, keep visible if danger
    if (riskLevel === 'safe') {
      setTimeout(() => {
        if (scanIndicator) {
          scanIndicator.style.opacity = '0';
          scanIndicator.style.transition = 'opacity 0.5s';
          setTimeout(() => {
            if (scanIndicator) {
              scanIndicator.remove();
              scanIndicator = null;
            }
          }, 500);
        }
      }, 5000);
    }
  }

  // Show details modal
  function showDetailsModal(data, riskLevel) {
    // Remove existing modal
    const existing = document.getElementById('digital-fortress-modal');
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'digital-fortress-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s;
    `;

    const colors = {
      safe: '#10b981',
      medium: '#f59e0b',
      danger: '#ef4444',
      unknown: '#6b7280',
    };

    modal.innerHTML = `
      <div style="
        background: #1f2937;
        color: #ffffff;
        padding: 24px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: slideUp 0.3s;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 20px; color: ${colors[riskLevel]};">🛡️ Digital Fortress</h2>
          <button id="close-modal" style="
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
          ">×</button>
        </div>
        <div style="margin-bottom: 16px;">
          <div style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">Risk Level</div>
          <div style="font-size: 32px; font-weight: bold; color: ${colors[riskLevel]};">
            ${riskLevel.toUpperCase()}
          </div>
        </div>
        ${data ? `
          <div style="margin-bottom: 16px;">
            <div style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">Risk Score</div>
            <div style="font-size: 24px; font-weight: bold;">${data.risk_score || 0}/100</div>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="font-size: 14px; color: #9ca3af; margin-bottom: 8px;">Analysis</div>
            <div style="font-size: 14px; line-height: 1.6;">${data.reason || 'No details available'}</div>
          </div>
        ` : ''}
        <button id="scan-again" style="
          width: 100%;
          padding: 12px;
          background: ${colors[riskLevel]};
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 16px;
        ">Scan Again</button>
      </div>
    `;

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from {
          transform: translateY(50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);

    // Close button
    document.getElementById('close-modal').addEventListener('click', () => {
      modal.remove();
    });

    // Scan again
    document.getElementById('scan-again').addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'SCAN_URL',
        url: window.location.href,
      });
      modal.remove();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Listen for scan results from background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SCAN_RESULT') {
      currentRiskLevel = request.riskLevel;
      createIndicator(request.riskLevel, request.result);
    }
  });

  // Initial scan on page load
  chrome.runtime.sendMessage({
    action: 'SCAN_URL',
    url: window.location.href,
  });
})();

