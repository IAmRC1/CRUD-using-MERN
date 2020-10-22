const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');
const moment = require('moment');
const User = require('../models/auth.model');
const Token = require('../models/token.model');
const helper = require('../utils/helper');
const passwordReset = require('../views/pwdResetTemplate');
const passwordChanged = require('../views/pwdChangedTemplate');

moment().format();

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ username }, (error, user) => {
    if (user) res.status(400).json(helper.errorResponse(400, true, 'Username is taken!', 'Existing Error'));
  });
  User.findOne({ email }, (error, user) => {
    if (user) res.status(400).json(helper.errorResponse(400, true, 'Email already exists!', 'Existing Error'));
    const newUser = new User({ username, email, password });
    newUser.save()
      .then((doc) => {
        // Create a verification token
        const token = new Token({
          // eslint-disable-next-line no-underscore-dangle
          user_id: doc._id,
          token: crypto.randomBytes(3).toString('hex').toUpperCase(),
        });
        token.save()
          .then(() => {
            const mailOptions = {
              from: 'Animabry Support <no-reply@animabry.com>',
              to: email,
              subject: `${token.token} is Animabry email verification passcode`,
              html: `<p>Please enter this 6 digit code - ${token.token} to verify your email address! The token will expire after 10 minutes, hurry up!</p>`,
            };
            return helper.transporter.sendMail(mailOptions, (errorr) => {
              if (errorr) res.status(400).json(helper.errorResponse(400, true, 'Sorry, mail wasn\'t sent!', errorr));
              return res.status(201).json(helper.successResponse(201, false, 'User registered successfully, Please verify email', 'Email Verification Pending'));
            });
          });
      })
      .catch((err) => res.status(400).json(helper.errorResponse(400, true, 'User could not be saved!', err)));
  });
};

exports.verifyEmail = (req, res) => {
  const { otp } = req.body;
  Token.findOne({ token: otp }, (err, token) => {
    if (!token) return res.status(400).json(helper.errorResponse(400, true, 'Incorrect Token', 'Non-Existing Error'));

    // If we found a token, find a matching user
    return User.findOne({ _id: token.user_id }, (erro, user) => {
      const doc = user;
      if (!doc) res.status(400).json(helper.errorResponse(400, true, 'User doesn\'t exist!', 'Non-Existing Error'));
      if (doc.isVerified) res.status(400).json(helper.errorResponse(400, true, 'User is already verified', 'Already Verified Error'));

      // Verify and save the user
      doc.isVerified = true;
      Token.findOneAndDelete({ token: otp }, () => {
        console.log('Token Deleted');
      });
      return user.save((error) => {
        if (error) res.status(400).json(helper.errorResponse(400, true, 'Some error in saving user', 'Updating user error'));
        return res.status(200).json(helper.successResponse(200, false, 'Account verified successfully', 'Successful Verification'));
      });
    });
  });
};

exports.resendToken = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    // eslint-disable-next-line no-underscore-dangle
    Token.findOneAndUpdate({ user_id: user._id }, { token: crypto.randomBytes(3).toString('hex').toUpperCase() }, { new: true }, (erro, token) => {
      const mailOptions = {
        from: 'Animabry Support <no-reply@animabry.com>',
        to: email,
        subject: `${token.token} is Animabry email verification passcode`,
        html: `<p>Please enter this 6 digit code - ${token.token} to verify your email address! The token will expire after 10 minutes, hurry up & try not to resend tokens </p>`,
      };
      return helper.transporter.sendMail(mailOptions, (error) => {
        if (error) res.status(400).json(helper.errorResponse(400, true, 'Sorry, mail wasn\'t sent!', error));
        return res.status(200).json(helper.successResponse(200, false, 'Token resent', 'Email Verification Pending'));
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res.status(400).json(helper.errorResponse(400, true, 'User doesn\'t exist!', 'Non-Existing Error'));
    }
    if (!user.isVerified) {
      const token = new Token({
        // eslint-disable-next-line no-underscore-dangle
        user_id: user._id,
        token: crypto.randomBytes(3).toString('hex').toUpperCase(),
      });
      return token.save()
        .then(() => {
          const mailOptions = {
            from: 'Animabry Support <no-reply@animabry.com>',
            to: email,
            subject: `${token.token} is Animabry email verification passcode`,
            html: `<p>Please enter this 6 digit code - ${token.token} to verify your email address! The token will expire after 10 minutes, hurry up!</p>`,
          };
          return helper.transporter.sendMail(mailOptions, (error) => {
            if (error) res.status(400).json(helper.errorResponse(400, true, 'Sorry, mail wasn\'t sent!', error));
            return res.status(401).json(helper.successResponse(401, false, 'User not verified', 'Email Verification Pending'));
          });
        });
    }
    return bcrypt.compare(password, user.password)
      .then((result) => {
        if (!result) res.status(400).json(helper.errorResponse(400, true, 'Incorrect password entered!', 'Invalid Password'));
        const payload = {
          user: {
            // eslint-disable-next-line no-underscore-dangle
            id: user._id,
            username: user.username,
            email: user.email,
          },
        };
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: config.get('jwtExpiry') }, (erro, token) => {
          if (erro) res.status(400).json(helper.errorResponse(400, true, 'Error in token', 'Token Error'));
          res.status(200).json(helper.successResponse(200, false, 'Successfully logged in!',
            {
              token,
              user: {
                // eslint-disable-next-line no-underscore-dangle
                id: user._id,
                username: user.username,
                email: user.email,
                created_At: user.createdAt,
              },
            }));
        });
      });
  });
};

exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .select('username email firstname lastname bio image createdAt')
    .populate({
      path: 'posts',
      select: '-__v',
      options: { sort: { createdAt: -1 } },
    })
    .sort({ createdAt: -1 })
    .exec((err, user) => res.status(200).json(
      {
        status: 200,
        error: false,
        message: 'User fetched successfully with posts!',
        data: user,
      },
    ));
};

exports.updateUser = (req, res) => {
  const userID = req.user.id;
  let updatedUser = req.body;
  if (req.file) {
    const { path } = req.file;
    updatedUser = { ...updatedUser, image: path };
  }
  User.findByIdAndUpdate(
    { _id: userID },
    updatedUser,
    { new: true },
    (err, user) => {
      if (!user) res.status(400).json(helper.errorResponse(400, true, 'User doesn\'t exists!', 'Non-Existing Error'));
      return res.status(201).json(helper.successResponse(201, false, 'Successfully updated user', {
        username: user.username,
        email: user.email,
      }));
    },
  );
};

exports.sendResetToken = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) res.status(400).json(helper.errorResponse(400, true, 'Error in finding user!', 'Unexpected Error'));
    if (!user) res.status(400).json(helper.errorResponse(400, true, 'User doesn\'t exists!', 'Non-Existing Error'));
    const doc = user;
    // Create a verification token
    const token = new Token({
      // eslint-disable-next-line no-underscore-dangle
      user_id: doc._id,
      token: crypto.randomBytes(24).toString('hex'),
    });
    // Set token
    doc.passwordResetToken = token.token;
    doc.passwordResetTokenExpires = moment().add(10, 'minutes');
    return doc.save((erro) => {
      if (erro) res.status(400).json(helper.errorResponse(400, true, 'Error in saving user!', 'Unexpected Error'));
      // Save the token
      return token.save((error) => {
        if (error) res.status(400).json(helper.errorResponse(400, true, 'Error in saving token!', 'Unexpected Error'));
        // Send the mail
        const mailOptions = {
          from: 'Animabry Support <no-reply@animabry.com>',
          to: email,
          subject: 'Password Reset',
          html: passwordReset(token.token, doc),
        };
        return helper.transporter.sendMail(mailOptions, (errorr) => {
          if (errorr) res.status(400).json(helper.errorResponse(400, true, 'Sorry, mail wasn\'t sent!', errorr));
          return res.status(200).json(helper.successResponse(200, false, `Mail sent successfully to ${doc.email}`, 'Email Sent!'));
        });
      });
    });
  });
};

exports.verifyTokenAndResetPassword = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  Token.findOne({ token }, (err, foundToken) => {
    if (err) res.status(400).json(helper.errorResponse(400, true, 'Error in finding token!', 'Unexpected Error'));
    if (!foundToken) res.status(400).json(helper.errorResponse(400, true, 'Couldn\'t find token!', 'Unexpected Error'));
    // If we found a token, find a matching user
    return User.findById(foundToken.user_id, (erro, user) => {
      if (erro) res.status(400).json(helper.errorResponse(400, true, 'Error in finding user!', 'Unexpected Error'));
      if (!user) res.status(400).json(helper.errorResponse(400, true, 'Couldn\'t find user associated with this token!', 'Unexpected Error'));
      if (user.passwordResetToken !== foundToken.token) res.status(400).json(helper.errorResponse(400, true, 'Token didn\'t match, send a new one!', 'Unmatched Token Error'));

      // Verify that the user token expires date has not been passed
      if (moment().utcOffset(0) > user.passwordResetTokenExpires) res.status(400).json(helper.errorResponse(400, true, 'You cannot reset your password. The reset token has expired. Please go through the reset form again.', 'Token Expired Error'));

      // Delete token
      Token.findOneAndDelete({ token }, (error) => {
        if (error) res.status(400).json(helper.errorResponse(400, true, 'Couldn\'t delete token', 'Unexpected Token Error'));
      });
      // Update user
      const doc = user;
      doc.password = password;
      doc.passwordResetToken = undefined;
      doc.passwordResetTokenExpires = undefined;
      // Save updated user to the database
      return doc.save((errorr) => {
        if (errorr) res.status(400).json(helper.errorResponse(400, true, 'Error in saving user!', 'Unexpected Error'));
        const mailOptions = {
          from: 'Animabry Support <no-reply@animabry.com>',
          to: doc.email,
          subject: 'Password Changed',
          html: passwordChanged(user),
        };

        return helper.transporter.sendMail(mailOptions, (error) => {
          if (error) res.status(400).json(helper.errorResponse(400, true, 'Sorry, mail wasn\'t sent!', error));
          return res.status(200).json(helper.successResponse(200, false, 'Password has been successfully changed.', 'Password Changed.'));
        });
      });
    });
  });
};
