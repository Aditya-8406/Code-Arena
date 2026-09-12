const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessmentById,
  startAssessment,
  submitAssessment,
  getAssessmentResults,
  createAssessment,
  updateAssessment,
  deleteAssessment,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/', protect, getAssessments);
router.get('/:id', protect, getAssessmentById);
router.post('/:id/start', protect, startAssessment);
router.post('/:id/submit', protect, submitAssessment);
router.get('/:id/results', protect, getAssessmentResults);

// Admin-only assessment management
router.post('/', protect, requireAdmin, createAssessment);
router.put('/:id', protect, requireAdmin, updateAssessment);
router.delete('/:id', protect, requireAdmin, deleteAssessment);

module.exports = router;
