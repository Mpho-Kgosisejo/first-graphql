
const authResolvers = require('./auth');
const eventsResolvers = require('./events');
const bookingResolvers = require('./bookings');

module.exports = {
  ...authResolvers,
  ...eventsResolvers,
  ...bookingResolvers
};