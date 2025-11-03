import express from 'express';
import Scam from '../models/Scam.js';

const router = express.Router();

// @route   GET /api/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    // Get scam statistics
    const totalScams = await Scam.countDocuments();
    const totalReports = await Scam.aggregate([
      { $group: { _id: null, total: { $sum: '$reports' } } },
    ]);
    const reportsByCategory = await Scam.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          reports: { $sum: '$reports' },
        },
      },
      { $sort: { reports: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        total_scans: 0, // Can be tracked separately if needed
        total_detections: totalScams,
        total_scam_reports: totalReports[0]?.total || 0,
        total_url_checks: 0, // Can be tracked separately if needed
        scams_by_category: reportsByCategory,
        top_scam_categories: reportsByCategory.slice(0, 5).map((item) => ({
          category: item._id,
          reports: item.reports,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get statistics',
    });
  }
});

export default router;

