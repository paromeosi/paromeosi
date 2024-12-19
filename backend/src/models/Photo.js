const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Photo', photoSchema);