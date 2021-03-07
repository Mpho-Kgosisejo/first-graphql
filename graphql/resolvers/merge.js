const {
  UserModel,
  EventModel
} = require('../../models');

const getUser = (id) => {

  return UserModel.findById(id)
    .then(user => ({
      ...user._doc,
      createdEvents: getEvents.bind(this, user.createdEvents)
    }))
    .catch(e => {
      throw e;
    });
};

const getEvents = (ids) => {

  return EventModel.find({ _id: { $in: ids } })
    .then(events => events.map(event => ({
      ...event._doc,
      date: dateToString(event.date),
      creator: getUser.bind(this, event.creator)
    })))
    .catch(e => {
      throw e;
    });
};

const getEvent = async id => {

  try {

    const event = await EventModel.findById(id);

    return {
      ...event._doc,
      creator: getUser.bind(this, event.creator)
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUser,
  getEvent,
  getEvents
}