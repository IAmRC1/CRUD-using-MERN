const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 600, // 10 minutes = 600
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
