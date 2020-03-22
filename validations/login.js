const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  const errors = {};

  // Validate email
  if(!validator.isEmail(data.email)){
    errors.email = 'Enter a valid email id';
  }

  if(isEmpty(data.email)){
    errors.email = 'Email cannot be empty';
  }

  // Validate password
  if(isEmpty(data.password)){
    errors.password = 'Password cannot be empty';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}