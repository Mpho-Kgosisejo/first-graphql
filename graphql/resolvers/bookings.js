const {
  EventModel,
  BookingModel
} = require('../../models');

const {
  getUser,
  getEvent
} = require('./merge');

const {
  dateToString
} = require('../../helpers/date');

module.exports = {
  bookings: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthorized poi!')
    }

    try {

      const bookings = await BookingModel.find();

      return bookings.map(booking => ({
        ...booking._doc,
        user: getUser.bind(this, booking.user),
        event: getEvent.bind(this, booking.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt)
      }));
    } catch (error) {

      throw error;
    }
  },
  bookEvent: async ({ eventId }, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthorized poi!')
    }

    const event = await EventModel.findById(eventId);

    const booking = new BookingModel({
      user: req.user.userId,
      event: event
    });

    const data = await booking.save();

    return {
      ...data._doc,
      user: getUser.bind(this, booking.user),
      event: getEvent.bind(this, booking.event),
      createdAt: dateToString(data.createdAt),
      updatedAt: dateToString(data.updatedAt)
    };
  },
  cancelBooking: async ({ bookingId }, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthorized poi!')
    }

    try {

      const booking = await BookingModel.findById(bookingId).populate('event');

      await BookingModel.deleteOne({ _id: bookingId });

      return {
        ...booking.event._doc,
        creator: getUser.bind(this, booking.event.creator)
      };
    } catch (error) {
      throw error;
    }
  }
};