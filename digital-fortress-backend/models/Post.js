import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    commenterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commenterName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Comment message is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
      trim: true,
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    riskType: {
      type: String,
      required: [true, 'Please provide a risk type'],
      enum: [
        'UPI Scam',
        'Phishing',
        'OTP Fraud',
        'Job Scam',
        'Investment Scam',
        'Romance Scam',
        'Tech Support Scam',
        'Banking Fraud',
        'Social Engineering',
        'Other',
      ],
      default: 'Other',
    },
    riskLevel: {
      type: String,
      required: [true, 'Please provide a risk level'],
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    media: {
      type: String, // URL to uploaded file
      default: null,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: null,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
postSchema.index({ createdAt: -1 });
postSchema.index({ userId: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;

