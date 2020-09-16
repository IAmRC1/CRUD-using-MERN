const { check, validationResult } = require('express-validator');

const validationType = (type) => {
  switch (type) {
  case 'register':
    return [
      check('name').trim().not().isEmpty()
        .withMessage('Name is required')
        .bail()
        .isLength({ min: 6, max: 18 })
        .withMessage('Name must be between 6 to 18 chars long'),
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
        .isLength({ min: 3, max: 12 })
        .withMessage('Name must be 3-12 chars long'),
      check('description').trim().not().isEmpty()
        .withMessage('Description is required')
        .bail()
        .isLength({ min: 30, max: 100 })
        .withMessage('Description must be 30-100 chars long')
        .bail(),
      check('image').trim().not().isEmpty()
        .withMessage('Image is required'),
      check('category').trim().not().isEmpty()
        .withMessage('Category is required')
        .bail()
        .isLength({ min: 3, max: 12 })
        .withMessage('Category must be 3-12 chars long'),
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
