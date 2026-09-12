const express = require('express');
const router = express.Router();
const {
  runCode,
  submitCode,
  getMySubmissions,
  getProblemSubmissions,
  getAllSubmissions,
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.get('/my', protect, getMySubmissions);
router.get('/problem/:problemId', protect, getProblemSubmissions);

// Admin-only submission monitoring
router.get('/admin/all', protect, requireAdmin, getAllSubmissions);

module.exports = router;
