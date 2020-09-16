const jwt = require('jsonwebtoken');
const config = require('config');

// eslint-disable-next-line consistent-return
const auth = async (req, res, next) => {
  const token = req.header('token');
  if (!token) return res.status(401).json({ error: true, message: 'No token found.' });
  try {
    const decoded = await jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ error: true, message: 'Error in verifying token!' });
  }
};

module.exports = auth;
