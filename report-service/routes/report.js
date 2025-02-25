const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController'); // Import du contrôleur
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Routes
router.get('/projects/statistics', reportController.getProjectStatistics);
router.get('/tasks/statistics', reportController.getTaskStatistics);

module.exports = router;
