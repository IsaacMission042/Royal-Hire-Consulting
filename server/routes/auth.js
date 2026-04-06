const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Simple in-memory storage for testing (deprecated in serverless)
const mockUsers = new Map();
const isDbConnected = (req) => req ? req.isDBConnected : false;

// Generate a random 6-digit access code
// Generate a random 6-digit code
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// @route   POST api/auth/register-intent
// @desc    Register email and set status to pending payment
router.post('/register-intent', async (req, res) => {
    const email = req.body.email?.toLowerCase().trim();
    if (!email) return res.status(400).json({ msg: 'Email is required' });
    
    try {
        if (isDbConnected(req)) {
            let user = await User.findOne({ email });
            if (user) {
                // If user exists but is just pending payment, allow proceeding
                if (user.password === 'pending_payment') {
                    return res.json({ msg: 'Registration intent verified. Proceed to payment.' });
                }
                return res.status(400).json({ msg: 'User already exists. Please log in.' });
            }

            user = new User({ email, password: 'pending_payment' });
            await user.save();
        } else {
            // DB is down, stateless mock
            console.log(`[TEST MODE] Mock registration intent saved statelessly for ${email}`);
            return res.json({ msg: 'Registration intent saved. Proceed to payment. (Mock Mode)' });
        }

        res.json({ msg: 'Registration intent saved. Proceed to payment.' });
    } catch (err) {
        console.error('Registration Intent Error:', err.message);
        res.status(500).json({ msg: 'An error occurred during registration.' });
    }
});

// @route   POST api/auth/verify-payment
// @desc    Verify payment via Paystack and generate OTP
router.post('/verify-payment', async (req, res) => {
    const { reference } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    try {
        let isVerified = false;

        if (process.env.NODE_ENV === 'development' && reference.startsWith('MOCK_')) {
            isVerified = true;
        } else {
            // Real Paystack Verification
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            });
            if (response.data.status && response.data.data.status === 'success') {
                isVerified = true;
            }
        }

        if (!isVerified) {
            return res.status(400).json({ msg: 'Payment verification failed' });
        }

        const otp = generateCode();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        if (isDbConnected(req)) {
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({ email, password: 'pending_setup' });
            }
            user.paymentStatus = 'completed';
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            console.log(`[TEST MODE] OTP ${otp} generated statelessly for ${email}`);
        }

        // Send OTP via Email
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your Royal Hire Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #6d28d9; text-align: center;">Welcome to Royal Hire Consulting!</h2>
                    <p>Thank you for your payment. Please use the verification code below to complete your registration and set your password:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otp}</span>
                    </div>
                    <p style="font-size: 12px; color: #6b7280; text-align: center;">This code will expire in 10 minutes.</p>
                    <p style="font-size: 10px; color: #9ca3af; text-align: center; margin-top: 20px;">(Development Mode: You can also use 000000 if email fails)</p>
                </div>
            `
        };

        console.log(`Attempting to send OTP to: ${email}`);
        try {
            await transporter.sendMail(mailOptions);
            console.log(`OTP email sent successfully to: ${email}`);
        } catch (mailErr) {
            console.error(`Mail delivery failed, but proceeding in Test Mode:`, mailErr.message);
            // In Test/Dev mode, we don't block the user if email hardware is down/misconfigured
            if (process.env.NODE_ENV !== 'production') {
                return res.json({ 
                    msg: 'Payment verified. [NOTE: Email failed, use 000000 for testing]', 
                    mockNotice: true 
                });
            }
            throw mailErr;
        }

        res.json({ msg: 'Payment verified. OTP sent to email.' });
    } catch (err) {
        console.error('Payment Verification Error:', err.message);
        res.status(500).json({ msg: 'Verification processing failed. Please check credentials or try master code.' });
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP for a user
router.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    try {
        if (!isDbConnected(req) && otp === '000000') {
            console.log(`[TEST MODE] Stateless OTP verification for ${email}`);
            return res.json({ msg: 'OTP verified (Mock Mode)' });
        }

        if (isDbConnected(req)) {
            const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid or expired OTP' });
            }
        } else {
            return res.status(400).json({ msg: 'Invalid or expired OTP. Use 000000 for Test Mode.' });
        }
        res.json({ msg: 'OTP verified' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/setup-password
// @desc    Set password after OTP verification
router.post('/setup-password', async (req, res) => {
    const { otp, password } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    try {
        let userData;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (isDbConnected(req)) {
            const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
            // Allow master OTP check universally
            const isMasterOtp = otp === '000000';
            
            let targetUser = user;
            if (!targetUser && isMasterOtp) {
                targetUser = await User.findOne({ email });
            }

            if (!targetUser) {
                return res.status(400).json({ msg: 'Invalid or expired OTP. Please restart the process.' });
            }

            targetUser.password = hashedPassword;
            targetUser.otp = undefined;
            targetUser.otpExpires = undefined;
            await targetUser.save();
            
            userData = {
                id: targetUser.id,
                email: targetUser.email,
                role: targetUser.role,
                name: targetUser.fullName || targetUser.email.split('@')[0]
            };
        } else {
            if (otp !== '000000') {
                return res.status(400).json({ msg: 'Invalid or expired OTP (Mock mode requires 000000)' });
            }
            console.log(`[TEST MODE] Stateless password setup for ${email}`);
            userData = {
                id: 'mock_' + Date.now(),
                email: email,
                role: 'student',
                name: email.split('@')[0]
            };
        }

        // Generate token for auto-login
        const payload = { user: { id: userData.id, role: userData.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'royal_hire_secret_keys_2026', { expiresIn: '24h' });

        res.json({
            token,
            user: userData
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Login student with email and password
router.post('/login', async (req, res) => {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase().trim();
    try {
        let user;
        let isMock = false;

        if (isDbConnected(req)) {
            user = await User.findOne({ email });
        }
        
        // Stateless mock fallback
        if (!user && !isDbConnected(req)) {
            console.log(`[TEST MODE] Logging in via stateless mock for ${email}`);
            user = {
                id: 'mock_user_' + Date.now(),
                email: email,
                password: await bcrypt.hash(password, 10), // dynamically match for mock
                role: 'student',
                paymentStatus: 'completed',
                fullName: email.split('@')[0]
            };
            isMock = true;
        }

        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
        if (user.paymentStatus !== 'completed' && !isMock) return res.status(400).json({ msg: 'Payment pending' });

        const storedPassword = user.password;
        const isMatch = await bcrypt.compare(password, storedPassword);
        
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const userData = {
            id: user.id,
            role: user.role || 'student',
            email: user.email,
            name: user.fullName || user.email.split('@')[0]
        };

        const payload = { user: { id: userData.id, role: userData.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'royal_hire_secret_keys_2026', { expiresIn: '24h' });
        res.json({ token, user: userData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/admin-login
// @desc    Specialized admin login with email/password
router.post('/admin-login', async (req, res) => {
    let { email, password } = req.body;
    try {
        const ADMIN_EMAIL = "royalhireconsulting@gmail.com";
        const ADMIN_PASS = "RoyalHire@2026";

        // Normalize inputs
        const normalizedEmail = email?.toLowerCase().trim();
        const normalizedPass = password?.trim();

        console.log(`Admin login attempt: ${normalizedEmail}`);

        if (normalizedEmail === ADMIN_EMAIL && normalizedPass === ADMIN_PASS) {
            let user;
            if (isDbConnected(req)) {
                try {
                    user = await User.findOne({ email: normalizedEmail });
                    if (!user) {
                        user = new User({
                            email: normalizedEmail,
                            password: await bcrypt.hash(normalizedPass, 10),
                            role: 'admin',
                            paymentStatus: 'completed'
                        });
                        await user.save();
                    }
                } catch (dbErr) {
                    console.error('Admin DB sync failed, continuing with static admin:', dbErr.message);
                }
            }

            const payload = { user: { id: user?.id || 'admin_static', role: 'admin' } };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'royal_hire_secret_keys_2026', { expiresIn: '24h' });

            return res.json({
                token,
                user: {
                    id: user?.id || 'admin_static',
                    _id: user?.id || 'admin_static',
                    email: ADMIN_EMAIL,
                    role: 'admin',
                    name: 'Royal Hire Admin'
                }
            });
        }

        res.status(401).json({ msg: 'Invalid Admin Credentials' });
    } catch (err) {
        console.error('Admin Login Error:', err.message);
        res.status(500).send('Server error');
    }
});

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

// @route   PUT api/auth/update-profile
// @desc    Update user profile details
router.put('/update-profile', auth, async (req, res) => {
    try {
        if (!isDbConnected(req)) {
            return res.json({ msg: '[MOCK] Profile updated successfully' });
        }

        const { fullName, phoneNumber, address, gender, educationalBackground } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;
        user.gender = gender || user.gender;
        user.educationalBackground = educationalBackground || user.educationalBackground;

        await user.save();

        res.json({
            msg: 'Profile updated successfully',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                name: user.fullName // For general display
            }
        });
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
