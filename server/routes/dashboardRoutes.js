const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getTeacherDashboard,
  getStudentDetailForTeacher,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/student', protect, getStudentDashboard);
router.get('/teacher', protect, requireAdmin, getTeacherDashboard);
router.get('/student/:id', protect, requireAdmin, getStudentDetailForTeacher);

module.exports = router;
