const validator = require('validator');
const isEmpty = require('../validations/is-empty');

module.exports = validateProfileInput = data => {
  const errors = {};

    if(!validator.isLength(data.handle, {min:6, max: 30})){
      errors.handle = 'User handle must be between 6 and 30 characters';
    }

    if(isEmpty(data.handle)){
      errors.handle = 'User handle is required';
    }

    if(isEmpty(data.status)){
      errors.status = 'Status Field is required';
    }

    if(isEmpty(data.skills)){
      errors.skills = 'Skills field is required';
    }

    if(!isEmpty(data.website)){
      if(!validator.isURL(data.website)){
        errors.website = 'Not a valid url';
      }
    }

    if(!isEmpty(data.youtube)){
      if(!validator.isURL(data.youtube)){
        errors.youtube = 'Not a valid youtube link';
      }
    }

    if(!isEmpty(data.twitter)){
      if(!validator.isURL(data.twitter)){
        errors.twitter = 'Not a valid url';
      }
    }

    if(!isEmpty(data.instagram)){
      if(!validator.isURL(data.instagram)){
        errors.instagram = 'Not a valid url';
      }
    }

    if(!isEmpty(data.linkedin)){
      if(!validator.isURL(data.linkedin)){
        errors.linkedin = 'Not a valid url';
      }
    }

  return {
    errors,
    isValid: isEmpty(errors)
  }
} 