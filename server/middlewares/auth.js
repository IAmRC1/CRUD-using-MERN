const jwt = require('jsonwebtoken');
const config = require('config');
const helper = require('../utils/helper');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.header('token');
  if (!token) res.status(404).json(helper.errorResponse(404, true, 'Token is required!', 'No Token Error'));
  jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
    if (err) res.status(400).json(helper.errorResponse(400, true, 'Token is expired!', 'Token Expiry Error'));
    req.user = decoded.user;
    next();
  });
};

module.exports = auth;
