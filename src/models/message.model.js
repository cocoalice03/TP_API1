const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Un message ne peut pas être vide'],
    trim: true,
    maxlength: [1000, 'Un message ne peut pas dépasser 1000 caractères']
  },
  thread: {
    type: mongoose.Schema.ObjectId,
    ref: 'Thread',
    required: [true, 'Un message doit appartenir à un fil de discussion']
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Un message doit avoir un auteur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
