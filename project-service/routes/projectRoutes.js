const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');


// Define routes for projects
router.post('/',authenticateToken, authorizeRole(['admin']), projectController.createProject);
router.get('/', authenticateToken,projectController.getAllProjects);
router.get('/:id',authenticateToken, projectController.getProjectById);
router.put('/:id',authenticateToken, authorizeRole(['admin']), projectController.updateProject); // Update project
router.delete('/:id',authenticateToken, authorizeRole(['admin']), projectController.deleteProject); // Delete project

module.exports = router;