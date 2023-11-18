const Booking = require('../models/Booking');
const Room = require('../models/Room');

async function bookRoom(req, res) {
    try {
        const { customerName, date, startTime, endTime, roomId } = req.body;
        
        // Check if the room is already booked for the given date and time
        const existingBooking = await Booking.findOne({
            room: roomId,
            date,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
            ],
        });

        if (existingBooking) {
            return res.status(400).json({ error: 'Room already booked for the given date and time' });
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(400).json({ error: 'Room not found' });
        }

        const booking = new Booking({ customerName, date, startTime, endTime, room: room._id });
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllCustomersWithBookedData(req, res) {
    try {
        const bookings = await Booking.find();

        const customersWithBookings = await Promise.all(bookings.map(async (booking) => {
            const room = await Room.findById(booking.room);
            const isRoomAlreadyBooked = await Booking.findOne({
                room: booking.room,
                date: booking.date,
                $or: [
                    { startTime: { $lt: booking.endTime, $gte: booking.startTime } },
                    { endTime: { $gt: booking.startTime, $lte: booking.endTime } },
                ],
                _id: { $ne: booking._id } // Exclude the current booking from the check
            });

            // If the room is already booked, mark it as such
            const bookedStatus = isRoomAlreadyBooked ? 'Booked' : 'Available';

            return {
                customerName: booking.customerName,
                roomName: room.roomName,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                bookedStatus,
            };
        }));

        res.json(customersWithBookings);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getCustomerBookingDetails(req, res) {
    try {
        const customerName = req.params.customerName;
        const customerBookings = await Booking.find({ customerName });
        res.json(customerBookings);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    bookRoom,
    getAllCustomersWithBookedData,
    getCustomerBookingDetails,
};
