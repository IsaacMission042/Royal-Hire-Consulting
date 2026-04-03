const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    moduleNumber: {
        type: Number,
        required: true,
        unique: false
    },
    content: [{
        type: {
            type: String,
            enum: ['video', 'pdf', 'resource'],
            required: true
        },
        url: String,
        title: String
    }],
    duration: {
        type: String
    },
    isLocked: {
        type: Boolean,
        default: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
