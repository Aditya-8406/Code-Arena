const Problem = require('../models/Problem');
const User = require('../models/User');

// @desc    Get all problems with filtering & pagination
// @route   GET /api/problems
// @access  Public (Enhanced if authenticated)
const getProblems = async (req, res, next) => {
  try {
    const { topic, difficulty, search, status, page = 1, limit = 12 } = req.query;

    const query = {};

    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by solved / unsolved if user is authenticated and status filter provided
    if (req.user && status && (status === 'solved' || status === 'unsolved')) {
      const user = await User.findById(req.user._id).select('solvedProblems');
      const solvedIds = user.solvedProblems.map((sp) => sp.problem);

      if (status === 'solved') {
        query._id = { $in: solvedIds };
      } else if (status === 'unsolved') {
        query._id = { $nin: solvedIds };
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    // Do not leak hidden test cases in list view
    const [problems, total] = await Promise.all([
      Problem.find(query)
        .select('-hiddenTestCases -sampleTestCases')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Problem.countDocuments(query),
    ]);

    // Attach solved flag if user is logged in
    let solvedIdSet = new Set();
    if (req.user) {
      const user = await User.findById(req.user._id).select('solvedProblems');
      if (user && user.solvedProblems) {
        solvedIdSet = new Set(user.solvedProblems.map((sp) => sp.problem.toString()));
      }
    }

    const formattedProblems = problems.map((p) => ({
      ...p,
      isSolved: solvedIdSet.has(p._id.toString()),
    }));

    res.status(200).json({
      success: true,
      count: formattedProblems.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      problems: formattedProblems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single problem by ID or Slug
// @route   GET /api/problems/:id
// @access  Public
const getProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    let query = {};
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: id };
    } else {
      query = { slug: id };
    }

    let problemQuery = Problem.findOne(query);

    // If user is not admin, hide hidden test cases
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
      problemQuery = problemQuery.select('-hiddenTestCases');
    }

    const problem = await problemQuery.exec();

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    let isSolved = false;
    if (req.user) {
      const user = await User.findById(req.user._id).select('solvedProblems');
      if (user && user.solvedProblems) {
        isSolved = user.solvedProblems.some(
          (sp) => sp.problem.toString() === problem._id.toString()
        );
      }
    }

    res.status(200).json({
      success: true,
      problem: {
        ...problem.toObject(),
        isSolved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private (Admin only)
const createProblem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      topic,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      examples,
      starterCode,
      sampleTestCases,
      hiddenTestCases,
      tags,
    } = req.body;

    if (!title || !description || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, topic, and difficulty are required',
      });
    }

    if (!hiddenTestCases || hiddenTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one hidden test case is required for automated evaluation',
      });
    }

    const problem = await Problem.create({
      title,
      description,
      topic,
      difficulty,
      constraints: constraints || '',
      inputFormat: inputFormat || '',
      outputFormat: outputFormat || '',
      examples: examples || [],
      starterCode: starterCode || {},
      sampleTestCases: sampleTestCases || [],
      hiddenTestCases: hiddenTestCases || [],
      tags: tags || [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      problem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing problem
// @route   PUT /api/problems/:id
// @access  Private (Admin only)
const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      problem: updatedProblem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private (Admin only)
const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
};
