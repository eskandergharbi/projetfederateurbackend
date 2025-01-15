const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Define routes for projects
router.post('/', projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject); // Update project
router.delete('/:id', projectController.deleteProject); // Delete project

module.exports = router;