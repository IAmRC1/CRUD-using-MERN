const { check, validationResult, checkSchema } = require('express-validator');

const validationType = (type) => {
  switch (type) {
  case 'register':
    return [
      check('username').trim().not().isEmpty()
        .withMessage('Username is required')
        .bail()
        .isLength({ min: 4, max: 16 })
        .withMessage('Name must be between 4 to 16 chars long'),
      check('email').trim().not().isEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please include a valid email'),
      check('password').trim().not().isEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Password must be 6 chars long'),
    ];
  case 'login':
    return [
      check('email').trim().not().isEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please include a valid email'),
      check('password').trim().not().isEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Password must be 6 chars long'),
    ];
  case 'add-animal':
    return [
      check('name').trim().not().isEmpty()
        .withMessage('Name is required')
        .bail()
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be 3-20 chars long'),
      check('description').trim().not().isEmpty()
        .withMessage('Description is required')
        .bail()
        .isLength({ min: 30, max: 250 })
        .withMessage('Description must be 30-250 chars long')
        .bail(),
      check('category').trim().not().isEmpty()
        .withMessage('Category is required')
        .bail()
        .isLength({ min: 3, max: 20 })
        .withMessage('Category must be 3-20 chars long'),
      // checkSchema({
      //   image: {
      //     // Custom validators
      //     custom: {
      //       options: (value, { req, location, path }) => {
      //         console.log('value', value);
      //         return value + req.body.foo + location + path;
      //       },
      //     },
      //   },
      // }),
    ];
  case 'update-user':
    return [
      check('bio').trim().not().isEmpty()
        .withMessage('Bio is required')
        .bail()
        .isLength({ min: 50, max: 100 })
        .withMessage('Bio must be 50-100 chars long'),
    ];
  case 'reset-password':
    return [
      check('email').trim().not().isEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please include a valid email'),
    ];
  case 'update-password':
    return [
      check('password').trim().not().isEmpty()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 6 })
        .withMessage('Password must be 6 chars long'),
    ];
  default:
    return [];
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({ errors: extractedErrors });
};

module.exports = {
  validationType,
  validate,
};
