const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');

const { Schema } = mongoose;

const userSchema = new Schema({
  bio: String,
  email: {
    type: String,
    lowercase: true,
  },
  firstname: {
    type: String,
    lowercase: true,
  },
  image: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastname: {
    type: String,
    lowercase: true,
  },
  password: String,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  posts: [{ type: Schema.Types.ObjectId, ref: 'Animal' }],
  username: {
    type: String,
    lowercase: true,
  },
}, { timestamps: true });

// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) next();
  bcrypt.genSalt(config.get('saltRounds'), (err, salt) => {
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
