const config = require('config');
const nodemailer = require('nodemailer');

exports.successResponse = (status = 200, error = false, message, data) => ({
  status, error, message, data,
});

exports.errorResponse = (status = 400, error = true, message, data) => ({
  status, error, message, data,
});

// exports.ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     // console.log('Successfully authenticated');
//     next();
//   } else {
//     // console.log('Could not authenticate');
//     res.redirect('/api/v1/login');
//   }
// };

exports.transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false,
  auth: {
    user: config.get('sendingBlueEmail'),
    pass: config.get('sendingBluePassword'),
  },
});
