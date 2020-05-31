const router = require('express').Router();
let Animal = require('../models/animal.model');

router.route('/').get((req,res) => {
  Animal.find()
  .then(animals => res.json(animals))
  .catch(err => res.status(400).json('Error: ',err))
})

router.route('/add').post((req,res) => {
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;
  const type = req.body.type;

  const newAnimal = new Animal({ name, description, image, type });

  newAnimal.save()
  .then(() => res.json('Animal Saved'))
  .catch(err => res.status(400).json('Error: ',err))
})

router.route('/:id').get((req,res) => {
  Animal.findById(req.params.id)
  .then(animal => res.json(animal))
  .catch(err => res.status(400).json('Error: ',err))
})

router.route('/update/:id').post((req,res) => {
  Animal.findById(req.params.id)
  .then(animal => {
    animal.name = req.body.name;
    animal.description = req.body.description;
    animal.image = req.body.image;
    animal.type = req.body.type;

    animal.save()
    .then(() => res.json('Animal Updated'))
    .catch(err => res.status(400).json('Error: ',err))
  })

  .catch(err => res.status(400).json('Error: ',err))
})

router.route('/:id').delete((req,res) => {
  Animal.findByIdAndDelete(req.params.id)
  .then(animals => res.json('Animal Deleted'))
  .catch(err => res.status(400).json('Error: ',err))
})


module.exports = router