import mongoose from 'mongoose';

const deceptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: [1000, 'Summary cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Deception type is required'],
      enum: [
        'Phishing',
        'Fake Login',
        'Malware',
        'Suspicious Link',
        'Scam Message',
        'Fake Website',
        'Other',
      ],
      default: 'Other',
    },
    threat_source: {
      type: String,
      trim: true,
      // Will be sanitized - no real URLs/IPs stored
      default: 'Unknown',
    },
    protected_items: [
      {
        type: String,
        enum: [
          'Passwords',
          'OTP',
          'Account Info',
          'Credit Card',
          'Personal Data',
          'Banking Details',
          'Other',
        ],
      },
    ],
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    timeline: {
      detection: {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        method: {
          type: String,
          enum: ['Extension', 'Manual Report', 'System Scan', 'AI Detection'],
          default: 'System Scan',
        },
      },
      deception_deployed: {
        timestamp: Date,
        action: String, // e.g., "Redirected to decoy", "Blocked access"
      },
      attacker_interaction: {
        timestamp: Date,
        details: String, // Sanitized details
      },
      user_protected: {
        timestamp: Date,
        result: String, // e.g., "Access blocked", "User notified"
      },
    },
    metadata: {
      source: {
        type: String,
        enum: ['Browser Extension', 'Manual Report', 'System Detection', 'Community Report'],
        default: 'System Detection',
      },
      reported_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, // Anonymous reporting allowed
      },
      sanitized: {
        type: Boolean,
        default: false,
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
deceptionSchema.index({ status: 1, timestamp: -1 });
deceptionSchema.index({ severity: 1 });
deceptionSchema.index({ type: 1 });

const Deception = mongoose.model('Deception', deceptionSchema);

export default Deception;

