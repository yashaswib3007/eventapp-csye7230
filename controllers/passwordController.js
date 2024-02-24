// controllers/passwordController.js
const User = require('../models/user'); // Ensure the path is correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Make sure this is at the top of the file

const sendEmail = async ({ email, subject, message }) => {
    // Log for debugging
    console.log('Sending email to:', email);
    
    // Mailtrap configuration
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io', // Ensure correct host
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_FROM, // Sender email
        to: email, // Recipient email address
        subject: subject, // Email subject
        text: message, // Email content
    };

    // Attempt to send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ username: email });
    if (!user) {
        return res.status(404).send('User not found.');
    }

    // Password reset token generation
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token expiration
    await user.save();

    const resetURL = `http://your-frontend-domain/reset-password/${resetToken}`; // Replace with your actual frontend domain
    const message = `Forgot your password? Click here to reset your password: ${resetURL}`;

    try {
        await sendEmail({
            email: user.username, // Assuming the user's email is stored in the username field
            subject: 'Password Reset',
            message,
        });
        res.status(200).json({ message: 'Token sent to email!' });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).send('There was an error sending the email. Try again later.');
    }
};


// Function to reset the password
exports.resetPassword = async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).send('Token is invalid or has expired.');
    }

    if (!req.body.password) {
        return res.status(400).send('Password is required.');
    }

    try {
        user.password = await bcrypt.hash(req.body.password, 12);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        const accessToken = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ accessToken });
    } catch (error) {
        // Handle hashing or saving errors
        return res.status(500).send('An error occurred while resetting the password.');
    }
};
