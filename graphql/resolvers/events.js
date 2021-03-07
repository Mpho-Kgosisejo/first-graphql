const {
  UserModel,
  EventModel
} = require('../../models');

const {
  getUser
} = require('./merge');

const {
  dateToString
} = require('../../helpers/date');

module.exports = {
  events: () => {

    return EventModel.find()
      .then(events => events.map(event => ({
          ...event._doc,
          date: dateToString(event.date),
          creator: getUser.bind(this, event.creator)
        }))
      )
      .catch(e => {
        throw e;
      });
  },
  createEvent: ({ eventInput }, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthorized poi!')
    }

    const event = new EventModel({
      title: eventInput.title,
      price: eventInput.price,
      description: eventInput.description,
      date: new Date(eventInput.date),
      creator: req.user.userId
    });

    let createdEvent = null;

    return event.save()
      .then((event) => {

        createdEvent = event;

        return UserModel.findById(req.user.userId);
      })
      .then(user => {

        if (!user) {
          throw new Error('User not found');
        }

        user.createdEvents.push(event);

        return user.save();
      })
      .then(() => ({
        ...createdEvent._doc,
        date: dateToString(createdEvent.date),
        creator: getUser.bind(this, createdEvent.creator)
      }))
      .catch(e => {
        throw e;
      });
  }
};