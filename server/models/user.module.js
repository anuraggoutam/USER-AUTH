const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const USER = mongoose.model('USER', userSchema);

module.exports = USER;
