const Comment = require('../models/Comment');

// Add a comment
exports.addComment = async (req, res) => {
    const { taskId, comment } = req.body;
    const userId = req.user.id; // Get userId from the authenticated user
    try {
        const newComment = await Comment.create({ taskId, userId, comment });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comments for a task
exports.getComments = async (req, res) => {
    const { taskId } = req.params;
    try {
        const comments = await Comment.find({ taskId }).populate('userId', 'name'); // Populate userId with user name
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};