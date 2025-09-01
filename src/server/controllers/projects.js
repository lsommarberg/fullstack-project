const router = require('express').Router();
const Project = require('../models/project');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

/**
 * Project management controller providing CRUD operations for knitting projects.
 * Includes project search, filtering by dates and status, creation, updates, and completion.
 * All operations require user authentication and projects are user-scoped.
 */

/**
 * Search and filter projects with advanced filtering options.
 * Supports text search, date range filtering, and status filtering.
 *
 * @route GET /api/projects/search
 * @param {string} req.query.q - Search query string (optional)
 * @param {string} req.query.startedAfter - Filter projects started after date (optional)
 * @param {string} req.query.startedBefore - Filter projects started before date (optional)
 * @param {string} req.query.finishedAfter - Filter projects finished after date (optional)
 * @param {string} req.query.finishedBefore - Filter projects finished before date (optional)
 * @returns {Array} 200 - Filtered projects for authenticated user
 */
router.get('/search', userExtractor, async (req, res) => {
  const { q } = req.query;
  const filter = { user: req.user.id };
  if (q) {
    const re = new RegExp(q, 'i');
    filter.$or = [{ name: re }, { notes: re }, { tags: re }];
  }

  if (req.query.startedAfter) {
    filter.startedAt = {
      ...filter.startedAt,
      $gte: new Date(req.query.startedAfter),
    };
  }
  if (req.query.startedBefore) {
    filter.startedAt = {
      ...filter.startedAt,
      $lte: new Date(req.query.startedBefore),
    };
  }
  if (req.query.finishedAfter) {
    filter.finishedAt = {
      ...filter.finishedAt,
      $gte: new Date(req.query.finishedAfter),
    };
  }
  if (req.query.finishedBefore) {
    filter.finishedAt = {
      ...filter.finishedAt,
      $lte: new Date(req.query.finishedBefore),
    };
  }

  const results = await Project.find(filter).sort({ startedAt: -1 }).exec();
  res.json(results);
});

router.get('/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const projects = await Project.find({ user: req.params.id }).populate(
    'pattern',
  );
  res.json(projects);
});

router.post('/', userExtractor, async (req, res) => {
  const user = req.user;

  const project = new Project({
    ...req.body,
    user: user._id,
  });
  const savedProject = await project.save();
  user.projects = user.projects.concat(savedProject._id);
  await user.save();

  res.status(201).json(savedProject);
});

router.get('/:id/:projectId', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }
  const project = await Project.findById(req.params.projectId).populate(
    'pattern',
  );
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }
  res.json(project);
});

router.delete('/:id/:projectId', userExtractor, async (req, res) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }

  await Project.deleteOne({ _id: req.params.projectId });

  await User.findByIdAndUpdate(req.params.id, {
    $pull: { projects: req.params.projectId },
  });

  res.status(204).end();
});

router.put('/:id/:projectId', userExtractor, async (req, res) => {
  if (req.user.id.toString() !== req.params.id.toString()) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const project = await Project.findById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'project not found' });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.projectId,
    req.body,
    { new: true },
  );

  res.json(updatedProject);
});

module.exports = router;
