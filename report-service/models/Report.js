const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
    reportData: {
        type: Object,
        required: true,
    },
});

module.exports = mongoose.model('Report', ReportSchema);