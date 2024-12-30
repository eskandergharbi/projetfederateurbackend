const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ',
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    status: {
        type: String,
        enum: ['not started', 'in progress', 'completed'],
        default: 'not started',
    },
    progress: {
        type: Number,
        default: 0, // Percentage of completion
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);