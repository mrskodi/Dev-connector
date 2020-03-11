const express = require('express');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/register', (req, res) => res.send('In the register page!')); // response received on browser

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  console.log('at the beginning of the post route');
  console.log(req.body.email);
  User.findOne({email: req.body.email})
      .then(user => {
        console.log(`User: ${user}`);
        if(user){
          return res.status(400).json({email: 'Email already exists!'})
        }else{
          
          // Create an avatar schema with proper specifications
          const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          });
          console.log(`Success at Creating a new avatar: ${avatar}`);
          
          // Create a User using the schema
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Plain text password, for security reasons should be     hashed.
            avatar: avatar,
          });
          console.log(`Success at creating a new User: ${newUser}`);
          
          // Hashing of password
          bcrypt.genSalt(100, (err, salt) => {
            console.log(`generated Salt: ${salt}`); // Successful till here
            
            if(err) throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
            console.log(`salt: ${salt}`);
            //  if(err) throw err;
            
              newUser.password = hash;
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err))
            })
          });
        }
      })
      .catch(err => console.log(`Uber error: ${err}`))   
});

// Export the route
module.exports = router;