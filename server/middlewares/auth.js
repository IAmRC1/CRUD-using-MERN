const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'no token found' });
  try {
    const decoded = jwt.verify(token, 'qweasdqwe');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'no token found' });
  }
};

module.exports = auth;
