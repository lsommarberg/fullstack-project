const router = require('express').Router();
const Project = require('../models/project');
const { userExtractor } = require('../utils/middleware');

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
