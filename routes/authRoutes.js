// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const router = express.Router();

// User Registration Endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({ username, password: hashedPassword });
        await user.save();
    
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    
        res.status(201).json({ accessToken: token });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user' + error.message);
      }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
    
        // Find user by username
        const user = await User.findOne({ username });
    
        if (!user) {
          return res.status(401).json({ message: "Invalid username or password" });
        }
    
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid username or password" });
        }
    
        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    
        res.json({ accessToken: token });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in' + error.message);
      }
});

module.exports = router;
