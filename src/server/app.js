const express = require('express');
const cors = require('cors');
const app = express();
require('express-async-errors');
const { errorHandler } = require('./utils/middleware');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.use(errorHandler);

module.exports = app;
