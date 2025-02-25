const Comment = require('../models/Comment');

// ➤ Ajouter un commentaire
exports.createComment = async (req, res) => {
    try {
        const { taskId, userId, text } = req.body;
        const comment = new Comment({ taskId, userId, text });
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// ➤ Obtenir les commentaires d'une tâche
exports.getCommentsByTaskId = async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ➤ Supprimer un commentaire
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
