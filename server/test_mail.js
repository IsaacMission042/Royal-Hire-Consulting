const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const testMail = async () => {
    console.log('Using SMTP_USER:', process.env.SMTP_USER);
    // console.log('Using SMTP_PASS:', process.env.SMTP_PASS); // Security check: don't log password

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER, // Send to self
        subject: 'Royal Hire Test Email',
        text: 'This is a test email from Royal Hire Consulting to verify SMTP settings.'
    };

    try {
        console.log('Sending test email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

testMail();
