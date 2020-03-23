const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
// Import validations
const validateProfileInput = require('../../validations/profile');

// Test the route
// @route   GET /api/profile/test
// desc     tests profile route
// access   Public access
router.get(('/test'), (req, res) => res.json({msg: 'Profile works!'}));

// @route   POST /api/profile/
// desc     Create or edit user profile
// access   Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => 
{
  // Validations here...
  const {errors, isValid} = validateProfileInput(req.body);
  if(!isValid){
    return res.status(400).json(errors);
  }

  const profileFields = {};

  profileFields.user = req.user.id;
  profileFields.handle = req.body.handle; 
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  profileFields.status = req.body.status;
  if(req.body.location) profileFields.location = req.body.location;
  // split skills into an array
  if(typeof req.body.skills !== 'undefined'){
    profileFields.skills = req.body.skills.split(',');
  }
  if(req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
  if(req.body.bio) profileFields.bio = req.body.bio;
  
  // Social fields
  profileFields.socialMedia = {}
  if(req.body.youtube) profileFields.socialMedia.youtube = req.body.youtube;
  if(req.body.instagram) profileFields.socialMedia.instagram = req.body.instagram;
  if(req.body.twitter) profileFields.socialMedia.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.socialMedia.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.socialMedia.linkedin = req.body.linkedin;

  // Check if Profile exists for a particular user
  Profile.findOne({user: req.user.id})
         .then(profile => {
           if(profile){
             // Profile already exists
             // Update existing Profile
             Profile.findOneAndUpdate(
               {user: req.user.id},
               {$set: profileFields},
               {new: true}
               )
                  .then(profile => res.json(profile));
           }else{
             // Create new profile
             // Check if handle exists
             Profile.findOne({handle: req.body.handle})
                    .then(handle => {
                      if(handle){
                        errors.handle = 'Handle already exists';
                        res.status(400).json(errors);
                      }
                      // Else, save profile
                      new Profile(profileFields)
                        .save()
                        .then(profile => res.json(profile));  
                    })
                    .catch(err => console.log(err));
           }
         })
         .catch(err => console.log(err));
})

// @route   GET /api/profile/
// desc     get user profile
// access   Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};
  console.log(req.user.id);
  Profile.findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
          
          if(!profile){
            errors.noProfile = 'There is no profile for this user.';
            return res.status(400).json(errors);
          }
          return res.json(profile);
        })
        .catch(err => console.log(err));
});

// @route   GET /api/profile/all
// desc     get all profiles
// access   Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profile => {
          if(!profile){
            errors.noProfile = 'There is no profile to display';
            return res.status(400).json(errors);
          }
          return res.json(profile);
        })
        .catch(err => console.log(err));
});

// @route GET /api/profile/get/handle/:handle
// @access PUBLIC
// @desc  GET profile by handle
router.get('/handle/:userHandle', (req, res) => {
  const errors = {};

  Profile.findOne({handle: req.params.userHandle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
          if(!profile){
            errors.noProfile = 'Profile does not exist for this user';
            return res.status(400).json(errors);
          }
          return res.json(profile);
        })
        .catch(err => console.log(err));
})

// @route   /api/profile/userid/:user_id
// @access  PUBLIC
// @desc    Locate user by user_id
router.get('/userid/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
          if(!profile){
            errors.noProfile = 'Profile does not exist for the user';
            return res.status(400).json(errors);
          }
          res.json(profile);
        })
        .catch(err => console.log(err));
});

// @route   /api/profile/
// @access  Private
// @desc    Delete an existing Profile
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log('In delete profile route');
  Profile.findOneAndRemove({user: req.user.id})
        .then(() => res.json({success: true}))
        .catch(err => console.log(err));
});

// Export the route
module.exports = router;