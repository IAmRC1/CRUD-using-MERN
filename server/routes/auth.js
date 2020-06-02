const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth.middleware')

let User = require('../models/user.model');


router.post('/', (req,res) => {
  
  if(!req.body.email || !req.body.password){
    return res.status(422).json({ message: "Please enter all fields" })
  }

  User.findOne({email: req.body.email})
  .then(user => {
    if(!user) return res.status(409).json({ message: "User doesn't exist" })
    
    //Validating Passowrd
    bcrypt.compare(req.body.password, user.password)
    .then(isMatch => {
      if(!isMatch) return res.status(422).json({ message: "Invalid Credentials" })

      jwt.sign({
        id: user.id
      },
        '123test456',
      { expiresIn: 60*60 },
      (err, token) => {
        if(err) throw err;
        res.json({
          token: token,
          user: {
            id: user.id,
            email: user.email
          }
        })
      })
    })


  })
  .catch(err => res.status(400).json('Error: ',err))

})

router.get('/user', auth, (req,res) => {
  User.findById(req.user.id)
  .select('-password')
  .then(user => res.json(user))
  .catch(err => console.log('err', err))
})




module.exports = router