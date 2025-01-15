const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Define routes for members
router.post('/', memberController.createMember);
router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMemberById);
router.put('/:id', memberController.updateMember); // Update member
router.delete('/:id', memberController.deleteMember); // Delete member

module.exports = router;