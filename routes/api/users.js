const express = require('express');
const router = express.Router();
// import gravatar to create avatar
const gravatar = require('gravatar');
// import bcryptjs to hash password
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          return res.status(400).json({email: 'Email already exists!'})
        }else{
          // Create an avatar schema with proper specifications
          const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          });
          
          // Create a User using the schema
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Plain text password, for security reasons should be     hashed.
            avatar: avatar,
          });
          // Hashing of password
          bcrypt.genSalt(100, (err, salt) => {
            if(err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash,
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            })
          });
        }
      })
      .catch(err => console.log(`Uber error: ${err}`))   
});

// Export the route
module.exports = router;