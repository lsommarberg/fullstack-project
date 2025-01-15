const router = require('express').Router();
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const user = await User.findById(req.params.id);
  res.json(user);
});

module.exports = router;
