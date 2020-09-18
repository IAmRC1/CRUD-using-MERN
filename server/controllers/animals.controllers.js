const Animal = require('../models/animal.model');
const helper = require('../utils/helper');

exports.createOne = (req, res) => {
  const {
    name, description, category,
  } = req.body;
  const { path } = req.file;
  const user = req.user.id;
  const newAnimal = new Animal({
    name, description, category, submittedBy: user, image: path,
  });
  newAnimal.save()
    .then((animal) => res.status(201).json(helper.successResponse(201, false, 'Animal created successfully!', animal)))
    .catch((err) => res.status(400).json(helper.errorResponse(400, true, err, 'Animal could not be created.')));
};

exports.getAll = (req, res) => {
  if (!Object.keys(req.query).length) {
    return res.status(400).json(helper.errorResponse(400, true, 'Need a query object.', 'Query Absent'));
  }
  return Animal.find({
    name: {
      $regex: req.query.search,
      $options: 'i',
    },
  })
    .where('name')
    .sort({ createdAt: -1 })
    .select('-__v')
    .populate({
      path: 'submittedBy',
      select: 'name email',
    })
    .exec((err, animals) => res.status(200).json(helper.successResponse(200, false, 'All animals fetched successfully!', animals)));
};

exports.getOne = (req, res) => {
  const { id } = req.params;
  Animal.findById(id)
    .select('-__v')
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
