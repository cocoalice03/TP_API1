const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Une photo doit avoir une URL']
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [200, 'La légende ne peut pas dépasser 200 caractères']
  },
  album: {
    type: mongoose.Schema.ObjectId,
    ref: 'Album',
    required: [true, 'Une photo doit appartenir à un album']
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Une photo doit avoir un créateur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
