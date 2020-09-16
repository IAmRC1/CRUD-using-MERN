const mongoose = require('mongoose');

const { Schema } = mongoose;

const animalSchema = new Schema({
  name: String,
  description: String,
  image: String,
  category: String,
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
