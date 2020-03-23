const mongoose = require('mongoose');
const schema = mongoose.Schema;

const profileSchema = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 50
  },
  company: {
    type: String,
  },
  website: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  location: {
    type: String,
  },
  skills: {
    type: [String],
    required: true
  },
  githubUsername: {
    type: String
  },
  bio: {
    type: String,
    max: 300
  },
  socialMedia: {
    youtube: {
      type: String
    },
    instagram: {
      type: String
    },
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    linkedin: {
      type: String
    }
  },
  experience: [{
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      max: 300
    }
  }],
  education: [{
    school: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldOfStudy: {
      type: String,
      required: true
    },
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    },    
    current: {
      type: Boolean,
      default: false
    }
  }]
});

module.exports = Profile = mongoose.model('profiles', profileSchema);





