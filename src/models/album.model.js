const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Un album doit avoir un nom'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
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
    required: [true, 'Un album doit avoir un créateur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Assurer qu'un album est lié soit à un groupe, soit à un événement
albumSchema.pre('save', function(next) {
  if (!this.group && !this.event) {
    return next(new Error('Un album doit être lié à un groupe ou à un événement.'));
  }
  next();
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
