const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

connectDB();

app.use('/', (req, res) => res.json({ message: 'Please add /api/v1/ at the end' }));
app.use('/api/v1', require('./routes/index'));

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
