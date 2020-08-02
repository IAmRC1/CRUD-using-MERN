const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/users.controllers');
const helper = require('../utils/helper');

router.post('/register', controller.register);

router.post('/login', passport.authenticate('local', { successRedirect: '/api/v1/animals', failureRedirect: '/api/v1/users/login' }), controller.login);

// router.post('/:id', controller.forgotPassword);

// router.put('/:id', controller.changePassword);

// router.delete('/:id', controller.deleteAccount);

router.get('/logout', controller.logout);

router.get('/:id', helper.ensureAuthenticated, controller.getUser);

router.get('/', helper.ensureAuthenticated, controller.getAllUser);

module.exports = router;
