import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Deception from '../models/Deception.js';

dotenv.config();

const sampleDeceptions = [
  {
    title: 'Phishing Site Blocked — Fake Bank Login',
    summary: 'Detected a fake banking page attempting to capture user credentials and OTPs. System redirected attacker to monitored decoy page.',
    type: 'Phishing',
    threat_source: '[suspicious-domain.com]',
    protected_items: ['Passwords', 'OTP', 'Account Info', 'Banking Details'],
    severity: 'High',
    status: 'published',
    timeline: {
      detection: {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        method: 'Extension',
      },
      deception_deployed: {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000),
        action: 'Redirected attacker to monitored decoy page',
      },
      attacker_interaction: {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        details: 'Attacker attempted to access user credentials on decoy page',
      },
      user_protected: {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 5000),
        result: 'User prevented from accessing fraudulent site, credentials safe',
      },
    },
    metadata: {
      source: 'Browser Extension',
      reported_by: null,
      sanitized: true,
    },
  },
  {
    title: 'Suspicious Link Blocked — Fake Payment Gateway',
    summary: 'Blocked access to a fake payment gateway website that was attempting to steal credit card information.',
    type: 'Fake Website',
    threat_source: '[payment-gateway-fake.com]',
    protected_items: ['Credit Card', 'Banking Details', 'Personal Data'],
    severity: 'Critical',
    status: 'published',
    timeline: {
      detection: {
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        method: 'System Scan',
      },
      deception_deployed: {
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 2000),
        action: 'Access blocked, user notified immediately',
      },
      user_protected: {
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 3000),
        result: 'User protected from fraudulent payment gateway',
      },
    },
    metadata: {
      source: 'System Detection',
      reported_by: null,
      sanitized: true,
    },
  },
  {
    title: 'Malware Attempt Blocked — Suspicious Download',
    summary: 'System detected and blocked a suspicious file download that contained potential malware.',
    type: 'Malware',
    threat_source: '[download-source.com]',
    protected_items: ['Personal Data', 'Other'],
    severity: 'High',
    status: 'published',
    timeline: {
      detection: {
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        method: 'Extension',
      },
      deception_deployed: {
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000 + 1000),
        action: 'Download blocked, file quarantined',
      },
      user_protected: {
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000 + 2000),
        result: 'User protected from potential malware infection',
      },
    },
    metadata: {
      source: 'Browser Extension',
      reported_by: null,
      sanitized: true,
    },
  },
  {
    title: 'Fake Login Page Detected — Social Media Phishing',
    summary: 'Blocked access to a fake social media login page attempting to steal user credentials.',
    type: 'Fake Login',
    threat_source: '[social-media-phish.com]',
    protected_items: ['Passwords', 'Account Info'],
    severity: 'Medium',
    status: 'published',
    timeline: {
      detection: {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        method: 'Manual Report',
      },
      deception_deployed: {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 2000),
        action: 'User notified, access blocked',
      },
      user_protected: {
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 3000),
        result: 'Credentials protected from theft',
      },
    },
    metadata: {
      source: 'Manual Report',
      reported_by: null,
      sanitized: true,
    },
  },
  {
    title: 'OTP Scam Attempt Blocked',
    summary: 'Detected and blocked a suspicious message attempting to trick user into sharing OTP.',
    type: 'Scam Message',
    threat_source: '[sms-scam-source]',
    protected_items: ['OTP', 'Account Info'],
    severity: 'High',
    status: 'published',
    timeline: {
      detection: {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        method: 'AI Detection',
      },
      deception_deployed: {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 1000),
        action: 'User warned about suspicious message',
      },
      user_protected: {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2000),
        result: 'OTP kept secure, scam prevented',
      },
    },
    metadata: {
      source: 'System Detection',
      reported_by: null,
      sanitized: true,
    },
  },
];

const seedDeceptions = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding deception events...');

    // Clear existing deceptions (optional)
    await Deception.deleteMany({});
    console.log('✅ Cleared existing deceptions');

    // Insert sample deceptions
    const deceptions = await Deception.insertMany(sampleDeceptions);
    console.log(`✅ Seeded ${deceptions.length} deception events`);

    // Show summary
    const published = await Deception.countDocuments({ status: 'published' });
    const drafts = await Deception.countDocuments({ status: 'draft' });
    
    console.log('\n📊 Summary:');
    console.log(`   Published: ${published}`);
    console.log(`   Drafts: ${drafts}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding deceptions:', error);
    process.exit(1);
  }
};

seedDeceptions();

