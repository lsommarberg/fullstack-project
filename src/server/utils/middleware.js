const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Authentication and authorization middleware functions.
 * Provides JWT token extraction and user authentication for protected routes.
 */

/**
 * Extract JWT token from Authorization header.
 * Looks for Bearer token format and sets req.token for downstream middleware.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  } else {
    req.token = null;
  }
  next();
};

/**
 * Extract and validate user from JWT token.
 * Verifies token signature and loads user data for authorization checks.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {Object} 401 - Invalid or missing token
 */
const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' });
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    req.user = null;
    return res.status(401).json({ error: 'token invalid' });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(401).json({ error: 'token invalid' });
  }
  req.user = user;
  next();
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: 'token missing or invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  } else {
    return res.status(500).json({ error: 'something went wrong' });
  }
};

module.exports = {
  tokenExtractor,
  errorHandler,
  userExtractor,
};
