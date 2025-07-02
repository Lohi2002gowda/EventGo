const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.post('/', (req, res) => {
  const { name, date, time, duration, totalSeats, category, price } = req.body;

  if (price === undefined || price < 0) {
    return res.status(400).json({ message: 'Price must be a non-negative number' });
  }

  const newEvent = new Event({ name, date, time, duration, totalSeats, category, price });

  newEvent.save()
    .then(event => res.status(201).json(event))
    .catch(err => res.status(400).json({ error: err.message }));
});

router.get('/', (req, res) => {
  Event.find()
    .then(events => res.status(200).json(events))
    .catch(err => res.status(400).json({ error: err.message }));
});

router.post('/book/:eventId', (req, res) => {
  const { eventId } = req.params;
  const { seatsToBook } = req.body;

  if (seatsToBook <= 0) {
    return res.status(400).json({ message: 'Seats to book should be greater than 0' });
  }

  Event.findById(eventId)
    .then(event => {
      if (!event) return res.status(404).json({ message: 'Event not found' });

      if (event.reservedSeats + seatsToBook > event.totalSeats) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }

      event.reservedSeats += seatsToBook;
      event.save()
        .then(updatedEvent => res.status(200).json(updatedEvent))
        .catch(err => res.status(400).json({ error: err.message }));
    })
    .catch(err => res.status(400).json({ error: err.message }));
});

router.put('/:eventId', (req, res) => {
  const { eventId } = req.params;
  const updatedData = req.body;

  if (updatedData.price !== undefined && updatedData.price < 0) {
    return res.status(400).json({ message: 'Price must be a non-negative number' });
  }

  Event.findByIdAndUpdate(eventId, updatedData, { new: true })
    .then(updatedEvent => {
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(updatedEvent);
    })
    .catch(err => res.status(400).json({ error: err.message }));
});

router.delete('/:eventId', (req, res) => {
  const { eventId } = req.params;

  Event.findByIdAndDelete(eventId)
    .then(deletedEvent => {
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event deleted successfully' });
    })
    .catch(err => res.status(400).json({ error: err.message }));
});

module.exports = router;
