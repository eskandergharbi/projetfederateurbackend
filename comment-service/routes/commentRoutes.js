const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Create a new comment
router.post('/', commentController.createComment);

// Get comments by task ID
router.get('/task/:taskId', commentController.getCommentsByTaskId);

// Delete a comment
router.delete('/:id', commentController.deleteComment);

module.exports = router;