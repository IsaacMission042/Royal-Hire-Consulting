const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Module = require('./models/Module');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

dotenv.config();

const modules = [
    {
        title: "Course Foundations",
        description: "Introduction to Royal Hire Consulting frameworks and goal setting.",
        moduleNumber: 1, // Legacy support
        isLocked: false,
        content: [
            { type: 'video', title: "Welcome to the Program", url: "https://example.com/video1" },
            { type: 'pdf', title: "Foundation Guide", url: "https://example.com/pdf1" }
        ]
    },
    {
        title: "Advanced Market Analysis",
        description: "Deep dive into local and international market research strategies.",
        moduleNumber: 2,
        isLocked: true,
        content: [
            { type: 'video', title: "Market Research 101", url: "https://example.com/video2" }
        ]
    },
    {
        title: "Strategic Resource Planning",
        description: "Efficiently managing human and material capital.",
        moduleNumber: 3,
        isLocked: true,
        content: [{ type: 'video', title: "Resource Allocation", url: "https://example.com/video3" }]
    },
    {
        title: "Professional Communication",
        description: "Mastering the art of dialogue and persuasion.",
        moduleNumber: 4,
        isLocked: true,
        content: [{ type: 'video', title: "Effective Pitching", url: "https://example.com/video4" }]
    },
    {
        title: "Leadership & Management",
        description: "Developing the mindset of a global leader.",
        moduleNumber: 5,
        isLocked: true,
        content: [{ type: 'video', title: "Leadership Styles", url: "https://example.com/video5" }]
    },
    {
        title: "Financial Intelligence",
        description: "Understanding cash flow, equity, and investment.",
        moduleNumber: 6,
        isLocked: true,
        content: [{ type: 'video', title: "Reading Balance Sheets", url: "https://example.com/video6" }]
    },
    {
        title: "Capstone Project",
        description: "Final project demonstrating all acquired skills.",
        moduleNumber: 7,
        isLocked: true,
        content: [{ type: 'video', title: "Capstone Guidelines", url: "https://example.com/video7" }]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-hire');

        console.log('Clearing database...');
        await Module.deleteMany({});
        await Course.deleteMany({});
        await User.deleteMany({ email: 'admin@royalhire.com' });

        // Seed Admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('RoyalHire@2026', salt); // Updated to match config
        const admin = new User({
            email: 'royalhireconsulting@gmail.com', // Match auth.js hardcoded admin check if preserved, or standard admin
            password: hashedPassword,
            role: 'admin',
            paymentStatus: 'completed',
            fullName: 'Royal Hire Admin'
        });
        await admin.save();
        console.log('Admin User Created');

        // Seed Course
        const course = new Course({
            title: "Royal Hire Consulting Masterclass",
            description: "The complete professional development program.",
            price: 25000,
            thumbnail: "/bg.jpg", // Placeholder
            instructor: admin._id,
            level: "Advanced",
            isPublished: true
        });
        await course.save();

        // Seed Modules linked to Course
        const createdModuleIds = [];
        for (const modData of modules) {
            const mod = new Module({
                ...modData,
                courseId: course._id
            });
            await mod.save();
            createdModuleIds.push(mod._id);
        }

        // Update Course with modules
        course.modules = createdModuleIds;
        await course.save();

        console.log('Course and Modules Seeded!');
        console.log('Run the server to see the new data.');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
