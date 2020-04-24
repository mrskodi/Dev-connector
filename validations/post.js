const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data){
  const errors ={}

  if(isEmpty(data.postText)){
    errors.postText = 'Post text cannot be empty';
  }
  return{
    errors,
    isValid: isEmpty(errors)
  }
}