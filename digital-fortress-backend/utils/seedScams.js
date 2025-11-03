// Seed script to add sample scams to database
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Scam from '../models/Scam.js';

dotenv.config();

const seedScams = async () => {
  try {
    await connectDB();

    // Clear existing scams (optional)
    // await Scam.deleteMany({});

    const sampleScams = [
      {
        message: 'Fake UPI payment confirmation asking for verification',
        category: 'UPI Fraud',
        user: 'System',
        source: 'Web App',
        riskLevel: 'high',
        reports: 342,
        date: '2025-01-15',
      },
      {
        message: 'Caller pretending to be bank asking for OTP',
        category: 'OTP Scam',
        user: 'System',
        source: 'Web App',
        riskLevel: 'high',
        reports: 287,
        date: '2025-01-14',
      },
      {
        message: 'Fake work-from-home job offer requiring registration fee',
        category: 'Job Scam',
        user: 'System',
        source: 'Web App',
        riskLevel: 'medium',
        reports: 156,
        date: '2025-01-13',
      },
      {
        message: 'Crypto investment scheme promising guaranteed returns',
        category: 'Investment',
        user: 'System',
        source: 'Web App',
        riskLevel: 'high',
        reports: 423,
        date: '2025-01-12',
      },
      {
        message: 'Lottery winning notification asking for processing fee',
        category: 'Lottery',
        user: 'System',
        source: 'Web App',
        riskLevel: 'medium',
        reports: 198,
        date: '2025-01-11',
      },
      {
        message: 'Bank fraud department call asking for account details',
        category: 'Bank Call',
        user: 'System',
        source: 'Web App',
        riskLevel: 'high',
        reports: 512,
        date: '2025-01-10',
      },
      {
        message: 'Phishing email asking to verify account credentials',
        category: 'Phishing',
        user: 'System',
        source: 'Web App',
        riskLevel: 'high',
        reports: 378,
        date: '2025-01-09',
      },
      {
        message: 'Fake delivery notification with suspicious link',
        category: 'Delivery',
        user: 'System',
        source: 'Web App',
        riskLevel: 'low',
        reports: 89,
        date: '2025-01-08',
      },
    ];

    await Scam.insertMany(sampleScams);

    console.log('✅ Sample scams seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding scams:', error);
    process.exit(1);
  }
};

seedScams();

