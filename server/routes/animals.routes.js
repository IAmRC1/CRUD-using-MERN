const router = require('express').Router();
const controller = require('../controllers/animals.controllers');
const helper = require('../utils/helper');

router.get('/', helper.ensureAuthenticated, controller.getAll);

router.post('/', helper.ensureAuthenticated, controller.createOne);

router.get('/:id', helper.ensureAuthenticated, controller.getOne);

router.put('/:id', helper.ensureAuthenticated, controller.updateOne);

router.delete('/:id', helper.ensureAuthenticated, controller.deleteOne);

module.exports = router;
