const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Un sondage doit avoir une question'],
    trim: true
  },
  options: [
    {
      text: String,
      votes: {
        type: Number,
        default: 0
      }
    }
  ],
  voters: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group'
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event'
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Un sondage doit avoir un créateur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
