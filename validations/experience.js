const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
  const errors = {};

  if(isEmpty(data.title)){
    errors.title = 'Job title is required';
  }

  if(isEmpty(data.company)){
    errors.company = 'Company name is required';
  }

  if(isEmpty(data.from)){
    errors.from = 'From date is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}