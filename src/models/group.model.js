const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Un groupe doit avoir un nom'],
    unique: true,
    trim: true,
    minlength: [3, 'Le nom doit avoir au moins 3 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La description ne peut pas dépasser 200 caractères']
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Un groupe doit avoir un créateur']
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
