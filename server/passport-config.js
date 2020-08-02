const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
const User = require('./models/user.model');

const initialize = passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  User.findOne({ email: username }, (err, user) => {
    bcrypt.compare(password, user.password, (error, results) => {
      if (err) done(err);
      if (!user) done(null, false, { message: 'Email not found' });
      if (!password) done(null, false);
      if (results) {
        return done(null, user);
      }
      return done(null, false);
    });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log('id', id);
  User.findById({ _id: id }, (err, user) => {
    console.log('user', user);
    done(null, user);
  });
});

module.exports = initialize;
