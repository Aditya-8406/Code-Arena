const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { TOPICS } = require('../models/Problem');

/**
 * Rule-based recommendation engine
 * Analyzes topic accuracy, failed submissions, and difficulty history to recommend targeted problems
 */
async function getPersonalizedRecommendations(userId) {
  const user = await User.findById(userId).populate('solvedProblems.problem');
  if (!user) return [];

  // Set of solved problem IDs
  const solvedProblemIdSet = new Set(
    user.solvedProblems.map((sp) => sp.problem?._id?.toString() || sp.problem?.toString())
  );

  // Fetch recent submissions for this user (up to 100)
  const submissions = await Submission.find({ userId })
    .populate('problemId', 'title topic difficulty')
    .sort({ createdAt: -1 })
    .limit(100);

  // Calculate per-topic performance
  const topicStats = {};
  TOPICS.forEach((topic) => {
    topicStats[topic] = {
      topic,
      totalAttempts: 0,
      acceptedAttempts: 0,
      failedAttempts: 0,
      accuracy: 0,
      hasSolved: false,
    };
  });

  submissions.forEach((sub) => {
    if (sub.problemId && sub.problemId.topic) {
      const topic = sub.problemId.topic;
      if (topicStats[topic]) {
        topicStats[topic].totalAttempts++;
        if (sub.status === 'ACCEPTED') {
          topicStats[topic].acceptedAttempts++;
          topicStats[topic].hasSolved = true;
        } else {
          topicStats[topic].failedAttempts++;
        }
      }
    }
  });

  // Compute accuracy for each topic
  Object.keys(topicStats).forEach((topic) => {
    const stats = topicStats[topic];
    if (stats.totalAttempts > 0) {
      stats.accuracy = Math.round((stats.acceptedAttempts / stats.totalAttempts) * 100);
    }
  });

  const recommendations = [];
  const recommendedProblemIds = new Set();

  // Helper to add candidate problem
  const addCandidate = (problem, reason) => {
    const idStr = problem._id.toString();
    if (!solvedProblemIdSet.has(idStr) && !recommendedProblemIds.has(idStr)) {
      recommendedProblemIds.add(idStr);
      recommendations.push({
        _id: problem._id,
        title: problem.title,
        slug: problem.slug,
        topic: problem.topic,
        difficulty: problem.difficulty,
        totalSubmissions: problem.totalSubmissions,
        acceptedSubmissions: problem.acceptedSubmissions,
        recommendationReason: reason,
      });
    }
  };

  // RULE 1: Repeatedly failed topic or accuracy < 50% -> Recommend Easy problems in this topic
  const lowAccuracyTopics = Object.values(topicStats)
    .filter((t) => t.totalAttempts >= 2 && t.accuracy < 50)
    .sort((a, b) => a.accuracy - b.accuracy);

  for (const topicData of lowAccuracyTopics) {
    if (recommendations.length >= 8) break;
    const candidates = await Problem.find({
      topic: topicData.topic,
      difficulty: 'Easy',
      _id: { $nin: Array.from(solvedProblemIdSet) },
    }).limit(2);

    candidates.forEach((cand) =>
      addCandidate(
        cand,
        `Recommended because your accuracy in ${topicData.topic} is ${topicData.accuracy}%. Reinforce the fundamentals!`
      )
    );
  }

  // RULE 2: Topic accuracy 50% - 75% -> Recommend Easy or Medium problems
  const moderateTopics = Object.values(topicStats)
    .filter((t) => t.totalAttempts >= 2 && t.accuracy >= 50 && t.accuracy <= 75)
    .sort((a, b) => b.totalAttempts - a.totalAttempts);

  for (const topicData of moderateTopics) {
    if (recommendations.length >= 8) break;
    const candidates = await Problem.find({
      topic: topicData.topic,
      difficulty: { $in: ['Easy', 'Medium'] },
      _id: { $nin: Array.from(solvedProblemIdSet) },
    }).limit(2);

    candidates.forEach((cand) =>
      addCandidate(
        cand,
        `Recommended because you have a solid ${topicData.accuracy}% accuracy in ${topicData.topic}. Ready for the next step!`
      )
    );
  }

  // RULE 3: Topic accuracy > 75% -> Recommend Medium/Hard problems
  const highAccuracyTopics = Object.values(topicStats)
    .filter((t) => t.totalAttempts >= 2 && t.accuracy > 75)
    .sort((a, b) => b.accuracy - a.accuracy);

  for (const topicData of highAccuracyTopics) {
    if (recommendations.length >= 8) break;
    const candidates = await Problem.find({
      topic: topicData.topic,
      difficulty: { $in: ['Medium', 'Hard'] },
      _id: { $nin: Array.from(solvedProblemIdSet) },
    }).limit(2);

    candidates.forEach((cand) =>
      addCandidate(
        cand,
        `Strong mastery in ${topicData.topic} (${topicData.accuracy}% accuracy)! Challenge yourself with higher difficulty.`
      )
    );
  }

  // RULE 4: If student has solved many Easy problems (>= 3), recommend Medium problems
  const easySolves = user.solvedProblems.filter(
    (sp) => sp.problem && sp.problem.difficulty === 'Easy'
  ).length;

  if (easySolves >= 3 && recommendations.length < 8) {
    const mediumCandidates = await Problem.find({
      difficulty: 'Medium',
      _id: { $nin: Array.from(solvedProblemIdSet) },
    }).limit(3);

    mediumCandidates.forEach((cand) =>
      addCandidate(
        cand,
        `You've mastered ${easySolves} Easy problems! Level up your problem-solving with this Medium challenge.`
      )
    );
  }

  // RULE 5: Unexplored topics -> Introduce foundational Easy problems
  const unattemptedTopics = Object.values(topicStats).filter(
    (t) => t.totalAttempts === 0
  );

  for (const topicData of unattemptedTopics) {
    if (recommendations.length >= 8) break;
    const candidates = await Problem.find({
      topic: topicData.topic,
      difficulty: 'Easy',
      _id: { $nin: Array.from(solvedProblemIdSet) },
    }).limit(1);

    candidates.forEach((cand) =>
      addCandidate(
        cand,
        `Explore new DSA concepts: You haven't practiced ${topicData.topic} yet.`
      )
    );
  }

  // Fallback: Fill remaining slots with trending unsolved problems
  if (recommendations.length < 5) {
    const fallbackCandidates = await Problem.find({
      _id: { $nin: [...Array.from(solvedProblemIdSet), ...Array.from(recommendedProblemIds)] },
    })
      .sort({ totalSubmissions: -1 })
      .limit(6 - recommendations.length);

    fallbackCandidates.forEach((cand) =>
      addCandidate(
        cand,
        `Popular problem across the CodeArena community in ${cand.topic} (${cand.difficulty}).`
      )
    );
  }

  return recommendations.slice(0, 8);
}

module.exports = {
  getPersonalizedRecommendations,
};
