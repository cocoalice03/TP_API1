const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Un événement doit avoir un titre'],
    trim: true,
    minlength: [5, 'Le titre doit avoir au moins 5 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  date: {
    type: Date,
    required: [true, 'Un événement doit avoir une date']
  },
  location: {
    type: String,
    required: [true, 'Un événement doit avoir un lieu']
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'Group',
    required: [true, 'Un événement doit appartenir à un groupe']
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Un événement doit avoir un créateur']
  },
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  hasTicketing: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    default: 0
  },
  bonusEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
