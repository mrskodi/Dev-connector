const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Import post model
const Post = require('../../models/Post');
// Import Profile Model
const Profile = require('../../models/Profile');
// Import Validation for creating a post
const validatePostInput = require('../../validations/post');
// Import Validation for adding a comment
const validateCommentInput = require('../../validations/comment');

// @route /api/posts/
// @desc create a new post
// @access PRIVATE
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Validate the user input
  const {errors, isValid} = validatePostInput(req.body);
  if(!isValid){
    return res.status(404).json(errors);
  }

  // Create a post object
  const newPost = new Post({
    postText: req.body.postText,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });
  
  // Save the new post
  newPost.save()
          .then(post => res.json(post))
          .catch(err => res.status(404).json(err));
  //console.log('saved the newPost into the collection');
});

// @route /api/posts/
// @desc Get all posts
// @access PRIVATE
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Post.find()
      .then(posts => res.json(posts))
      .catch(err => res.status(404).json({message: 'no  posts found'}));
});

// @route /api/posts/:post_id
// @desc Get post based on post_id
// @access PRIVATE
router.get('/:post_id', passport.authenticate('jwt', {session: false}), (req,res) => {
  let errors = {}
  Post.findById(req.params.post_id)
      .then(post => {
        if(!post){
          errors.postNotFound = 'Post with that id Not Found';
          return res.status(404).json(errors);
        }else{
          return res.json(post);
        }
      })
      .catch(err => res.status(404).json(err));
});

// @route /api/posts/:post_id
// @desc Delete a post when post_id given
// @access PRIVATE
router.delete('/:post_id', passport.authenticate('jwt', {session: false}), (req,res) => {
  // find the post that needs to be deleted
  Post.findById(req.params.post_id)
      .then(post => {
        if(!post){
          return res.status(404).json('Post not found');
        }else{
          // Check if the user is authenticated to delete the post
          if(post.user.toString() !== req.user.id){
            return res.status(401)
                      .json({notAuthorized: 'User not authorized to delete the post'});
          }
          // User is authorized to delete the post
          // Delete post
          post.remove().then(() => res.json({success: true}))
        }
      })
      .catch(err => res.json({message: 'Post not found'}));
})

// @route /api/posts/like/:post_id
// @desc Like a post when post_id is given
// @access PRIVATE
router.post('/like/:post_id', (passport.authenticate('jwt', {session: false})), (req, res) => {
  // Get the post to be liked from Post Collection
  
  Post.findById(req.params.post_id)
       .then(post => {
        // Check if the user has already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
          return res.status(400).json({alreadyLiked: 'User has already liked the post'});
        }
        // Add user to the likes array
        post.likes.unshift({user: req.user.id});
        // Save the post
        post.save().then(post => res.json(post));
       })
       .catch(err => res.json({postNotFound: 'Post Not Found'})); 
});

// @route /api/posts/unlike/:post_id
// @desc unlike a post when post_id is given
// @access PRIVATE
router.post('/unlike/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Get the post to be unliked from collection
  Post.findById(req.params.post_id)
      .then(post => {
        // Check if user has already liked it
        if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0){
          // User has not yet liked it
          return res.status(400).json({notLiked: 'User has not yet liked the post'});
        }
        // User has liked it, dislike
        // Get remove index
        const removeIndex = post.likes.map(item => item.user.toString())
                                      .indexOf(req.user.id);
       // Splice out of the array
       post.likes.splice(removeIndex, 1)
       // save the post
       post.save().then(post => res.json(post));
      })
      .catch(err => res.json({postNotFound: 'Post not found'}));
});

// @route /api/posts/comment/:post_id
// @desc add a comment to a post
// @access PRIVATE
router.post('/comments/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  // Validate comments
  const {errors, isValid} = validateCommentInput(req.body);

  // Get the post to which the user wants to comment
  Post.findById(req.params.post_id)
      .then(post => {
        
        if(post){
          // create a comment
          const newComment = {
            user: req.user.id,
            commentText: req.body.commentText,
            name: req.body.name,
            avatar: req.body.avatar
          }
        
          // Add the comment to the array
          post.comments.unshift(newComment);
          // save the array
          post.save().then(post => res.json(post));
        }
      })
      .catch(err => res.status(404).json({msg: 'Post not found'}));
});

// @route /api/posts/comment/:post_id/:comment_id
// @access PRIVATE
// @desc delete a comment from a post - post_id and comment_id should be known
router.delete('/comments/:post_id/:comment_id',
              passport.authenticate('jwt', {session: false}),
              (req, res) => {
                // Identify the post from which the comment needs to be deleted
                Post.findById(req.params.post_id)
                    .then(post => {
                      if(post){
                        // Check if comment exists
                        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                          return res.status(404).json({commentNotFound: 'Comment does not exist'});
                        }
                        // Check if user is authenticated to delete the comment
                        // Get remove index
                        const removeIndex = post.comments.map(item => item._id.toString())
                                                          .indexOf(req.params.comment_id);

                        // Delete the comment
                        post.comments.splice(removeIndex, 1);
                        // Save the post
                        post.save().then(post => res.json(post));

                      }
                    })
                    .catch(err => res.json({msg: 'post not found'}));
              } );

// Export the route
module.exports = router;