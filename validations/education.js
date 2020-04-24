const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data){
  const errors = {};

  if(isEmpty(data.school)){
    errors.school = 'School name required';
  }

  if(isEmpty(data.fieldOfStudy)){
    errors.fieldOfStudy = 'Field of Study required';
  }

  if(isEmpty(data.degree)){
    errors.degree = 'Degree required';
  }

  if(isEmpty(data.from)){
    errors.from = 'From date of degree required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}