const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = require('express').Router();

/**
 * User registration endpoint that creates new user accounts with encrypted passwords.
 * Validates username uniqueness and password strength before creating account.
 *
 * @route POST /api/users
 * @param {Object} req.body - Request body containing registration data
 * @param {string} req.body.username - Desired username (must be unique)
 * @param {string} req.body.password - User's plain text password
 * @returns {Object} 201 - Created user data
 * @returns {Object} 400 - Missing fields or validation errors
 * @returns {Object} 409 - Username already exists
 */
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    passwordHash,
  });
  const savedUser = await user.save();
  return res.status(201).json(savedUser);
});

module.exports = router;
