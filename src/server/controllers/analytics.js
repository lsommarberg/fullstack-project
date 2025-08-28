const router = require('express').Router();
const mongoose = require('mongoose');
const Project = require('../models/project');
const Pattern = require('../models/pattern');
const { userExtractor } = require('../utils/middleware');

router.get('/:id', userExtractor, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const userId = req.params.id;

  try {
    const totalProjects = await Project.countDocuments({ user: userId });
    const completedProjects = await Project.countDocuments({
      user: userId,
      finishedAt: { $ne: null },
    });
    const completionRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const activityByMonth = await Project.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          startedAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$startedAt' },
            month: { $month: '$startedAt' },
          },
          started: { $sum: 1 },
          finished: {
            $sum: {
              $cond: [{ $ne: ['$finishedAt', null] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const mostUsedPatterns = await Project.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          pattern: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$pattern',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'patterns',
          localField: '_id',
          foreignField: '_id',
          as: 'pattern',
        },
      },
      {
        $unwind: '$pattern',
      },
      {
        $project: {
          patternId: '$_id',
          patternName: '$pattern.name',
          projectCount: '$count',
        },
      },
      {
        $sort: { projectCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const averageDuration = await Project.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          startedAt: { $ne: null },
          finishedAt: { $ne: null },
        },
      },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$finishedAt', '$startedAt'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$duration' },
          minDuration: { $min: '$duration' },
          maxDuration: { $max: '$duration' },
          count: { $sum: 1 },
        },
      },
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = {
      projectsStarted: await Project.countDocuments({
        user: userId,
        startedAt: { $gte: thirtyDaysAgo },
      }),
      projectsCompleted: await Project.countDocuments({
        user: userId,
        finishedAt: { $gte: thirtyDaysAgo },
      }),
      patternsCreated: await Pattern.countDocuments({
        user: userId,
        createdAt: { $gte: thirtyDaysAgo },
      }),
    };

    const currentProjects = {
      inProgress: await Project.countDocuments({
        user: userId,
        finishedAt: null,
      }),
      completed: completedProjects,
      total: totalProjects,
    };

    res.json({
      userId,
      completionRate: {
        percentage: completionRate,
        completed: completedProjects,
        total: totalProjects,
      },
      activityByMonth,
      mostUsedPatterns,
      averageDuration: averageDuration[0] || {
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        count: 0,
      },
      recentActivity,
      currentProjects,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
