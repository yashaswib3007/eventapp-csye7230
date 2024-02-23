const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  neighborhood: { type: String },
  date: { type: Date, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Add other fields as needed for the event
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
