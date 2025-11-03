import express from 'express';
import Scam from '../models/Scam.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/add_scam
// @desc    Add a scam to database
// @access  Private (optional - can be public too)
router.post('/add_scam', async (req, res) => {
  try {
    const { message, category, user, source } = req.body;

    if (!message || !category) {
      return res.status(400).json({
        success: false,
        message: 'Message and category are required',
      });
    }

    // Determine risk level based on category
    const highRiskCategories = ['UPI Fraud', 'OTP Scam', 'Bank Call', 'Phishing'];
    const mediumRiskCategories = ['Job Scam', 'Investment', 'Lottery'];
    let riskLevel = 'low';
    if (highRiskCategories.includes(category)) {
      riskLevel = 'high';
    } else if (mediumRiskCategories.includes(category)) {
      riskLevel = 'medium';
    }

    // Check if similar scam exists (optional - to increment reports)
    const existingScam = await Scam.findOne({
      category,
      message: { $regex: message.substring(0, 50), $options: 'i' },
    });

    if (existingScam) {
      // Increment reports count
      existingScam.reports += 1;
      await existingScam.save();

      return res.json({
        success: true,
        data: {
          ...existingScam.toObject(),
          message: 'Scam report count updated',
        },
      });
    }

    // Create new scam entry
    const scam = await Scam.create({
      message,
      category,
      user: user || 'Anonymous',
      source: source || 'Web App',
      riskLevel,
      userId: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      data: scam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add scam',
    });
  }
});

// @route   GET /api/get_scams
// @desc    Get all scams from database
// @access  Public
router.get('/get_scams', async (req, res) => {
  try {
    const { category, limit = 100 } = req.query;

    const query = {};
    if (category) {
      query.category = category;
    }

    const scams = await Scam.find(query)
      .sort({ date: -1, reports: -1 })
      .limit(parseInt(limit))
      .exec();

    // Format response to match frontend expectations
    const formattedScams = scams.map((scam, index) => ({
      id: index + 1,
      type: scam.category,
      date: scam.date,
      risk: scam.riskLevel,
      reports: scam.reports,
      message: scam.message,
      user: scam.user,
      source: scam.source,
    }));

    res.json({
      success: true,
      count: formattedScams.length,
      data: formattedScams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get scams',
    });
  }
});

export default router;

