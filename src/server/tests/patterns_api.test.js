const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Pattern = require('../models/pattern');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

let token;
let userId;
let patternId;

beforeAll(async () => {
  await User.deleteMany({});
  await Pattern.deleteMany({});

  const passwordHash = await bcrypt.hash('password', 10);
  const user = new User({ username: 'testuser', passwordHash });
  const savedUser = await user.save();
  userId = savedUser._id;

  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password' });

  token = response.body.token;

  const newPattern = new Pattern({
    name: 'Basic Knit Scarf',
    text: 'This is a simple knitting pattern for beginners.',
    link: 'https://example.com/basic-knit-scarf-pattern',
    tags: ['knitting', 'scarf', 'beginner', 'simple'],
    notes: ['This pattern is great for beginners.'],
    user: userId,
  });

  const savedPattern = await newPattern.save();
  patternId = savedPattern._id;
});

describe('Pattern API', () => {
  test('should create a new pattern', async () => {
    const newPattern = {
      name: 'Other Knit Scarf',
      text: 'This is a simple knitting pattern for beginners.',
      link: 'https://example.com/basic-knit-scarf-pattern',
      tags: ['knitting', 'scarf', 'beginner', 'simple'],
      notes: ['This pattern is great for beginners.'],
    };

    await api
      .post('/api/patterns')
      .set('Authorization', `Bearer ${token}`)
      .send(newPattern)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const patternsAtEnd = await Pattern.find({});
    expect(patternsAtEnd).toHaveLength(2);

    const names = patternsAtEnd.map((p) => p.name);
    expect(names).toContain('Other Knit Scarf');
  });

  test('should get patterns of a specific user', async () => {
    const response = await api
      .get(`/api/patterns/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe('Basic Knit Scarf');
  });

  test('should return 401 Unauthorized for creating pattern without token', async () => {
    const newPattern = {
      name: 'Unauthorized Pattern',
      text: 'This pattern should not be created.',
      link: 'https://example.com/unauthorized-pattern',
      tags: ['unauthorized'],
      notes: ['This should not be created.'],
    };

    await api
      .post('/api/patterns')
      .send(newPattern)
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });

  test('should return 403 Forbidden for getting patterns of another user', async () => {
    const anotherUser = new User({
      username: 'anotheruser',
      passwordHash: await bcrypt.hash('password', 10),
    });
    const savedAnotherUser = await anotherUser.save();

    const anotherUserId = savedAnotherUser._id;

    const response = await api
      .get(`/api/patterns/${anotherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  test('should return 403 Forbidden for getting a specific pattern of another user', async () => {
    const anotherUser = new User({
      username: 'anotheruser1',
      passwordHash: await bcrypt.hash('password', 10),
    });
    const savedAnotherUser = await anotherUser.save();

    const anotherUserId = savedAnotherUser._id;

    const response = await api
      .get(`/api/patterns/${anotherUserId}/${patternId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  test('should get a specific pattern for the authenticated user', async () => {
    const response = await api
      .get(`/api/patterns/${userId}/${patternId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe('Basic Knit Scarf');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
