const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    fileId: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Document', DocumentSchema);