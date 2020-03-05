const express = require('express');
const mongoose = require('mongoose');
const app = new express();

// DB configuration.
const db = require('./config/keys').mongoURI;

// connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log('Mongodb connected!'))
  .catch(err => console.log(err));


// Write the first route
app.get('/', (req, res) => res.send('Hello world again!'));

// Set up the port
const port = 8020;
app.listen(port, () => console.log(`Server running on port ${port}`));


