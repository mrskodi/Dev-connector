const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body Parse middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Passport middleware configuration
require('./config/passport')(passport);

// DB configuration.
const db = require('./config/keys').mongoURI;

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log('Mongodb connected!'))
  .catch(err => console.log(err));

// Write the first route
// @route   GET /
// desc     tests first route
// access   Public access
app.get('/', (req, res) => res.send('hey there!!'));

// Route the call to the corresponding js file
app.use('/api/users', users);
app.get('/api/users', (req, res) => {
  console.log('Successful in users');
  return res.send('In the users page');
});

app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Set up the port
const port = 8020;
app.listen(port, () => console.log(`Server running on port ${port}`));


