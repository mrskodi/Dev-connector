const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: 'users'
  },
  postText: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [{
    user: {
      type: schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  
  comments: [{
    user: {
      type: schema.Types.ObjectId,
      ref: 'users'
    },
    commentText: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    avatar: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('posts', postSchema);