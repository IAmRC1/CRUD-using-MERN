const mongoose = require('mongoose');

const { Schema } = mongoose;

const animalSchema = new Schema({
  category: String,
  description: {
    type: String,
    default: '',
  },
  image: String,
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likesCount: {
    type: Number,
    default: 0,
  },
  name: {
    type: String,
    default: '',
  },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
