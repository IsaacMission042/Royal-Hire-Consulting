const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'royal_hire_secret_keys_2026');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return next();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'royal_hire_secret_keys_2026');
        req.user = decoded.user;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

// @route   GET api/courses/user/enrolled
// @desc    Get enrolled courses for current user (MUST be before /:id)
router.get('/user/enrolled', auth, async (req, res) => {
    try {
        if (require('mongoose').connection.readyState !== 1) {
            console.log(`[TEST MODE] Returning mock enrollment for ${req.user.id}`);
            return res.json([{
                _id: 'mock_enrollment_1',
                user: req.user.id,
                course: {
                    _id: 'mock_course_1',
                    title: 'Business Consulting Mastery',
                    thumbnail: '',
                    instructor: { name: 'Royal Hire Team' }
                },
                progress: 0,
                status: 'active'
            }]);
        }
        const enrollments = await Enrollment.find({ user: req.user.id })
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'name' }
            });

        res.json(enrollments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/courses
// @desc    Get all published courses
router.get('/', optionalAuth, async (req, res) => {
    try {
        // Check if database is connected
        if (!req.isDBConnected) {
            console.log('Database not connected, returning mock courses');
            return res.json([
                {
                    _id: 'mock_course_1',
                    title: 'Business Consulting Mastery',
                    description: 'Learn the fundamentals of business consulting.',
                    price: 3000,
                    level: 'Beginner',
                    thumbnail: '',
                    instructor: { name: 'Royal Hire Team' },
                    isPublished: true
                },
                {
                    _id: 'mock_course_2',
                    title: 'Advanced Professional Services',
                    description: 'Deep dive into specialized consulting techniques.',
                    price: 3000,
                    level: 'Intermediate',
                    thumbnail: '',
                    instructor: { name: 'Dr. Sarah Johnson' },
                    isPublished: true
                }
            ]);
        }

        const courses = await Course.find({ isPublished: true })
            .populate('instructor', 'name email')
            .select('-modules'); // Lightweight list
        res.json(courses);
    } catch (err) {
        console.error('Courses route error:', err.message);
        // If DB is not connected yet (buffering timeout), return empty array gracefully
        // so the frontend can still load without a crash
        if (err.name === 'MongooseError' || err.message?.includes('buffering timed out') || err.message?.includes('ECONNREFUSED')) {
            return res.json([]);
        }
        res.status(500).send('Server error');
    }
});

// @route   GET api/courses/:id
// @desc    Get course details with modules (Unlock status dependent on enrollment)
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const isMockId = req.params.id?.startsWith('mock_');
        if (!req.isDBConnected || isMockId) {
            console.log(`[TEST MODE] Returning mock course details for ${req.params.id}`);
            return res.json({
                _id: req.params.id,
                title: req.params.id === 'mock_course_1' ? 'Business Consulting Mastery' : 'Advanced Professional Services',
                description: 'Mock course description for testing.',
                price: 3000,
                modules: [
                    { _id: 'mod1', title: 'Introduction', status: 'locked' },
                    { _id: 'mod2', title: 'Consulting Frameworks', status: 'locked' }
                ],
                isEnrolled: false
            });
        }
        const course = await Course.findById(req.params.id).populate('modules');
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        let enrollment = null;
        if (req.user) {
            enrollment = await Enrollment.findOne({ user: req.user.id, course: course._id });
        }

        // Process modules to add status (locked/unlocked)
        const modulesWithStatus = course.modules.map(mod => {
            let status = 'locked';
            if (!course.isPublished && req.user?.role !== 'admin') return null; // Should not happen if query filters correctly but good safety

            // If user is admin or instructor, everything is unlocked
            if (req.user?.role === 'admin') {
                status = 'unlocked';
            }
            // If enrolled
            else if (enrollment && enrollment.status === 'active') {
                status = 'unlocked';
            } else {
                status = 'locked';
            }

            return {
                ...mod._doc,
                status
            };
        });

        res.json({ ...course._doc, modules: modulesWithStatus, isEnrolled: !!enrollment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/courses
// @desc    Create a new course (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    
    if (!req.isDBConnected) {
        return res.status(503).json({ msg: 'Database not connected. Please ensure MongoDB is running or update MONGODB_URI in .env' });
    }

    try {
        const { title, description, price, thumbnail, level, category, googleMeetLink } = req.body;
        const newCourse = new Course({
            title,
            description,
            price,
            thumbnail,
            level,
            category,
            googleMeetLink: googleMeetLink || '',
            instructor: req.user.id,
            isPublished: true // Auto publish for now
        });
        await newCourse.save();
        res.json(newCourse);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/courses/:id
// @desc    Update a course (Admin only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    if (!req.isDBConnected) {
        return res.status(503).json({ msg: 'Database not connected. Please ensure MongoDB is running or update MONGODB_URI in .env' });
    }

    try {
        const { title, description, price, thumbnail, level, category, googleMeetLink } = req.body;
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, price, thumbnail, level, category, googleMeetLink } },
            { new: true }
        );
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/courses/:id
// @desc    Delete a course (Admin only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        // Remove course reference from modules? or delete modules?
        // Option 1: Delete all modules associated
        const modules = await Module.find({ courseId: course._id });
        for (const mod of modules) {
            // Delete module or unset courseId?
            // Let's delete module to keep it clean.
            // We can use deleteMany but let's be careful.
        }
        await Module.deleteMany({ courseId: course._id });

        await Course.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/courses/choose-course
// @desc    Select a course after payment
router.post('/choose-course', auth, async (req, res) => {
    try {
        const { courseId } = req.body;

        // Check if database is connected
        if (require('mongoose').connection.readyState !== 1) {
            console.log(`[TEST MODE] Mock enrolling user ${req.user.id} in course ${courseId}`);
            // Simple mock validation
            if (!courseId.startsWith('mock_')) {
                 // Even if it's not a mock ID, we allow it for testing if DB is down
            }
            return res.json({ 
                msg: 'Course selected successfully (Mock Mode)', 
                enrollment: {
                    user: req.user.id,
                    course: courseId,
                    paymentStatus: 'completed',
                    status: 'active'
                } 
            });
        }
        
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        // Check if already enrolled in any course (restrict to 1 for now as per requirement)
        const existingEnrollment = await Enrollment.findOne({ user: req.user.id });
        if (existingEnrollment) {
            return res.status(400).json({ msg: 'You are already enrolled in a course' });
        }

        const enrollment = new Enrollment({
            user: req.user.id,
            course: courseId,
            paymentStatus: 'completed',
            status: 'active'
        });

        await enrollment.save();
        res.json({ msg: 'Course selected successfully', enrollment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
