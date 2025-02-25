const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member ',
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },

    status: {
        type: String,
        enum: ['not started', 'in progress', 'completed'],
        default: 'not started',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);