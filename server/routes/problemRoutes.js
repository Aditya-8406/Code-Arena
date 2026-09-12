const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { optionalAuth } = require('../middleware/optionalAuth');

router.get('/', optionalAuth, getProblems);
router.get('/:id', optionalAuth, getProblem);

// Admin-only problem management
router.post('/', protect, requireAdmin, createProblem);
router.put('/:id', protect, requireAdmin, updateProblem);
router.delete('/:id', protect, requireAdmin, deleteProblem);

module.exports = router;
