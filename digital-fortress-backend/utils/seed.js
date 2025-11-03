import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Post from '../models/Post.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    console.log('Cleared existing data...');

    // Create sample users
    const users = await User.insertMany([
      {
        username: 'priya_sharma',
        email: 'priya@example.com',
        password: 'password123',
      },
      {
        username: 'rajesh_kumar',
        email: 'rajesh@example.com',
        password: 'password123',
      },
      {
        username: 'anita_mishra',
        email: 'anita@example.com',
        password: 'password123',
      },
      {
        username: 'vikram_patel',
        email: 'vikram@example.com',
        password: 'password123',
      },
    ]);

    console.log('Created sample users...');

    // Create sample posts
    const posts = await Post.insertMany([
      {
        title: 'Fake payment confirmation message',
        content: 'I received a message claiming to be from my bank about a failed UPI transaction. They asked me to verify my details on a link. Thanks to Digital Fortress, I recognized it as a scam!',
        riskType: 'UPI Scam',
        riskLevel: 'high',
        isAnonymous: false,
        userId: users[0]._id,
        likes: [users[1]._id, users[2]._id],
        comments: [
          {
            commenterId: users[1]._id,
            commenterName: users[1].username,
            message: 'Thanks for sharing! This is a common scam.',
          },
        ],
      },
      {
        title: 'Fake work-from-home offer',
        content: 'Received an email offering a high-paying WFH job with minimal qualifications. They asked for an upfront registration fee. Red flags everywhere!',
        riskType: 'Job Scam',
        riskLevel: 'medium',
        isAnonymous: false,
        userId: users[1]._id,
        likes: [users[0]._id, users[2]._id, users[3]._id],
        comments: [
          {
            commenterId: users[2]._id,
            commenterName: users[2].username,
            message: 'Never pay upfront for job opportunities!',
          },
        ],
      },
      {
        title: 'Caller pretending to be bank executive',
        content: "Someone called claiming to be from my bank's fraud department and asked for my OTP to 'block suspicious transactions'. I hung up and called the bank directly.",
        riskType: 'OTP Fraud',
        riskLevel: 'high',
        isAnonymous: true,
        userId: users[2]._id,
        likes: [users[0]._id, users[1]._id, users[3]._id],
        comments: [],
      },
      {
        title: 'Crypto investment scheme',
        content: "A 'financial advisor' messaged me on WhatsApp about a guaranteed returns crypto scheme. The website looked professional but was registered just 2 weeks ago.",
        riskType: 'Investment Scam',
        riskLevel: 'medium',
        isAnonymous: false,
        userId: users[3]._id,
        likes: [users[0]._id, users[1]._id],
        comments: [
          {
            commenterId: users[0]._id,
            commenterName: users[0].username,
            message: 'Good catch! Always verify before investing.',
          },
        ],
      },
    ]);

    console.log('Created sample posts...');

    console.log('\n✅ Seed data created successfully!');
    console.log(`Created ${users.length} users and ${posts.length} posts.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

