const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const animalSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
},{ timestamps: true })

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;