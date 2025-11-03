// Comprehensive test script for all endpoints
// Run: node test-all-endpoints.js

const API_BASE = 'http://localhost:5000/api';

// Colors for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function
async function testRequest(name, endpoint, options = {}) {
  try {
    log(`\n🧪 Testing: ${name}`, 'cyan');
    log(`   ${endpoint}`, 'blue');

    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      log(`   ✅ PASS`, 'green');
      if (data.data) {
        log(`   Response: ${JSON.stringify(data.data).substring(0, 100)}...`, 'yellow');
      }
      return { success: true, data };
    } else {
      log(`   ❌ FAIL: ${data.message || 'Unknown error'}`, 'red');
      return { success: false, error: data.message };
    }
  } catch (error) {
    log(`   ❌ ERROR: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  log('\n🚀 Starting Complete Backend API Tests\n', 'cyan');
  log('='.repeat(60), 'cyan');

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Health Check
  const health = await testRequest('Health Check', '/health', { method: 'GET' });
  results.tests.push({ name: 'Health Check', ...health });
  if (health.success) results.passed++;
  else results.failed++;

  // Test 2: Wi-Fi Scan
  const wifi = await testRequest('Wi-Fi Scan', '/wifi_scan', {
    method: 'POST',
    body: JSON.stringify({
      ssid: 'PublicWiFi',
      encryption: 'WPA2',
      dns: '8.8.8.8',
      activity: 'bank_login',
    }),
  });
  results.tests.push({ name: 'Wi-Fi Scan', ...wifi });
  if (wifi.success) results.passed++;
  else results.failed++;

  // Test 3: Fraud Detection
  const fraud = await testRequest('Fraud Detection', '/detect_fraud', {
    method: 'POST',
    body: JSON.stringify({
      text: 'Your account has been suspended. Click here to verify immediately!',
    }),
  });
  results.tests.push({ name: 'Fraud Detection', ...fraud });
  if (fraud.success) results.passed++;
  else results.failed++;

  // Test 4: Chatbot (Normal)
  const chatbot = await testRequest('Chatbot (Normal Mode)', '/chatbot', {
    method: 'POST',
    body: JSON.stringify({
      query: 'How to stay safe on public Wi-Fi?',
      voiceCommandMode: false,
    }),
  });
  results.tests.push({ name: 'Chatbot Normal', ...chatbot });
  if (chatbot.success) results.passed++;
  else results.failed++;

  // Test 5: Chatbot (Voice Command)
  const chatbotVoice = await testRequest('Chatbot (Voice Command)', '/chatbot', {
    method: 'POST',
    body: JSON.stringify({
      query: 'Scan Wi-Fi',
      voiceCommandMode: true,
    }),
  });
  results.tests.push({ name: 'Chatbot Voice', ...chatbotVoice });
  if (chatbotVoice.success) results.passed++;
  else results.failed++;

  // Test 6: URL Scan
  const urlScan = await testRequest('URL Scan', '/url_scan', {
    method: 'POST',
    body: JSON.stringify({
      url: 'http://suspicious-site.tk/login/verify',
    }),
  });
  results.tests.push({ name: 'URL Scan', ...urlScan });
  if (urlScan.success) results.passed++;
  else results.failed++;

  // Test 7: Add Scam
  const addScam = await testRequest('Add Scam', '/add_scam', {
    method: 'POST',
    body: JSON.stringify({
      message: 'Test scam message',
      category: 'Phishing',
      user: 'TestUser',
      source: 'Test',
    }),
  });
  results.tests.push({ name: 'Add Scam', ...addScam });
  if (addScam.success) results.passed++;
  else results.failed++;

  // Test 8: Get Scams
  const getScams = await testRequest('Get Scams', '/get_scams', { method: 'GET' });
  results.tests.push({ name: 'Get Scams', ...getScams });
  if (getScams.success) results.passed++;
  else results.failed++;

  // Test 9: Extension Check URL
  const extCheck = await testRequest('Extension Check URL', '/extension/check_url', {
    method: 'POST',
    body: JSON.stringify({
      currentUrl: 'http://suspicious-site.com',
    }),
  });
  results.tests.push({ name: 'Extension Check URL', ...extCheck });
  if (extCheck.success) results.passed++;
  else results.failed++;

  // Test 10: Extension Report Scam
  const extReport = await testRequest('Extension Report Scam', '/extension/report_scam', {
    method: 'POST',
    body: JSON.stringify({
      url: 'http://scam-site.com',
      category: 'Phishing',
    }),
  });
  results.tests.push({ name: 'Extension Report Scam', ...extReport });
  if (extReport.success) results.passed++;
  else results.failed++;

  // Test 11: Senior Voice Command
  const senior = await testRequest('Senior Voice Command', '/senior/voice_command', {
    method: 'POST',
    body: JSON.stringify({
      commandText: 'Check Wi-Fi',
    }),
  });
  results.tests.push({ name: 'Senior Voice Command', ...senior });
  if (senior.success) results.passed++;
  else results.failed++;

  // Test 12: Statistics
  const stats = await testRequest('Statistics', '/stats', { method: 'GET' });
  results.tests.push({ name: 'Statistics', ...stats });
  if (stats.success) results.passed++;
  else results.failed++;

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('\n📊 Test Results Summary\n', 'cyan');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  log(`📈 Total: ${results.tests.length}`, 'blue');

  log('\n📋 Detailed Results:\n', 'cyan');
  results.tests.forEach((test) => {
    const status = test.success ? '✅' : '❌';
    log(`${status} ${test.name}`, test.success ? 'green' : 'red');
  });

  if (results.failed === 0) {
    log('\n🎉 All tests passed! Backend is fully functional!\n', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the errors above.\n', 'yellow');
  }

  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch((error) => {
  log(`\n❌ Fatal Error: ${error.message}`, 'red');
  log('Make sure backend is running on http://localhost:5000', 'yellow');
  process.exit(1);
});

