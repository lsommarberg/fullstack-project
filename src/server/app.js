const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const { errorHandler, tokenExtractor } = require('./utils/middleware');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const signupRouter = require('./controllers/signup');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/signup', signupRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

module.exports = app;
