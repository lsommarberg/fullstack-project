const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const config = require('./utils/config');
const { errorHandler, tokenExtractor } = require('./utils/middleware');
const logger = require('./utils/logger');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connection to MongoDB:', error.message);
  });

const signupRouter = require('./controllers/signup');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const patternRouter = require('./controllers/patterns');

const app = express();

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

morgan.token('data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
);

app.use('/api/signup', signupRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/patterns', patternRouter);

if (process.env.NODE_ENV === 'test') {
  const testUtilsRouter = require('./controllers/reset');
  app.use('/api/testing', testUtilsRouter);
}

app.use(errorHandler);

module.exports = app;
