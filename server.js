const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/user'); // Import the User model from user.js
const Event = require('./event');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes'); 
app.use(authRoutes);
app.use(passwordRoutes);

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
 
app.get('/events', async (req, res) => {
  const { city, neighborhood, date, organizer } = req.query;
  let query = {};
  if(city) query.city = city;
  if(neighborhood) query.neighborhood = neighborhood;
  if(date) query.date = { $gte: new Date(date) };
  if(organizer) query.organizer = organizer;
 
  try {
    const events = await Event.find(query).populate('organizer', 'username');
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events: ' + error.message);
  }
});
