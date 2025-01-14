const express = require('express');
const cors = require('cors');
const app = express();
require('express-async-errors');
const { errorHandler, tokenExtractor } = require('./utils/middleware');

const signupRouter = require('./controllers/signup');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use('/api/signup', signupRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

module.exports = app;
