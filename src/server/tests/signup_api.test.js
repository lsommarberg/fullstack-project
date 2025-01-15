const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const api = supertest(app);

describe('signup api tests', () => {
  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({ username: 'testuser2', passwordHash });
    await user.save();
  });
  test('succeeds with valid credentials', async () => {
    const signupData = {
      username: 'test',
      password: 'testpassword',
    };

    const response = await api
      .post('/api/signup')
      .send(signupData)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.username).toBe('test');
  });
  test('fails with taken username', async () => {
    const signupData = {
      username: 'testuser2',
      password: 'password',
    };

    const response = await api
      .post('/api/signup')
      .send(signupData)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('expected `username` to be unique');
  });

  test('fails with missing username', async () => {
    const signupData = {
      password: 'testpassword',
    };

    const response = await api
      .post('/api/signup')
      .send(signupData)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('Username and password are required');
  });

  test('fails with missing password', async () => {
    const signupData = {
      username: 'user',
    };

    const response = await api
      .post('/api/signup')
      .send(signupData)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('Username and password are required');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
