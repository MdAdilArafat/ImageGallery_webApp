const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  },
  User:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',

  }, 
  image:{
    type: String

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Post', postSchema);

 