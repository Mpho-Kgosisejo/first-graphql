const DataLoader = require('dataloader');

const {
  UserModel,
  EventModel
} = require('../../models');

const {
  dateToString
} = require('../../helpers/date');

const eventLoader = new DataLoader(eventIds => getEvents(eventIds));

const userLoader = new DataLoader(userIds => UserModel.find({ _id: { $in: userIds } }));

const getUser = (id) => {

  // return UserModel.findById(id)
  return userLoader.load(id.toString())
    .then(user => ({
      ...user._doc,
      // createdEvents: getEvents.bind(this, user.createdEvents)
      createdEvents: () => eventLoader.loadMany(user.createdEvents)
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
    .then(data => data.sort((a, b) => (ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString()))))
    .catch(e => {
      throw e;
    });
};

const getEvent = async id => {

  try {

    // const event = await EventModel.findById(id);
    const event = await eventLoader.load(id.toString());

    return event;
    return {
      ...event._doc,
      date: dateToString(event.date),
      creator: getUser.bind(this, event.creator)
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUser,
  getEvent,
  getEvents,
  userLoader
}