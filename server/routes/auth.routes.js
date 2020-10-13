const router = require('express').Router();
const controller = require('../controllers/auth.controllers');
// const helper = require('../utils/helper');
const auth = require('../middlewares/auth');
const { validationType, validate } = require('../middlewares/validations');
const imageParser = require('../utils/multer-config');

router.post('/register', validationType('register'), validate, controller.register);

router.post('/login', validationType('login'), validate, controller.login);

router.post('/resetpassword', validationType('reset-password'), validate, controller.sendResetToken);

router.post('/resetpassword/:token',
  validationType('update-password'), validate,
  controller.verifyTokenAndResetPassword);

router.get('/:id', auth, controller.getUser);

router.patch('/:id', auth, imageParser, controller.updateUser);

module.exports = router;
