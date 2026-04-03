const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    completedLessons: [{
        type: String // URL or ID of the specific content item
    }],
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'refunded'],
        default: 'pending' // For paid courses
    }
}, { timestamps: true });

// Prevent duplicate enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
