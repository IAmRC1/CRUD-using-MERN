const Animal = require('../models/animal.model');
const User = require('../models/auth.model');
const helper = require('../utils/helper');

exports.createOne = (req, res) => {
  const {
    name, description, category,
  } = req.body;
  const { path } = req.file;
  const userID = req.user.id;
  const newAnimal = new Animal({
    name, description, category, submittedBy: userID, image: path,
  });
  newAnimal.save()
    .then((animal) => {
      // eslint-disable-next-line no-underscore-dangle
      User.updateOne({ _id: animal.submittedBy }, { $push: { posts: animal._id } }, () => res.status(201).json(helper.successResponse(201, false, 'Animal created  successfully!', animal)));
    })
    .catch((err) => res.status(400).json(helper.errorResponse(400, true, err, 'Animal could not be created.')));
};

exports.getAll = async (req, res) => {
  const {
    currentPage = 1, perPage = 20, search = '',
  } = req.query;
  const skip = parseInt((currentPage - 1) * perPage, 10);
  const limit = parseInt(perPage, 10);
  if (!Object.keys(req.query).length) {
    return res.status(400).json(helper.errorResponse(400, true, 'Need a query object.', 'Query Absent'));
  }
  if (currentPage < 0 || currentPage == 0) {
    return res.status(400).json(helper.errorResponse(400, true, 'Page number should start with 1.', 'Invalid Page Number'));
  }
  const totalCount = await Animal.countDocuments();
  const lastPageDocuments = Math.ceil(totalCount / limit);
  return Animal.find({
    name: {
      $regex: search,
      $options: 'i',
    },
  })
    .where('name')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select('-__v')
    .populate({
      path: 'submittedBy',
      select: 'username email',
    })
    .exec((err, animals) => res.status(200)
      .json(
        {
          status: 200,
          error: false,
          message: 'All animals fetched successfully!',
          data: animals,
          pagination: {
            current_page: +currentPage,
            per_page: +limit,
            total: +totalCount,
            last_page: +lastPageDocuments,
          },
        },
      ));
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
