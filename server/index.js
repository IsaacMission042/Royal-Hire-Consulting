const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware — restrict CORS to the frontend origin
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000'
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, server-to-server, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.set('bufferTimeoutMS', 3000); // Reduced timeout for faster failure

let cachedDb = null;
let isDBConnected = false;

const connectDB = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        isDBConnected = true;
        return cachedDb;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-hire', {
            serverSelectionTimeoutMS: 3000, // Reduced timeout
            socketTimeoutMS: 3000,
        });
        console.log('MongoDB connected successfully');
        cachedDb = conn;
        isDBConnected = true;
        return conn;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        isDBConnected = false;
        return null;
    }
};

// Middleware to ensure DB connection per request (vital for Serverless)
app.use(async (req, res, next) => {
    await connectDB();
    req.isDBConnected = isDBConnected;
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/modules', require('./routes/modules'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Royal Hire Platform API is running' });
});

connectDB();

const PORT = process.env.PORT || 5000;
// Only listen if not running via serverless
if (process.env.SERVE_HTTP !== 'false') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
