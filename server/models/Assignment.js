const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    moduleNumber: {
        type: Number,
        required: true
    },
    instructions: {
        type: String
    },
    resources: [{
        title: String,
        url: String
    }],
    submissionType: {
        type: String,
        enum: ['link', 'file', 'text'],
        default: 'link'
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
