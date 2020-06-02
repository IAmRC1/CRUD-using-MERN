const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let User = require('../models/user.model');


router.route('/').post((req,res) => {
  
  if(!req.body.email || !req.body.password){
    return res.status(422).json({ message: "Please enter all fields" })
  }

  User.findOne({email: req.body.email})
  .then(user => {
    if(user) return res.status(409).json({ message: "User already exists" })

    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    })

    //Create Salt & Hash
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
          // Store hash in your password DB.
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => {
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
            }
          )    
        })
      });
    })
  })
  .catch(err => res.status(400).json({ message: "Bad request" }))
})


module.exports = router