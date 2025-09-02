const router = require('express').Router();
const Pattern = require('../models/pattern');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

/**
 * Pattern management controller providing CRUD operations for knitting patterns.
 * Includes pattern search, filtering, creation, updates, and deletion.
 * All operations require user authentication and proper authorization.
 */

/**
 * Search patterns by query string with optional sorting.
 * Searches through pattern names, text content, and tags.
 *
 * @route GET /api/patterns/search
 * @param {string} req.query.q - Search query string
 * @param {string} req.query.sortBy - Sort order (optional)
 * @returns {Array} 200 - Matching patterns
 * @returns {Object} 400 - Missing query parameter
 */
router.get('/search', userExtractor, async (req, res) => {
  const { q, sortBy } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  const re = new RegExp(q, 'i');

  let query = Pattern.find({
    user: req.user.id,
    $or: [{ name: re }, { text: re }, { tags: re }],
  });

  if (sortBy === 'name') {
    query = query.sort({ name: 1 });
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const results = await query.exec();
  res.json(results);
});

router.get('/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const patterns = await Pattern.find({ user: req.params.id });
  res.json(patterns);
});

router.post('/', userExtractor, async (req, res) => {
  const user = req.user;

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

  await User.findByIdAndUpdate(req.params.id, {
    $pull: { patterns: req.params.patternId },
  });

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
