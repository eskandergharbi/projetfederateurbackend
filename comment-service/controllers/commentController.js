const Comment = require('../models/Comment');

// Create a new comment
exports.createComment = async (req, res) => {
    const { taskId, userId, text } = req.body;
    const comment = new Comment({ taskId, userId, text });

    try {
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get comments for a specific task
exports.getCommentsByTaskId = async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};