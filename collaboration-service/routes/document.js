const express = require('express');
const { uploadDocument, getDocuments } = require('../controllers/documentController');
const auth = require('../middleware/auth');
const router = express.Router();

// Upload a document
router.post('/', auth, uploadDocument);

// Get documents for a project
router.get('/:projectId', auth, getDocuments);

module.exports = router;