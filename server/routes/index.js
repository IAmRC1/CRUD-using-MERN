const express = require('express');
const animalsRouter = require('./animals');
const usersRouter = require('./users');

const router = express.Router();

router.use('/animals', animalsRouter);
router.use('/users', usersRouter);

module.exports = router;
