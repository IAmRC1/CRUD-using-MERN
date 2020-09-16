const Animal = require('../models/animal.model');
const helper = require('../utils/helper');

exports.createOne = (req, res) => {
  const {
    name, description, image, category,
  } = req.body;
  const newAnimal = new Animal({
    name, description, image, category, submittedBy: req.user.user.id,
  });
  newAnimal.save()
    .then((animal) => res.status(201).json(helper.successResponse(201, false, 'Animal created successfully!', animal)))
    .catch((err) => res.status(400).json(helper.errorResponse(400, true, err, 'Animal could not be created.')));
};

exports.getAll = (req, res) => {
  Animal.find({})
    .sort({ createdAt: 1 })
    .populate('submittedBy')
    .exec((err, animals) => res.status(200).json(helper.successResponse(200, false, 'All animals fetched successfully!', animals)));
};

exports.getOne = (req, res) => {
  const { id } = req.params;
  Animal.findById(id)
    .then((animal) => res.status(200).json(helper.successResponse(200, false, 'Animal fetched successfully!', animal)))
    .catch((err) => res.status(400).json(helper.errorResponse(400, true, 'Some error happened', err)));
};

exports.updateOne = (req, res) => {
  const { id } = req.params;
  Animal.findByIdAndUpdate({ _id: id }, req.body, { new: true })
    .then((animal) => {
      animal.save()
        .then(() => res.status(201).json(helper.successResponse(201, false, 'Animal updated successfully!', animal)))
        .catch((err) => res.status(400).json(helper.errorResponse(400, true, 'Some error happened in updating', err)));
    })
    .catch((err) => res.status(400).json(helper.errorResponse(400, true, 'Some error happened in finding', err)));
};

exports.deleteOne = (req, res) => {
  const { id } = req.params;
  Animal.findByIdAndDelete(id)
    .then(() => res.status(200).json(helper.successResponse(200, false, 'Animal deleted successfully!', [])))
    .catch((err) => res.status(400).json(helper.errorResponse(400, true, 'Some error happened in deleting', err)));
};
