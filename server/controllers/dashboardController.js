const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const { TOPICS } = require('../models/Problem');
const { getLevelProgress } = require('../services/gamificationService');
const { getPersonalizedRecommendations } = require('../services/recommendationService');

// @desc    Get student dashboard metrics & analytics
// @route   GET /api/dashboard/student
// @access  Private
const getStudentDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('solvedProblems.problem', 'title difficulty topic')
      .populate('badges.badge');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Submissions by this student
    const [submissions, totalProblemsCount, allProblems] = await Promise.all([
      Submission.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50).lean(),
      Problem.countDocuments(),
      Problem.find({}).select('topic difficulty').lean(),
    ]);

    const totalSubmissions = submissions.length;
    const totalAccepted = submissions.filter((s) => s.status === 'ACCEPTED').length;
    const accuracy =
      totalSubmissions > 0 ? Math.round((totalAccepted / totalSubmissions) * 100) : 0;

    // Difficulty breakdown: Solved vs Total Available
    const difficultyStats = {
      Easy: { solved: 0, total: 0 },
      Medium: { solved: 0, total: 0 },
      Hard: { solved: 0, total: 0 },
    };

    allProblems.forEach((p) => {
      if (difficultyStats[p.difficulty]) {
        difficultyStats[p.difficulty].total++;
      }
    });

    user.solvedProblems.forEach((sp) => {
      if (sp.problem && difficultyStats[sp.problem.difficulty]) {
        difficultyStats[sp.problem.difficulty].solved++;
      }
    });

    // Topic-wise progress calculation
    const topicTotalMap = {};
    TOPICS.forEach((t) => (topicTotalMap[t] = 0));
    allProblems.forEach((p) => {
      if (topicTotalMap[p.topic] !== undefined) topicTotalMap[p.topic]++;
    });

    const topicSolvedMap = {};
    TOPICS.forEach((t) => (topicSolvedMap[t] = 0));
    user.solvedProblems.forEach((sp) => {
      if (sp.problem && topicSolvedMap[sp.problem.topic] !== undefined) {
        topicSolvedMap[sp.problem.topic]++;
      }
    });

    const topicProgress = TOPICS.map((topic) => {
      const total = topicTotalMap[topic] || 0;
      const solved = topicSolvedMap[topic] || 0;
      const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
      return { topic, total, solved, percentage };
    });

    // Recommendations
    const recommendations = await getPersonalizedRecommendations(user._id);

    // Recent 6 activities
    const recentActivity = submissions.slice(0, 6);

    res.status(200).json({
      success: true,
      stats: {
        totalSolved: user.solvedProblems.length,
        totalAvailableProblems: totalProblemsCount,
        totalSubmissions,
        accuracy,
        currentStreak: user.currentStreak || 0,
        longestStreak: user.longestStreak || 0,
        points: user.points || 0,
        level: user.level || 1,
        levelProgress: getLevelProgress(user.points || 0),
        badgesCount: user.badges ? user.badges.length : 0,
      },
      badges: user.badges,
      difficultyStats,
      topicProgress,
      recommendations,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher/admin dashboard metrics & analytics
// @route   GET /api/dashboard/teacher
// @access  Private (Admin only)
const getTeacherDashboard = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalProblems,
      totalSubmissions,
      allSubmissions,
      recentSubmissions,
      students,
      assessments,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Problem.countDocuments(),
      Submission.countDocuments(),
      Submission.find({}).select('status').lean(),
      Submission.find({})
        .populate('userId', 'name email')
        .populate('problemId', 'title difficulty topic')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      User.find({ role: 'student' })
        .select('name email points level currentStreak solvedProblems lastActiveDate createdAt')
        .sort({ points: -1 })
        .lean(),
      Assessment.find({}).lean(),
    ]);

    const acceptedCount = allSubmissions.filter((s) => s.status === 'ACCEPTED').length;
    const averageAccuracy =
      totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

    // Top solved problems
    const topSolvedProblems = await Problem.find({})
      .select('title topic difficulty acceptedSubmissions totalSubmissions')
      .sort({ acceptedSubmissions: -1 })
      .limit(5)
      .lean();

    // Map student performance data
    const studentPerformanceList = students.map((s) => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      solvedCount: s.solvedProblems ? s.solvedProblems.length : 0,
      points: s.points || 0,
      level: s.level || 1,
      streak: s.currentStreak || 0,
      lastActiveDate: s.lastActiveDate,
      joinedDate: s.createdAt,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalProblems,
        totalSubmissions,
        averageAccuracy,
        totalAssessments: assessments.length,
      },
      topSolvedProblems,
      recentSubmissions,
      students: studentPerformanceList,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed student performance for teacher view
// @route   GET /api/dashboard/student/:id
// @access  Private (Admin only)
const getStudentDetailForTeacher = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id)
      .populate('solvedProblems.problem', 'title difficulty topic')
      .populate('badges.badge');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [submissions, assessmentAttempts] = await Promise.all([
      Submission.find({ userId: student._id })
        .populate('problemId', 'title difficulty topic')
        .sort({ createdAt: -1 })
        .lean(),
      AssessmentResult.find({ userId: student._id })
        .populate('assessmentId', 'title duration totalMarks')
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        points: student.points,
        level: student.level,
        currentStreak: student.currentStreak,
        longestStreak: student.longestStreak,
        lastActiveDate: student.lastActiveDate,
        badges: student.badges,
        solvedProblems: student.solvedProblems,
      },
      submissions,
      assessmentAttempts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  getTeacherDashboard,
  getStudentDetailForTeacher,
};
