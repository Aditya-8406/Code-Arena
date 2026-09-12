const User = require('../models/User');

// @desc    Get public student leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name points level currentStreak longestStreak solvedProblems badges createdAt')
      .sort({ points: -1, currentStreak: -1 })
      .limit(50)
      .lean();

    const rankedLeaderboard = students.map((student, index) => ({
      rank: index + 1,
      _id: student._id,
      name: student.name,
      points: student.points || 0,
      level: student.level || 1,
      solvedCount: student.solvedProblems ? student.solvedProblems.length : 0,
      currentStreak: student.currentStreak || 0,
      badgesCount: student.badges ? student.badges.length : 0,
      joinedAt: student.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      leaderboard: rankedLeaderboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard,
};
