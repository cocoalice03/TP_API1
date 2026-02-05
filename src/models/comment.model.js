const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Un commentaire ne peut pas être vide'],
    trim: true,
    maxlength: [500, 'Un commentaire ne peut pas dépasser 500 caractères']
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo',
    required: [true, 'Un commentaire doit être lié à une photo']
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Un commentaire doit avoir un auteur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
