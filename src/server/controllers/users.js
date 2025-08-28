const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

const MAX_STORAGE_LIMIT = 100 * 1024 * 1024;

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

router.put('/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { username, currentPassword, newPassword } = req.body;
  const user = req.user;

  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.id !== user.id) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    user.username = username;
  }

  if (newPassword) {
    if (!currentPassword) {
      return res
        .status(400)
        .json({ error: 'Current password is required to set new password' });
    }

    const passwordCorrect = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!passwordCorrect) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    user.passwordHash = newPasswordHash;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
});

router.get('/storage/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const user = req.user;

  const usagePercentage = Math.round(
    (user.uploadStats / MAX_STORAGE_LIMIT) * 100,
  );

  res.json({
    success: true,
    storageUsed: user.uploadStats,
    storageLimit: MAX_STORAGE_LIMIT,
    usagePercentage: usagePercentage,
    remainingStorage: MAX_STORAGE_LIMIT - user.uploadStats,
  });
});

module.exports = router;
