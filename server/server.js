require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'passport-tutorial',
  cookie: { maxAge: 60000, secure: true },
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
});

// mongoose.set('debug', true);
mongoose.connection.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('MongoDB connection established');
});

app.use('/api/v1', require('./routes/index'));

const port = 5000;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server running on port ${port}`));
