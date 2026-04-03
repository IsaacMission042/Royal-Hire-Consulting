const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true // This will store the hashed access code
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    accessCode: {
        type: String,
        unique: true,
        sparse: true // Only present for completed payments
    },
    accessCode: {
        type: String,
        unique: true,
        sparse: true // Only present for completed payments
    },
    // currentModule removed in favor of Enrollment model

    fullName: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    educationalBackground: {
        type: String,
        trim: true
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
