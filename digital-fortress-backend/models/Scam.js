import mongoose from 'mongoose';

const scamSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      default: 'Anonymous',
    },
    message: {
      type: String,
      required: [true, 'Scam message is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'UPI Fraud',
        'OTP Scam',
        'Job Scam',
        'Investment',
        'Lottery',
        'Bank Call',
        'Phishing',
        'Delivery',
        'Romance Scam',
        'Tech Support',
        'Other',
      ],
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    source: {
      type: String,
      default: 'Web App',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    reports: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
scamSchema.index({ category: 1 });
scamSchema.index({ date: -1 });

const Scam = mongoose.model('Scam', scamSchema);

export default Scam;

