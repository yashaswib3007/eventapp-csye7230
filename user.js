const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['organizer', 'attendee'] }, // Added role field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
