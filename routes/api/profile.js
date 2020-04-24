const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
// Import validations
const validateProfileInput = require('../../validations/profile');
const validateExperienceInput = require('../../validations/experience');
const validateEducationInput = require('../../validations/education');

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
                        return res.status(400).json(errors);
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
            res.status(400).json(errors);
          }
          res.json(profile);
        })
        .catch(err => res.status(404).json(err));
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

// @route   /api/profile/experience
// @access  PRIVATE
// @desc    Add experience
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
  // validation here...
  const { errors, isValid } = validateExperienceInput(req.body);
  if(!isValid){
    // return errors with status 400
    return res.status(400).json(errors);
  }

  // No errors, procede with creating experience
  Profile.findOne({user: req.user.id})
         .then(profile => {
           // Create an exp object and populate its fields
            const newExp = {};
          
            newExp.title = req.body.title;
            newExp.company = req.body.company;
            if(req.body.location) newExp.location = req.body.location;
            newExp.from = req.body.from;
            if(req.body.to) newExp.to = req.body.to;
            if(req.body.desc) newExp.desc = req.body.desc;

            // Add new exp to exp array in profile
            profile.experience.unshift(newExp);
            // save the profile
            profile.save()
                   .then(profile => res.json(profile));
         })
         .catch(err => console.log(err));
})

// @route   /api/profile/education
// @access  PRIVATE
// @desc    Add education
router.post('/education', passport.authenticate('jwt', {session: false}), (req,res) => {
  // validations here...
  const {errors, isValid} = validateEducationInput(req.body);
  if(!isValid){
    // return errors
    return res.status(404).json(errors);
  }

  Profile.findOne({user: req.user.id})
         .then(profile => {
           // Create a edu object
           const newEdu = {};

           // Populate the newEdu with fields
           newEdu.school = req.body.school;
           newEdu.degree = req.body.degree;
           newEdu.fieldOfStudy = req.body.fieldOfStudy;
           newEdu.from = req.body.from;
           if(req.body.to) newEdu.to = req.body.to;

           // Add the newEdu to the education array of the profile
           profile.education.unshift(newEdu);
           // save the profile
           profile.save()
                  .then(profile => res.json(profile));

         })
         .catch(err => console.log(err));
})

// @route   /api/profile/experience
// @access  PRIVATE
// @desc    delete an existing experience
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) =>{
  let errors = {};

  // Locate the profile
  Profile.findOne({user: req.user.id})
         .then(profile => {
           if(!profile){
             errors.profileNotFound = 'Profile does not exist';
             return res.status(404).json(errors);
           }else{
           // find out the index in which exp_id is stored in experience[]
           const removeIndex = profile.experience
                                      .map(item => item.id)
                                      .indexOf(req.params.exp_id);
           if(removeIndex === -1){
             errors.experienceNotFound = 'Experience Not found'
             return res.status(404).json(errors);
           }                           

           // Index found, splice the array
           profile.experience.splice(removeIndex, 1);
           // save the profile
           profile.save()
                  .then(profile => res.json(profile));
            }
         })
         .catch(err => res.status(404).json(err)); 
})

// @route   /api/profile/education
// @access  PRIVATE
// @desc    delete an existing education
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  let errors = {};

  Profile.findOne({user: req.user.id})
         .then(profile => {

          if(!profile){
            errors.profileNotFound = 'Profile does not exist';
            return res.status(404).json(errors);
          }else{
          // get the index where edu_id is stored in education[]
          const removeIndex = profile.education
                                      .map(item => item.id)
                                      .indexOf(req.params.edu_id);
          if(removeIndex === -1){
            errors.educationNotFound = 'Education not Found';
            return res.status(404).json(errors);
          }                                     
          
          // Splice edu_id out of the array
          profile.education.splice(removeIndex, 1);
          // save the profile
          profile.save().then(profile => res.json(profile));
          }
         })
         .catch(err => res.status(404).json(err));
})

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