import express from 'express';
import Deception from '../models/Deception.js';
import { sanitizeDeception, sanitizeDeceptions } from '../utils/sanitizeDeception.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/deceptions/log
// @desc    Log a deception event (called by system/extension)
// @access  Private (or Public with rate limiting)
router.post('/log', async (req, res) => {
  try {
    const {
      title,
      summary,
      type,
      threat_source,
      protected_items,
      severity,
      timeline,
      source,
    } = req.body;

    if (!title || !summary || !type || !severity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, summary, type, and severity',
      });
    }

    // Create deception event
    const deception = await Deception.create({
      title,
      summary,
      type,
      threat_source: threat_source || 'Unknown',
      protected_items: protected_items || [],
      severity,
      status: 'draft', // Auto-sanitize and review before publishing
      timeline: timeline || {
        detection: {
          timestamp: new Date(),
          method: source === 'Browser Extension' ? 'Extension' : 'System Scan',
        },
      },
      metadata: {
        source: source || 'System Detection',
        reported_by: req.user ? req.user._id : null,
        sanitized: false,
      },
    });

    // Auto-sanitize immediately
    const sanitized = sanitizeDeception(deception);
    await Deception.findByIdAndUpdate(deception._id, {
      metadata: { ...sanitized.metadata, sanitized: true },
    });

    res.status(201).json({
      success: true,
      message: 'Deception event logged successfully',
      data: {
        id: deception._id,
        status: deception.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to log deception event',
    });
  }
});

// @route   GET /api/deceptions/public
// @desc    Get sanitized, published deception events for public feed
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    // Get only published events
    const deceptions = await Deception.find({ status: 'published' })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    // Sanitize all events
    const sanitized = sanitizeDeceptions(deceptions);

    res.json({
      success: true,
      count: sanitized.length,
      total: await Deception.countDocuments({ status: 'published' }),
      data: sanitized.map(d => ({
        id: d._id,
        title: d.title,
        summary: d.summary,
        type: d.type,
        threat_source: d.threat_source,
        protected_items: d.protected_items,
        severity: d.severity,
        timestamp: d.timestamp,
        timeline: {
          detection: d.timeline?.detection || null,
        },
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch deception events',
    });
  }
});

// @route   GET /api/deceptions/:id
// @desc    Get detailed, sanitized deception event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const deception = await Deception.findById(req.params.id);

    if (!deception) {
      return res.status(404).json({
        success: false,
        message: 'Deception event not found',
      });
    }

    // Only return published events to public
    if (deception.status !== 'published' && !req.user) {
      return res.status(403).json({
        success: false,
        message: 'This event is not yet published',
      });
    }

    // Sanitize the event
    const sanitized = sanitizeDeception(deception);

    res.json({
      success: true,
      data: sanitized,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch deception event',
    });
  }
});

// @route   POST /api/deceptions/publish/:id
// @desc    Publish a deception event to awareness feed
// @access  Private (Admin or System)
router.post('/publish/:id', protect, async (req, res) => {
  try {
    const deception = await Deception.findById(req.params.id);

    if (!deception) {
      return res.status(404).json({
        success: false,
        message: 'Deception event not found',
      });
    }

    // Ensure it's sanitized before publishing
    const sanitized = sanitizeDeception(deception);
    
    // Update status to published
    deception.status = 'published';
    deception.metadata.sanitized = true;
    await deception.save();

    res.json({
      success: true,
      message: 'Deception event published successfully',
      data: {
        id: deception._id,
        status: deception.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to publish deception event',
    });
  }
});

// @route   POST /api/deceptions/report
// @desc    Allow users to report suspicious sites manually
// @access  Public (with optional auth)
router.post('/report', async (req, res) => {
  try {
    const { url, description, type } = req.body;

    if (!url || !description) {
      return res.status(400).json({
        success: false,
        message: 'URL and description are required',
      });
    }

    // Create a draft report
    const deception = await Deception.create({
      title: `Suspicious Site Reported - ${type || 'Unknown Type'}`,
      summary: description,
      type: type || 'Other',
      threat_source: url, // Will be sanitized
      protected_items: ['Unknown'], // User didn't specify
      severity: 'Medium', // Default for user reports
      status: 'draft', // Needs review before publishing
      timeline: {
        detection: {
          timestamp: new Date(),
          method: 'Manual Report',
        },
      },
      metadata: {
        source: 'Manual Report',
        reported_by: req.user ? req.user._id : null,
        sanitized: false,
      },
    });

    // Auto-sanitize
    const sanitized = sanitizeDeception(deception);
    await Deception.findByIdAndUpdate(deception._id, {
      metadata: { ...sanitized.metadata, sanitized: true },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reporting. Your report has been submitted for review.',
      data: {
        id: deception._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit report',
    });
  }
});

export default router;

