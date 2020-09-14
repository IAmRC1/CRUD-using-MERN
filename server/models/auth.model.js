const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: String,
}, { timestamps: true });

// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) next(error);
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
