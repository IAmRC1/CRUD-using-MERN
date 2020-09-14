const express = require('express');
const animalsRouter = require('./animals.routes');
const authRouter = require('./auth.routes');

const router = express.Router();

router.use('/animals', animalsRouter);
router.use('/auth', authRouter);

module.exports = router;
