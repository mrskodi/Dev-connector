const validator = require('validator');
const isEmpty = require('./is-empty');

function validateRegisterInput(data){
  const errors = {}

  // Validate Name
  if(!validator.isLength(data.name, {min: 2, max: 30})){
    errors.name = 'Name should be between 2 and 30 characters';
  }

  if(isEmpty(data.name)){
    errors.name = 'Name cannot be empty';
  }

  // Validate Email
  if(!validator.isEmail(data.email)){
    errors.email = 'Enter a valid email id';
  }

  if(isEmpty(data.email)){
    errors.email = 'Email cannot be empty';
  }

  // Validate password
  if(!validator.isLength(data.password, {min: 8, max: 30})){
    errors.password = 'Password must be between 8 and 30 characters';
  }

  if(isEmpty(data.password)){
    errors.password = 'Password cannot be empty';
  }

  // Validate confirm password
  if(!validator.equals(data.password, data.password2)){
    errors.password2 = 'Passwords must match';
  }

  if(isEmpty(data.password2)){
    errors.password2 = 'Confirm password cannot be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput;