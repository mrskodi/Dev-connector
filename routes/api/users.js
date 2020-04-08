const express = require('express');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const key = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

router.get('/register', (req, res) => res.send('In the register page!')); // response received on browser

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  // Validation here...
  const {errors, isValid} = validateRegisterInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({email: req.body.email})
      .then(user => {
        //console.log(`User: ${user}`);
        if(user){
          return res.status(400).json({email: 'Email already exists!'})
        }else{
          
          // Create an avatar schema with proper specifications
          const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          });
          //console.log(`Success at Creating a new avatar: ${avatar}`);
          
          // Create a User using the schema
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Plain text password, for security reasons should be     hashed.
            avatar: avatar,
          });
          //console.log(`Success at creating a new User: ${newUser}`);
          
          // Hashing of password
          bcrypt.genSalt(10, (err, salt) => {
            //console.log(`generated Salt: ${salt}`); // Successful till here
            
            if(err) throw err;
            
            bcrypt.hash(newUser.password, salt, (err, hash) => {
            
               if(err) {
                //console.log('Error in the hash function'); 
                throw err};
              //console.log(`salt: ${salt}`);
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

// @route   POST /api/users/login
// @desc    Login user page
// @access  Public
router.post('/login', (req,res) => {
  // Validate email and password
  const {errors, isValid} = validateLoginInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({email: req.body.email})
      .then(user => {
        if(!user){
          res.status(400).json({email: 'Email not found.'});
        }else{
          bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
              // create payload
              const payload = {
                name: user.name,
                id: user.id,
                avatar: user.avatar
              };
              // sign the token
              jwt.sign(payload, key.secret, {expiresIn: 7200}, (err, token) => {
                if(err) throw err;
                if(token){
                  res.status(200).json({
                    msg: 'Success generating token',
                    token: 'Bearer ' + token
                  })
                }
              })
            }else{
              // Passwords did not match
              res.status(400).json({password: 'Incorrect Password'});
            }
          })
        }
      })
      .catch(err => `User.findOne error ${err}`);
})

// @route   /api/users/current
// @desc    Return the current user information
// @ access Private - this means there is an added layer in between the route and call back function
router.get('/current',
            passport.authenticate('jwt', ({session: false})),
            (req, res) => {
              //console.log('control passed to callback function in current route');
              res.json({
                id: req.user.id,
                email: req.user.email,
                name: req.user.name
              });
            })

// @route   /api/users/delete
// @access  Private
// @desc    Delete a user
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log('in the user delete route');
  console.log(`UserId: ${req.user.id}`);
  User.findOneAndRemove({_id: req.user.id})
      .then(() => res.json({success: true}))
      .catch(err => console.log(err));
})
// Export the route
module.exports = router;