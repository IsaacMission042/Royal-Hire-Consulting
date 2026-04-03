const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String, // URL to image
        default: ''
    },
    price: {
        type: Number,
        default: 0 // 0 = Free
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    category: {
        type: String,
        default: 'General'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    googleMeetLink: {
        type: String,
        default: ''
    },
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
