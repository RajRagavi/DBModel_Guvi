const Room = require('../models/Room');
const Booking = require('../models/Booking');

async function getAllRoomsWithBookedData(req, res) {
    try {
        const rooms = await Room.find();
        const roomsWithBookings = await Promise.all(rooms.map(async (room) => {
            const bookings = await Booking.find({ room: room._id });
            return {
                roomName: room.roomName,
                bookedStatus: bookings.length > 0 ? 'Booked' : 'Available',
                bookings: bookings.map(booking => ({
                    customerName: booking.customerName,
                    date: booking.date,
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                })),
            };
        }));
        res.json(roomsWithBookings);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllRoomsWithBookedData,
};
