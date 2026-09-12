const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const User = require('../models/User');
const { executeCode, evaluateSubmission } = require('../../executor/runner');
const { processAcceptedSubmission } = require('../services/gamificationService');

// @desc    Run code against sample test cases or custom input
// @route   POST /api/submissions/run
// @access  Private
const runCode = async (req, res, next) => {
  try {
    const { problemId, language, sourceCode, customInput } = req.body;

    if (!language || !sourceCode) {
      return res.status(400).json({
        success: false,
        message: 'Language and sourceCode are required',
      });
    }

    // If custom input is provided, execute single run
    if (customInput !== undefined && customInput !== null && customInput.trim() !== '') {
      const result = await executeCode(language, sourceCode, customInput);
      return res.status(200).json({
        success: true,
        isCustom: true,
        status: result.status,
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
      });
    }

    // Otherwise execute against problem's sample test cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    const testCases = problem.sampleTestCases && problem.sampleTestCases.length > 0
      ? problem.sampleTestCases
      : [{ input: '', expectedOutput: '' }];

    const evalResult = await evaluateSubmission(language, sourceCode, testCases, false);

    res.status(200).json({
      success: true,
      isCustom: false,
      status: evalResult.status,
      passedTests: evalResult.passedTests,
      totalTests: evalResult.totalTests,
      executionTime: evalResult.executionTime,
      results: evalResult.results,
      error: evalResult.error,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit code against hidden test cases and record submission
// @route   POST /api/submissions/submit
// @access  Private
const submitCode = async (req, res, next) => {
  try {
    const { problemId, language, sourceCode, assessmentId } = req.body;

    if (!problemId || !language || !sourceCode) {
      return res.status(400).json({
        success: false,
        message: 'ProblemId, language, and sourceCode are required',
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    // Combine sample and hidden test cases for complete verification
    const allEvaluationCases = [
      ...(problem.sampleTestCases || []),
      ...(problem.hiddenTestCases || []),
    ];

    if (allEvaluationCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No test cases configured for this problem',
      });
    }

    // Evaluate submission
    const evalResult = await evaluateSubmission(
      language,
      sourceCode,
      allEvaluationCases,
      true // hidden = true (hides hidden test case payloads)
    );

    // Increment problem submission counter
    problem.totalSubmissions = (problem.totalSubmissions || 0) + 1;
    await problem.save();

    // Create Submission entry
    const submission = await Submission.create({
      userId: req.user._id,
      problemId: problem._id,
      language,
      sourceCode,
      status: evalResult.status,
      passedTests: evalResult.passedTests,
      totalTests: evalResult.totalTests,
      executionTime: evalResult.executionTime,
      errorMessage: evalResult.error || null,
      assessmentId: assessmentId || null,
    });

    let gamificationResult = {
      pointsEarned: 0,
      isFirstSolve: false,
      newBadges: [],
    };

    // If accepted and not inside an assessment, process gamification (points, streak, badges)
    if (evalResult.status === 'ACCEPTED' && !assessmentId) {
      gamificationResult = await processAcceptedSubmission(
        req.user._id,
        problem._id,
        language
      );
    }

    res.status(201).json({
      success: true,
      submission: {
        id: submission._id,
        status: submission.status,
        passedTests: submission.passedTests,
        totalTests: submission.totalTests,
        executionTime: submission.executionTime,
        errorMessage: submission.errorMessage,
        createdAt: submission.createdAt,
      },
      gamification: gamificationResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's submission history
// @route   GET /api/submissions/my
// @access  Private
const getMySubmissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      Submission.find({ userId: req.user._id })
        .populate('problemId', 'title topic difficulty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Submission.countDocuments({ userId: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's previous submissions for a specific problem
// @route   GET /api/submissions/problem/:problemId
// @access  Private
const getProblemSubmissions = async (req, res, next) => {
  try {
    const { problemId } = req.params;

    const submissions = await Submission.find({
      userId: req.user._id,
      problemId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for admin monitoring
// @route   GET /api/submissions/admin/all
// @access  Private (Admin only)
const getAllSubmissions = async (req, res, next) => {
  try {
    const { status, language, page = 1, limit = 25 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (language && language !== 'All') {
      query.language = language;
    }

    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      Submission.find(query)
        .populate('userId', 'name email')
        .populate('problemId', 'title topic difficulty')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Submission.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  runCode,
  submitCode,
  getMySubmissions,
  getProblemSubmissions,
  getAllSubmissions,
};
