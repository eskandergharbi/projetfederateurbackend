const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

// Define routes for members
router.post('/', authenticateToken, authorizeRole(['admin','project_manager']),memberController.createMember);
router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMemberById);
router.put('/:id',authenticateToken, authorizeRole(['admin','project_manager']), memberController.updateMember); // Update member
router.delete('/:id',authenticateToken, authorizeRole(['admin','project_manager']), memberController.deleteMember); // Delete member

module.exports = router;