const User = require('../models/User');
const Problem = require('../models/Problem');
const Badge = require('../models/Badge');

const POINTS_MAP = {
  Easy: 10,
  Medium: 20,
  Hard: 30,
};

/**
 * Calculates level based on total points
 */
function calculateLevel(points) {
  if (points >= 1000) return 5;
  if (points >= 500) return 4;
  if (points >= 250) return 3;
  if (points >= 100) return 2;
  return 1;
}

/**
 * Calculates level progress percentage and points required for next level
 */
function getLevelProgress(points) {
  const thresholds = [
    { level: 1, min: 0, max: 100 },
    { level: 2, min: 100, max: 250 },
    { level: 3, min: 250, max: 500 },
    { level: 4, min: 500, max: 1000 },
    { level: 5, min: 1000, max: 1000 }, // Max level
  ];

  const currentLevel = calculateLevel(points);
  if (currentLevel === 5) {
    return { level: 5, current: points, next: points, progress: 100 };
  }

  const currentTier = thresholds.find((t) => t.level === currentLevel);
  const range = currentTier.max - currentTier.min;
  const progress = Math.min(
    100,
    Math.round(((points - currentTier.min) / range) * 100)
  );

  return {
    level: currentLevel,
    current: points,
    next: currentTier.max,
    progress,
  };
}

/**
 * Updates streak for user based on server-side calendar day
 */
function updateStreak(user) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (!user.lastActiveDate) {
    user.currentStreak = 1;
    user.longestStreak = Math.max(user.longestStreak || 0, 1);
    user.lastActiveDate = now;
    return;
  }

  const lastActiveStr = new Date(user.lastActiveDate).toISOString().split('T')[0];

  if (todayStr === lastActiveStr) {
    // Already active today, maintain streak
    return;
  }

  // Calculate day difference
  const todayDate = new Date(todayStr);
  const lastDate = new Date(lastActiveStr);
  const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    user.currentStreak = (user.currentStreak || 0) + 1;
    if (user.currentStreak > (user.longestStreak || 0)) {
      user.longestStreak = user.currentStreak;
    }
  } else if (diffDays > 1) {
    // Gap detected, reset to 1
    user.currentStreak = 1;
  }

  user.lastActiveDate = now;
}

/**
 * Evaluates and awards newly unlocked badges
 */
async function checkAndAwardBadges(user) {
  const allBadges = await Badge.find({});
  const existingBadgeSlugs = new Set(user.badges.map((b) => b.slug));
  const newBadgesAwarded = [];

  // Populate solved problems topic info if needed
  await user.populate({
    path: 'solvedProblems.problem',
    select: 'topic difficulty',
  });

  const totalSolves = user.solvedProblems.length;

  for (const badge of allBadges) {
    if (existingBadgeSlugs.has(badge.slug)) continue;

    let unlocked = false;

    if (badge.criteriaType === 'TOTAL_SOLVES') {
      if (totalSolves >= badge.criteriaValue) {
        unlocked = true;
      }
    } else if (badge.criteriaType === 'STREAK') {
      if ((user.currentStreak || 0) >= badge.criteriaValue) {
        unlocked = true;
      }
    } else if (badge.criteriaType === 'TOPIC_SOLVES') {
      const topicCount = user.solvedProblems.filter(
        (sp) => sp.problem && sp.problem.topic === badge.criteriaTopic
      ).length;
      if (topicCount >= badge.criteriaValue) {
        unlocked = true;
      }
    }

    if (unlocked) {
      user.badges.push({
        badge: badge._id,
        slug: badge.slug,
        name: badge.name,
        awardedAt: new Date(),
      });
      newBadgesAwarded.push(badge);
    }
  }

  return newBadgesAwarded;
}

/**
 * Handles all gamification logic after an ACCEPTED submission
 */
async function processAcceptedSubmission(userId, problemId, language) {
  const user = await User.findById(userId);
  const problem = await Problem.findById(problemId);

  if (!user || !problem) {
    return { pointsEarned: 0, isFirstSolve: false, newBadges: [] };
  }

  // Update streaks
  updateStreak(user);

  // Check if problem already solved by this user
  const alreadySolved = user.solvedProblems.some(
    (sp) => sp.problem.toString() === problem._id.toString()
  );

  let pointsEarned = 0;
  let isFirstSolve = false;

  if (!alreadySolved) {
    isFirstSolve = true;
    pointsEarned = POINTS_MAP[problem.difficulty] || 10;
    user.points += pointsEarned;
    user.level = calculateLevel(user.points);

    user.solvedProblems.push({
      problem: problem._id,
      solvedAt: new Date(),
      language: language || 'python',
    });

    // Update problem accepted submissions count
    problem.acceptedSubmissions = (problem.acceptedSubmissions || 0) + 1;
    await problem.save();
  }

  // Check for badge achievements
  const newBadges = await checkAndAwardBadges(user);

  await user.save();

  return {
    pointsEarned,
    isFirstSolve,
    totalPoints: user.points,
    currentStreak: user.currentStreak,
    level: user.level,
    newBadges,
  };
}

module.exports = {
  calculateLevel,
  getLevelProgress,
  updateStreak,
  checkAndAwardBadges,
  processAcceptedSubmission,
  POINTS_MAP,
};
