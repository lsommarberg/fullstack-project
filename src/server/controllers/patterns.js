const router = require('express').Router();
const Pattern = require('../models/pattern');
const { userExtractor } = require('../utils/middleware');

router.get('/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const patterns = await Pattern.find({ user: req.params.id });
  res.json(patterns);
});

router.post('/', userExtractor, async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const pattern = new Pattern({
    ...req.body,
    user: user._id,
  });
  const savedPattern = await pattern.save();
  user.patterns = user.patterns.concat(savedPattern._id);
  await user.save();

  res.status(201).json(savedPattern);
});

router.get('/:id/:patternId', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const pattern = await Pattern.findById(req.params.patternId);
  res.json(pattern);
});

router.delete('/:id/:patternId', userExtractor, async (req, res) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const pattern = await Pattern.findById(req.params.patternId);

  if (!pattern) {
    return res.status(404).json({ error: 'pattern not found' });
  }
  await Pattern.deleteOne({ _id: req.params.patternId });

  res.status(204).end();
});

router.put('/:id/:patternId', userExtractor, async (req, res) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const pattern = await Pattern.findById(req.params.patternId);
  if (!pattern) {
    return res.status(404).json({ error: 'pattern not found' });
  }

  const updateFields = { ...req.body };

  const updatedPattern = await Pattern.findByIdAndUpdate(
    req.params.patternId,
    { ...updateFields },
    { new: true },
  ).populate('user', { username: 1, name: 1 });

  res.json(updatedPattern);
});

module.exports = router;
