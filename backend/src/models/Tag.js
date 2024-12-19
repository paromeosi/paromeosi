const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  count: {
    type: Number,
    default: 1
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tag', tagSchema);