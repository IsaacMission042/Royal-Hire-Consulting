const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moduleNumber: {
        type: Number,
        required: true
    },
    submissionUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['under review', 'approved', 'rejected'],
        default: 'under review'
    },
    feedback: {
        type: String
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
