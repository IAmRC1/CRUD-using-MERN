const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/auth.model');
const helper = require('../utils/helper');

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }, (error, user) => {
    if (user) res.status(400).json(helper.errorResponse(400, true, 'Existing Error', 'User already exists!'));
  });
  const newUser = new User({ name, email, password });
  newUser.save()
    .then((doc) => res.status(201).json(helper.successResponse(201, false, 'User registered successfully!', doc)))
    .catch((error) => res.status(400).json(helper.errorResponse(400, true, error, 'User could not be created!')));
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (error, user) => {
    if (!user) res.status(400).json(helper.errorResponse(400, true, 'Non-Existing Error', 'User doesn\'t exists!'));
    bcrypt.compare(password, user.password)
      .then((result) => {
        if (!result) res.status(400).json(helper.errorResponse(400, true, 'Invalid Password', 'Incorrect password entered!'));
        const payload = {
          user: {
            // eslint-disable-next-line no-underscore-dangle
            id: user._id,
          },
        };
        jwt.sign(
          payload,
          'qweasdqwe',
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json(helper.successResponse(200, true, 'Successfully logged in!', token));
          },
        );
      });
  });
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById({ _id: id })
    .select('name email')
    .then((user) => res.status(200).json(helper.successResponse(200, undefined, 'User fetched successfully!', user)))
    .catch((error) => res.status(400).json(helper.errorResponse(400, true, error, 'Some error happened')));
};
