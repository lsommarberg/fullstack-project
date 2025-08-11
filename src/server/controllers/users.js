const router = require('express').Router();
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

router.get('/storage/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

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
