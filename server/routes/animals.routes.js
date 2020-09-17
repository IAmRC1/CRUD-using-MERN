const router = require('express').Router();
const controller = require('../controllers/animals.controllers');
const helper = require('../utils/helper');
const auth = require('../middlewares/auth');
const { validationType, validate } = require('../middlewares/validations');
const imageParser = require('../utils/multer-config');

router.get('/', auth, controller.getAll);

router.post('/', auth, imageParser, validationType('add-animal'), validate, controller.createOne);

router.get('/:id', auth, helper.ensureAuthenticated, controller.getOne);

router.put('/:id', auth, helper.ensureAuthenticated, controller.updateOne);

router.delete('/:id', auth, helper.ensureAuthenticated, controller.deleteOne);

module.exports = router;
