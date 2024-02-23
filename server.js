const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./user'); // Import the User model from user.js
const Event = require('./event');

require('dotenv').config();

const app = express();
app.use(express.json());

// Middleware to verify token (move this declaration above route handlers)

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer Token
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase')
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB:', error));

// User Registration Endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body; // Include role in the destructuring
    
    // You might want to validate the role here before proceeding
    if (!['organizer', 'attendee'].includes(role)) {
      return res.status(400).send('Invalid role specified');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Include role when creating the user
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' }); // Optionally include role in the token

    res.status(201).json({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering new user' + error.message);
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
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

    // Generate JWT Token, optionally include role in the token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in' + error.message);
  }
});


  
// Protected Route
app.get('/protected', verifyJWT, (req, res) => {
  res.json({ message: "You have accessed a protected route", user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Endpoint to create a new event
app.post('/event', verifyJWT, async (req, res) => {
  try {
    const { title, description, city, neighborhood, date } = req.body;
    const organizer = req.user.userId; // Assuming the userID is stored in req.user when verifying JWT

    const event = new Event({
      title,
      description,
      city,
      neighborhood,
      date,
      organizer
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new event: ' + error.message);
  }
});



// Endpoint to get all events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'username');
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events: ' + error.message);
  }
});


