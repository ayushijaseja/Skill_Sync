const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Any authenticated user can submit feedback
router.post('/submit', protect, submitFeedback);

// Only admins can view all feedbacks
router.get('/all', protect, adminOnly, getAllFeedbacks);

module.exports = router;
