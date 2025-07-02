// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const Event = require('./models/Event'); // Ensure you have a model for the Event

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/eventdb', {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Routes

// // GET route for fetching all events
// app.get('/events', (req, res) => {
//   Event.find()  // Fetch all events from the "events" collection
//     .then(events => {
//       res.status(200).json(events);  // Send the list of events as a response
//     })
//     .catch(error => {
//       console.error('Error fetching events:', error);
//       res.status(500).json({ message: 'Error fetching events' });
//     });
// });

// // POST route for creating a new event
// app.post('/events', (req, res) => {
//   const newEvent = new Event(req.body);  // Create a new event instance from the request body
//   newEvent.save()  // Save the new event to the database
//     .then(event => {
//       res.status(201).json(event);  // Return the created event
//     })
//     .catch(error => {
//       console.error('Error saving event:', error);
//       res.status(500).json({ message: 'Error saving event' });
//     });
// });

// // PUT route for updating an existing event
// app.put('/events/:id', (req, res) => {
//   const { id } = req.params;  // Get the event ID from the URL
//   const updatedEvent = req.body;  // Get the updated event data from the request body

//   Event.findByIdAndUpdate(id, updatedEvent, { new: true })  // Update the event in the database
//     .then(event => {
//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }
//       res.status(200).json(event);  // Return the updated event
//     })
//     .catch(error => {
//       console.error('Error updating event:', error);
//       res.status(500).json({ message: 'Error updating event' });
//     });
// });

// // DELETE route for deleting an event
// app.delete('/events/:id', (req, res) => {
//   const { id } = req.params;  // Get the event ID from the URL

//   Event.findByIdAndDelete(id)  // Delete the event from the database
//     .then(event => {
//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }
//       res.status(200).json({ message: 'Event deleted successfully' });  // Return a success message
//     })
//     .catch(error => {
//       console.error('Error deleting event:', error);
//       res.status(500).json({ message: 'Error deleting event' });
//     });
// });

// // POST route for booking seats for an event
// app.post('/events/book/:id', (req, res) => {
//   const { id } = req.params;  // Get the event ID from the URL
//   const { seatsToBook } = req.body;  // Get the number of seats to book from the request body

//   if (seatsToBook <= 0) {
//     return res.status(400).json({ message: 'Invalid number of seats to book' });
//   }

//   Event.findById(id)  // Find the event by ID
//     .then(event => {
//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }

//       // Check if there are enough available seats
//       if (event.totalSeats - event.reservedSeats < seatsToBook) {
//         return res.status(400).json({ message: 'Not enough seats available' });
//       }

//       // Update the reserved seats for the event
//       event.reservedSeats += seatsToBook;

//       // Save the updated event
//       event.save()
//         .then(updatedEvent => {
//           res.status(200).json(updatedEvent);  // Return the updated event with the new reserved seats
//         })
//         .catch(error => {
//           console.error('Error saving booked seats:', error);
//           res.status(500).json({ message: 'Error booking seats' });
//         });
//     })
//     .catch(error => {
//       console.error('Error finding event:', error);
//       res.status(500).json({ message: 'Error finding event' });
//     });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Event = require('./models/Event');

const app = express();
const PORT = 5000;
const HOST = '192.168.230.109'; // Directly using the IP

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/eventdb') // Directly using the MongoDB URI inline
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes

// GET route for fetching all events
app.get('/events', (req, res) => {
  Event.find()
    .then(events => res.status(200).json(events))
    .catch(error => {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events' });
    });
});

// POST route for creating a new event
app.post('/events', (req, res) => {
  const newEvent = new Event(req.body);
  newEvent.save()
    .then(event => res.status(201).json(event))
    .catch(error => {
      console.error('Error saving event:', error);
      res.status(500).json({ message: 'Error saving event' });
    });
});

// PUT route for updating an existing event
app.put('/events/:id', (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;

  Event.findByIdAndUpdate(id, updatedEvent, { new: true })
    .then(event => {
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json(event);
    })
    .catch(error => {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Error updating event' });
    });
});

// DELETE route for deleting an event
app.delete('/events/:id', (req, res) => {
  const { id } = req.params;

  Event.findByIdAndDelete(id)
    .then(event => {
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json({ message: 'Event deleted successfully' });
    })
    .catch(error => {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event' });
    });
});

// POST route for booking seats for an event
app.post('/events/book/:id', (req, res) => {
  const { id } = req.params;
  const { seatsToBook } = req.body;

  if (seatsToBook <= 0) {
    return res.status(400).json({ message: 'Invalid number of seats to book' });
  }

  Event.findById(id)
    .then(event => {
      if (!event) return res.status(404).json({ message: 'Event not found' });

      if (event.totalSeats - event.reservedSeats < seatsToBook) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }

      event.reservedSeats += seatsToBook;

      event.save()
        .then(updatedEvent => res.status(200).json(updatedEvent))
        .catch(error => {
          console.error('Error saving booked seats:', error);
          res.status(500).json({ message: 'Error booking seats' });
        });
    })
    .catch(error => {
      console.error('Error finding event:', error);
      res.status(500).json({ message: 'Error finding event' });
    });
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});


// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const Event = require('./models/Event');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://127.0.0.1:27017/eventdb', {})
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// app.get('/events', (req, res) => {
//   Event.find()
//     .then(events => {
//       res.status(200).json(events);  // Return all event fields
//     })
//     .catch(error => {
//       console.error('Error fetching events:', error);
//       res.status(500).json({ message: 'Error fetching events' });
//     });
// });

// app.post('/events', (req, res) => {
//   const { price, name, date, time, duration, reservedSeats, totalSeats, category } = req.body;

//   if (price === undefined || price < 0) {
//     return res.status(400).json({ message: 'Price must be a non-negative number' });
//   }

//   const newEvent = new Event({ price, name, date, time, duration, reservedSeats, totalSeats, category });

//   newEvent.save()
//     .then(event => {
//       res.status(201).json(event);  // Return full event data
//     })
//     .catch(error => {
//       console.error('Error saving event:', error);
//       res.status(500).json({ message: 'Error saving event' });
//     });
// });

// app.put('/events/:id', (req, res) => {
//   const { id } = req.params;
//   const updatedEvent = req.body;

//   Event.findByIdAndUpdate(id, updatedEvent, { new: true })
//     .then(event => {
//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }
//       res.status(200).json(event);  // Return updated event data
//     })
//     .catch(error => {
//       console.error('Error updating event:', error);
//       res.status(500).json({ message: 'Error updating event' });
//     });
// });

// app.delete('/events/:id', (req, res) => {
//   const { id } = req.params;

//   Event.findByIdAndDelete(id)
//     .then(event => {
//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }
//       res.status(200).json({ message: 'Event deleted successfully' });
//     })
//     .catch(error => {
//       console.error('Error deleting event:', error);
//       res.status(500).json({ message: 'Error deleting event' });
//     });
// });

// app.post('/events/book/:id', (req, res) => {
//   const { id } = req.params;
//   const { seatsToBook } = req.body;

//   if (seatsToBook <= 0) {
//     return res.status(400).json({ message: 'Invalid number of seats to book' });
//   }

//   Event.findById(id)
//     .then(event => {
//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }

//       if (event.totalSeats - event.reservedSeats < seatsToBook) {
//         return res.status(400).json({ message: 'Not enough seats available' });
//       }

//       event.reservedSeats += seatsToBook;

//       event.save()
//         .then(updatedEvent => {
//           res.status(200).json(updatedEvent);
//         })
//         .catch(error => {
//           console.error('Error saving booked seats:', error);
//           res.status(500).json({ message: 'Error booking seats' });
//         });
//     })
//     .catch(error => {
//       console.error('Error finding event:', error);
//       res.status(500).json({ message: 'Error finding event' });
//     });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
