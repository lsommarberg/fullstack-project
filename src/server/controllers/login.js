const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = require('express').Router();

/**
 * User authentication endpoint that validates credentials and returns JWT token.
 * Compares provided password with stored hash and generates session token on success.
 *
 * @route POST /api/login
 * @param {Object} req.body - Request body containing user credentials
 * @param {string} req.body.username - User's username
 * @param {string} req.body.password - User's plain text password
 * @returns {Object} 200 - User data with JWT token
 * @returns {Object} 400 - Missing credentials error
 * @returns {Object} 401 - Invalid credentials error
 */
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: 'username and password are required',
    });
  }

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  res
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user._id });
});

module.exports = router;
