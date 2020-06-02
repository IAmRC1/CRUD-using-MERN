const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
  },
  register_date: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User;