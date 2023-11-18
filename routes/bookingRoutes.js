const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.bookRoom);
router.get('/customers', bookingController.getAllCustomersWithBookedData);
router.get('/customers/:customerName', bookingController.getCustomerBookingDetails);

module.exports = router;
