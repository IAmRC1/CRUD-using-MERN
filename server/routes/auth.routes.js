const router = require('express').Router();
const controller = require('../controllers/auth.controllers');
const helper = require('../utils/helper');
const { validationType, validate } = require('../middlewares/validations');

router.post('/register', validationType('register'), validate, controller.register);

router.post('/login', validationType('login'), validate, controller.login);

// router.post('/forgot-password', controller.forgotPassword);

// router.put('/update-password', controller.changePassword);

// router.delete('/delete-account', controller.deleteAccount);

// router.get('/:id', helper.ensureAuthenticated, controller.getUser);

// router.get('/', helper.ensureAuthenticated, controller.getAllUser);

module.exports = router;
