const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Un fil de discussion doit avoir un titre'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
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
    required: [true, 'Un fil de discussion doit avoir un créateur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Assurer qu'un thread est lié soit à un groupe, soit à un événement
threadSchema.pre('save', function(next) {
  if (!this.group && !this.event) {
    return next(new Error('Un fil de discussion doit être lié à un groupe ou à un événement.'));
  }
  if (this.group && this.event) {
    return next(new Error('Un fil de discussion ne peut pas être lié à la fois à un groupe et à un événement.'));
  }
  next();
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;
