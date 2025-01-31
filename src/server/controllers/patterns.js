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
  console.log('pattern id', req.params.patternId);
  const pattern = await Pattern.findById(req.params.patternId);
  if (!pattern) {
    return res.status(404).json({ error: 'pattern not found' });
  }
  console.log('pattern', pattern);
  const updatedPattern = await Pattern.findByIdAndUpdate(
    req.params.patternId,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  res.json(updatedPattern);
});

module.exports = router;
