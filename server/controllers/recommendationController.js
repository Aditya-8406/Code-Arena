const { getPersonalizedRecommendations } = require('../services/recommendationService');

// @desc    Get personalized practice recommendations with rationale
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await getPersonalizedRecommendations(req.user._id);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
