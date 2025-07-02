const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  reservedSeats: { type: Number, default: 0 },
  totalSeats: { type: Number, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true } 
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
