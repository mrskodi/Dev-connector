const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCommentInput(data){
  const errors = {};
  
  if(isEmpty(data.commentText)){
    errors.commentText = 'Comment needs to be provided';
  }
  return{
    errors,
    isValid: isEmpty(errors)
  }
}