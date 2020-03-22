const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user schema
const userSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  password2: {
    type: String,
    
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }  
});

// export the file such that a collection 'users' is created in mongodb and 
// a refernce to that collection is passed back and given to the variable 'User'
module.exports = User = mongoose.model('users', userSchema);
