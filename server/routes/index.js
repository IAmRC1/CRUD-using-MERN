const express = require('express');

const router = express.Router();

router.use('/animals', require('./animals'));
router.use('/users', require('./users'));

module.exports = router;
