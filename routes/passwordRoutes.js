// routes/passwordRoutes.js
const express = require('express');
const router = express.Router();

// You'll need to implement these controller functions
const { sendPasswordResetEmail, resetPassword } = require('../controllers/passwordController');

router.post('/request-password-reset', sendPasswordResetEmail);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
