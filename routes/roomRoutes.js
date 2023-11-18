const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/bookings', roomController.getAllRoomsWithBookedData);

module.exports = router;
