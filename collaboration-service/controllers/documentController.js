const { google } = require('googleapis');
const Document = require('../models/Document');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage }).single('file');

// Upload a document
exports.uploadDocument = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        const { projectId } = req.body;
        const filePath = path.join(__dirname, '../uploads/', req.file.filename);

        // Authenticate with Google Drive
        const auth = new google.auth.GoogleAuth({
            keyFile: 'path/to/your/credentials.json', // Path to your credentials.json
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Upload file to Google Drive
        const fileMetadata = {
            name: req.file.filename,
            parents: [projectId], // Optional: specify a folder ID if needed
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(filePath),
        };

        try {
            const file = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            });

            // Save document metadata to the database
            const newDocument = await Document.create({
                fileId: file.data.id,
                fileName: req.file.filename,
                projectId,
                uploadedBy: req.user.id,
            });

            res.status(201).json(newDocument);
        } catch (error) {
            res.status(500).json({ message: error.message });
        } finally {
            // Clean up the uploaded file from the server
            fs.unlinkSync(filePath);
        }
    });
};

// Get documents for a project
exports.getDocuments = async (req, res) => {
    const { projectId } = req.params;
    try {
        const documents = await Document.find({ projectId }).populate('uploadedBy', 'name');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};