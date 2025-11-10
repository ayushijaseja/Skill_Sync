const Feedback = require('../models/Feedback');

// Submit feedback - any authenticated user
const submitFeedback = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    // Validation
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // req.user is set by protect middleware
    const feedback = await Feedback.create({
      user: req.user._id,
      fullName,
      email,
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all feedbacks - admin only
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email'); // populate user info

    return res.status(200).json({
      success: true,
      data: feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { submitFeedback, getAllFeedbacks };
