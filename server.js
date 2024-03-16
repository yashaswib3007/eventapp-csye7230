const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/user'); // Import the User model from user.js
const Event = require('./event');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  // Set static folder to 'view/build'
  app.use(express.static('view/build'));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'view', 'build', 'index.html'));
  });
}


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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

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
 /*
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
*/
app.get('/user', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password from the result
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user data: ' + error.message);
  }
  const user = await User.findById(req.user.userId).select('+socialMediaId');
 
});
 
app.post('/user/updateSocialMediaId', verifyJWT, async (req, res) => {
  const { socialMediaId } = req.body;
  if (!socialMediaId) {
    return res.status(400).send('Social media ID is required');
  }
 
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { socialMediaId }, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.json({ message: 'Social media ID updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating social media ID: ' + error.message);
  }
});

app.get('/events', async (req, res) => {
  const { cities, neighborhoods, date, organizer } = req.query;
  let query = {};

  if (cities) {
    // Assuming cities is a comma-separated string of city names
    query.city = { $in: cities.split(',') };
  }

  if (neighborhoods) {
    // Assuming neighborhoods is a comma-separated string of neighborhood names
    query.neighborhood = { $in: neighborhoods.split(',') };
  }

  if (date) {
    // Fetch events from this date forward
    query.date = { $gte: new Date(date) };
  }

  if (organizer) {
    // Assuming organizer is the ID of the user organizing the events
    query.organizer = organizer;
  }

  try {
    const events = await Event.find(query).populate('organizer', 'username -_id');
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching events: ' + error.message);
  }
});
  
// Endpoint to get details of a specific event by ID
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'username email -_id');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching event details', error: error.message });
  }
});