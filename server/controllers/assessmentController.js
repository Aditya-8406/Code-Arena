const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// @desc    Get all active assessments
// @route   GET /api/assessments
// @access  Private
const getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ isActive: true })
      .populate('problems.problem', 'title difficulty topic')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Check if user has an attempt for each assessment
    const assessmentIds = assessments.map((a) => a._id);
    const userResults = await AssessmentResult.find({
      assessmentId: { $in: assessmentIds },
      userId: req.user._id,
    }).lean();

    const resultMap = new Map();
    userResults.forEach((r) => resultMap.set(r.assessmentId.toString(), r));

    const enrichedAssessments = assessments.map((a) => {
      const result = resultMap.get(a._id.toString());
      return {
        ...a,
        hasAttempted: !!result,
        isCompleted: result ? result.isCompleted : false,
        score: result ? result.score : null,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedAssessments.length,
      assessments: enrichedAssessments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment by ID (with server-aware timer calculation)
// @route   GET /api/assessments/:id
// @access  Private
const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate({
        path: 'problems.problem',
        select: '-hiddenTestCases', // Students don't see hidden test cases
      })
      .populate('createdBy', 'name');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    // Check for user's existing attempt
    let result = await AssessmentResult.findOne({
      assessmentId: assessment._id,
      userId: req.user._id,
    });

    let timeRemainingSeconds = assessment.duration * 60;
    let isExpired = false;

    if (result) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(result.startedAt).getTime()) / 1000
      );
      timeRemainingSeconds = Math.max(
        0,
        assessment.duration * 60 - elapsedSeconds
      );

      if (timeRemainingSeconds === 0 && !result.isCompleted) {
        isExpired = true;
      }
    }

    res.status(200).json({
      success: true,
      assessment,
      attempt: result
        ? {
            startedAt: result.startedAt,
            submittedAt: result.submittedAt,
            isCompleted: result.isCompleted || isExpired,
            timeRemainingSeconds,
            score: result.score,
            accuracy: result.accuracy,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start an assessment attempt
// @route   POST /api/assessments/:id/start
// @access  Private
const startAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    // Check if attempt already exists
    let result = await AssessmentResult.findOne({
      assessmentId: assessment._id,
      userId: req.user._id,
    });

    if (result && result.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this assessment',
        result,
      });
    }

    if (!result) {
      result = await AssessmentResult.create({
        assessmentId: assessment._id,
        userId: req.user._id,
        startedAt: new Date(),
        maxScore: assessment.totalMarks || 100,
        problemResults: assessment.problems.map((p) => ({
          problem: p.problem,
          status: 'UNATTEMPTED',
          pointsEarned: 0,
        })),
      });
    }

    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(result.startedAt).getTime()) / 1000
    );
    const timeRemainingSeconds = Math.max(
      0,
      assessment.duration * 60 - elapsedSeconds
    );

    res.status(200).json({
      success: true,
      message: 'Assessment started',
      timeRemainingSeconds,
      startedAt: result.startedAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an assessment
// @route   POST /api/assessments/:id/submit
// @access  Private
const submitAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    let result = await AssessmentResult.findOne({
      assessmentId: assessment._id,
      userId: req.user._id,
    });

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'No active attempt found for this assessment. Please start first.',
      });
    }

    if (result.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'This assessment has already been finalized',
      });
    }

    // Fetch all submissions made by this student under this assessment
    const submissions = await Submission.find({
      userId: req.user._id,
      assessmentId: assessment._id,
    });

    let totalScore = 0;
    let solvedCount = 0;
    let attemptedCount = 0;

    const problemMap = new Map();
    assessment.problems.forEach((p) => {
      problemMap.set(p.problem.toString(), p.points || 25);
    });

    // Evaluate best result per problem
    const problemBestStatus = {};
    submissions.forEach((sub) => {
      const pId = sub.problemId.toString();
      if (!problemBestStatus[pId]) {
        problemBestStatus[pId] = sub.status;
      } else if (sub.status === 'ACCEPTED') {
        problemBestStatus[pId] = 'ACCEPTED';
      }
    });

    const evaluatedProblemResults = [];
    assessment.problems.forEach((p) => {
      const pId = p.problem.toString();
      const status = problemBestStatus[pId] || 'UNATTEMPTED';
      const points = problemMap.get(pId) || 25;

      let pointsEarned = 0;
      if (status !== 'UNATTEMPTED') attemptedCount++;
      if (status === 'ACCEPTED') {
        solvedCount++;
        pointsEarned = points;
        totalScore += points;
      }

      evaluatedProblemResults.push({
        problem: p.problem,
        status,
        pointsEarned,
      });
    });

    const elapsedSeconds = Math.min(
      assessment.duration * 60,
      Math.floor((Date.now() - new Date(result.startedAt).getTime()) / 1000)
    );

    const accuracy =
      attemptedCount > 0 ? Math.round((solvedCount / attemptedCount) * 100) : 0;

    result.submittedAt = new Date();
    result.score = totalScore;
    result.attempted = attemptedCount;
    result.solved = solvedCount;
    result.accuracy = accuracy;
    result.timeUsed = elapsedSeconds;
    result.isCompleted = true;
    result.problemResults = evaluatedProblemResults;

    await result.save();

    res.status(200).json({
      success: true,
      message: 'Assessment submitted successfully',
      result: {
        score: result.score,
        maxScore: result.maxScore,
        attempted: result.attempted,
        solved: result.solved,
        accuracy: result.accuracy,
        timeUsed: result.timeUsed,
        submittedAt: result.submittedAt,
        problemResults: result.problemResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment results and leaderboard (for students and teachers)
// @route   GET /api/assessments/:id/results
// @access  Private
const getAssessmentResults = async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({
      assessmentId: req.params.id,
      isCompleted: true,
    })
      .populate('userId', 'name email')
      .sort({ score: -1, timeUsed: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an assessment
// @route   POST /api/assessments
// @access  Private (Admin only)
const createAssessment = async (req, res, next) => {
  try {
    const { title, description, duration, problems, totalMarks } = req.body;

    if (!title || !duration || !problems || problems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title, duration (minutes), and at least one problem are required',
      });
    }

    const assessment = await Assessment.create({
      title,
      description: description || '',
      duration: parseInt(duration, 10),
      problems,
      totalMarks: totalMarks || 100,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an assessment
// @route   PUT /api/assessments/:id
// @access  Private (Admin only)
const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Admin only)
const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    await assessment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssessments,
  getAssessmentById,
  startAssessment,
  submitAssessment,
  getAssessmentResults,
  createAssessment,
  updateAssessment,
  deleteAssessment,
};
