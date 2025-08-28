const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Project = require('../models/project');
const Pattern = require('../models/pattern');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const api = supertest(app);

describe('Analytics API', () => {
  let token;
  let userId;
  let patternId;

  beforeAll(async () => {
    await User.deleteMany({});
    await Pattern.deleteMany({});
    await Project.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({ username: 'testuser3', passwordHash });
    const savedUser = await user.save();
    userId = savedUser._id.toString();

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

    const pattern = new Pattern({
      name: 'Test Pattern',
      text: 'Test pattern description',
      user: userId,
    });
    const savedPattern = await pattern.save();
    patternId = savedPattern._id;

    const projects = [
      {
        name: 'Completed Project 1',
        user: userId,
        pattern: patternId,
        startedAt: new Date('2024-01-15'),
        finishedAt: new Date('2024-01-30'),
      },
      {
        name: 'Completed Project 2',
        user: userId,
        pattern: patternId,
        startedAt: new Date('2024-02-01'),
        finishedAt: new Date('2024-02-10'),
      },
      {
        name: 'In Progress Project',
        user: userId,
        startedAt: new Date('2024-03-01'),
        finishedAt: null,
      },
    ];

    await Project.insertMany(projects);
  });

  test('gets analytics data for user', async () => {
    const response = await api
      .get(`/api/analytics/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.userId).toBe(userId);
    expect(response.body.completionRate).toBeDefined();
    expect(response.body.completionRate.total).toBe(3);
    expect(response.body.completionRate.completed).toBe(2);
    expect(response.body.completionRate.percentage).toBe(67);

    expect(response.body.currentProjects).toBeDefined();
    expect(response.body.currentProjects.total).toBe(3);
    expect(response.body.currentProjects.completed).toBe(2);
    expect(response.body.currentProjects.inProgress).toBe(1);

    expect(response.body.activityByMonth).toBeDefined();
    expect(Array.isArray(response.body.activityByMonth)).toBe(true);

    expect(response.body.mostUsedPatterns).toBeDefined();
    expect(Array.isArray(response.body.mostUsedPatterns)).toBe(true);

    expect(response.body.averageDuration).toBeDefined();
    expect(response.body.averageDuration.count).toBe(2);
    expect(response.body.averageDuration.avgDuration).toBeGreaterThan(0);

    expect(response.body.recentActivity).toBeDefined();
  });

  test('fails to get analytics without token', async () => {
    const response = await api
      .get(`/api/analytics/${userId}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('token missing');
  });

  test('fails to get analytics for another user', async () => {
    const otherPasswordHash = await bcrypt.hash('testpassword', 10);
    const otherUser = new User({
      username: 'otheruser',
      passwordHash: otherPasswordHash,
    });
    const savedOtherUser = await otherUser.save();
    const otherUserId = savedOtherUser._id.toString();

    const response = await api
      .get(`/api/analytics/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
