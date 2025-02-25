const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// ➤ Ajouter un commentaire
router.post('/', commentController.createComment);

// ➤ Obtenir les commentaires d'une tâche
router.get('/task/:taskId', commentController.getCommentsByTaskId);

// ➤ Supprimer un commentaire
router.delete('/:id', commentController.deleteComment);

module.exports = router;
