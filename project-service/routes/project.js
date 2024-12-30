const express = require('express');
const { createProject, getProjects, updateProject, deleteProject, addMember } = require('../controllers/projectController');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Project
router.post('/', auth, createProject);

// Get All Projects
router.get('/', auth, getProjects);

// Update Project
router.put('/:id', auth, updateProject);

// Delete Project
router.delete('/:id', auth, deleteProject);

// Add Member to Project
router.post('/:id/members', auth, addMember);

module.exports = router;