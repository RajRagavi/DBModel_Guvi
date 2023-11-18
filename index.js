const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const PORT = 3000;

const app = express();


mongoose.connect('mongodb://localhost:27017/hallBookingApp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.use(bodyParser.json());


app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
