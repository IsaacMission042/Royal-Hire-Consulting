const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const jwt = require('jsonwebtoken');

const isDbConnected = () => require('mongoose').connection.readyState === 1;

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

// --- ASSIGNMENT ROUTES ---

// @route   GET api/modules/assignments/all
// @desc    Get all assignments (Admin)
router.get('/assignments/all', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const assignments = await Assignment.find().sort({ moduleNumber: 1 });
        res.json(assignments);
    } catch (err) {
        console.error('Assignments All error:', err);
        res.status(500).send('Server error');
    }
});

// @route   GET api/modules/assignments/:moduleNumber
// @desc    Get assignment for a module
router.get('/assignments/:moduleNumber', auth, async (req, res) => {
    try {
        const assignment = await Assignment.findOne({ moduleNumber: req.params.moduleNumber });
        res.json(assignment);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   POST api/modules/assignments
// @desc    Create/Update an assignment (Admin)
router.post('/assignments', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    const { _id, moduleNumber, title, description, instructions, resources, submissionType } = req.body;
    try {
        let assignment;
        if (_id) {
            assignment = await Assignment.findByIdAndUpdate(
                _id,
                { $set: { moduleNumber, title, description, instructions, resources, submissionType } },
                { new: true }
            );
        } else {
            // Check if moduleNumber already has an assignment
            assignment = await Assignment.findOne({ moduleNumber });
            if (assignment) {
                assignment = await Assignment.findByIdAndUpdate(
                    assignment._id,
                    { $set: { title, description, instructions, resources, submissionType } },
                    { new: true }
                );
            } else {
                assignment = new Assignment({ moduleNumber, title, description, instructions, resources, submissionType });
                await assignment.save();
            }
        }
        res.json(assignment);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/modules/assignments/:id
// @desc    Delete an assignment (Admin)
router.delete('/assignments/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Assignment removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// @route   GET api/modules
// @desc    Get all modules (Admin only or generic list without status)
router.get('/', auth, async (req, res) => {
    try {
        const modules = await Module.find().sort({ moduleNumber: 1 });
        res.json(modules);
    } catch (err) {
        console.error('Modules GET error:', err);
        res.status(500).send('Server error');
    }
});

// @route   GET api/modules/:id
// @desc    Get details of a single module
router.get('/:id', auth, async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ msg: 'Module not found' });

        // Access Control Logic
        if (req.user.role !== 'admin') {
            // Check enrollment
            if (!module.courseId) {
                // Legacy module without course? Allow if public or handle error.
                // For now, allow access to view content if it exists?
                // Strict: Deny.
                // MVP: Allow.
            } else {
                const enrollment = await Enrollment.findOne({ user: req.user.id, course: module.courseId });
                if (!enrollment) return res.status(403).json({ msg: 'Not enrolled in this course' });

                // Check if unlocked? 
                // Creating a "isLocked" logic here based on enrollment progress
                // can be complex. relying on frontend to respect the lock from Course details
                // but strictly we should check here.
                // Logic: If previous modules in course are completed?
                // For MVP: If enrolled, allow access.
            }
        }

        res.json(module);
    } catch (err) {
        console.error('Module Detail GET error:', err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/modules/submit
// @desc    Submit an assignment
router.post('/submit', auth, async (req, res) => {
    const { moduleId, submissionUrl, assignmentId } = req.body;
    try {
        const module = await Module.findById(moduleId);
        if (!module) return res.status(404).json({ msg: 'Module not found' });

        // Check enrollment
        let enrollment;
        if (module.courseId) {
            enrollment = await Enrollment.findOne({ user: req.user.id, course: module.courseId });
            if (!enrollment) return res.status(403).json({ msg: 'Not enrolled in this course' });
        }

        // Check if submission already exists?
        // optional

        const newSubmission = new Submission({
            user: req.user.id,
            moduleNumber: module.moduleNumber, // Legacy support
            assignmentId,
            submissionUrl,
            status: 'under review'
        });

        await newSubmission.save();
        res.json(newSubmission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/modules/admin/review
// @desc    Admin reviews an assignment
router.post('/admin/review', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    const { submissionId, status, feedback } = req.body;
    try {
        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ msg: 'Submission not found' });

        submission.status = status;
        submission.feedback = feedback;
        submission.reviewedBy = req.user.id;
        await submission.save();

        if (status === 'approved') {
            // Update enrollment progress
            // We need to find the module and course
            // Submission has moduleNumber, but we prefer ID linkage. 
            // Older submissions might lack ID linkage.

            // Try to find module by moduleNumber and "presumed" course or find usage
            // This is tricky with legacy data.
            // Assumption: we are moving forward.
            // Ideally submission should store moduleId.

            // For now, let's try to find if we can link it back.
            // If we can't easily link to Enrollment, we skip automated progress update 
            // or we need to look up enrollment by user and "active" course?

            // Improved Logic:
            // 1. Find Module by moduleNumber (if unique-ish) or update Submission model to include courseId/moduleId
            // Let's rely on finding Enrollment for the user.

            // Hacky workaround for MVP transition: Update ALL active enrollments for this user? No.
            // Safe bet: Do nothing automatically if we can't be sure, OR
            // update the legacy User.currentModule just in case code still looks at it (even though we removed it from schema, Mongoose might allow strict:false access? No, we removed it.)

            // Let's try provided we have module info.
            // We can fetch all courses, find which one contains module with this moduleNumber? Expensive.
        }

        res.json(submission);
    } catch (err) {
        console.error('Review error:', err);
        res.status(500).json({ msg: 'Server error during review', error: err.message });
    }
});

// @route   GET api/modules/admin/all-submissions
// @desc    Admin gets all submissions
router.get('/admin/all-submissions', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });

    try {
        const submissions = await Submission.find().populate('user', 'email').sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        console.error('All Submissions error:', err);
        res.status(500).send('Server error');
    }
});

// @route   POST api/modules
// @desc    Create a new module (Admin only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const { courseId, ...moduleData } = req.body;
        console.log('Creating module for course:', courseId);

        const newModule = new Module({ ...moduleData, courseId });
        await newModule.save();

        // If courseId provided, add to Course module list
        if (courseId) {
            await Course.findByIdAndUpdate(courseId, { $push: { modules: newModule._id } });
        }

        res.json(newModule);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/modules/:id
// @desc    Update a module (Admin only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const module = await Module.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(module);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/modules/:id
// @desc    Delete a module (Admin only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const module = await Module.findById(req.params.id);
        if (module) {
            if (module.courseId) {
                await Course.findByIdAndUpdate(module.courseId, { $pull: { modules: module._id } });
            }
            await Module.findByIdAndDelete(req.params.id);
        }
        res.json({ msg: 'Module removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



// @route   POST api/modules/init/:courseId
// @desc    Initialize modules 1-8 for a course
router.post('/init/:courseId', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    try {
        const courseId = req.params.courseId;
        const existingModules = await Module.find({ courseId });

        if (existingModules.length > 0) {
            return res.status(400).json({ msg: 'Course already has modules' });
        }

        const modulesToCreate = [];
        for (let i = 1; i <= 8; i++) {
            modulesToCreate.push({
                title: `Module ${i}`,
                moduleNumber: i,
                description: `Content for Module ${i}`,
                courseId: courseId,
                content: [],
                duration: '0m',
                isLocked: i > 1 // Lock all except first by default? or based on model defaults
            });
        }

        const createdModules = await Module.insertMany(modulesToCreate);

        // Push new module IDs to Course
        const moduleIds = createdModules.map(m => m._id);
        await Course.findByIdAndUpdate(courseId, { $push: { modules: { $each: moduleIds } } });

        res.json(createdModules);
    } catch (err) {
        console.error('Module Init error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
