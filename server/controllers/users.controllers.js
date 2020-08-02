const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const helper = require('../utils/helper');
const passportInitialize = require('../passport-config');

exports.register = (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const newUser = new User({ email: req.body.email, password: hash });
    newUser.save()
      .then((user) => res.json(helper.successResponse(undefined, undefined, 'User registered successfully!', user)))
      .catch((error) => res.status(400).json(helper.errorResponse(400, true, error, 'Some error happened')));
  });
};

exports.login = () => {
  passportInitialize();
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById({ _id: id })
    .then((user) => res.json(helper.successResponse(undefined, undefined, 'User fetched successfully!', user)))
    .catch((err) => res.status(400).json(helper.errorResponse(400, true, err, 'Some error happened')));
};

exports.getAllUser = (req, res) => {
  res.redirect('/');
};
