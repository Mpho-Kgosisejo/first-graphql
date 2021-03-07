const {
  model,
  Schema
} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
}, {
  timestamps: true
});

module.exports = model('User', userSchema);