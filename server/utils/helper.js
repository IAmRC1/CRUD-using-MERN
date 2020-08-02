exports.successResponse = (status = 200, error = false, message, data) => ({
  status, error, message, data,
});

exports.errorResponse = (status = 400, error = true, message, data) => ({
  status, error, message, data,
});

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('isauth');
    next();
  } else {
    console.log('not auth');
    res.redirect('/api/v1/login');
  }
};
