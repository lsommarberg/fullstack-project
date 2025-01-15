const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const api = supertest(app);

describe('login api tests', () => {
  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({ username: 'testuser', passwordHash });
    await user.save();
  });
  test('succeeds with valid credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe('testuser');
  });
  test('fails with invalid credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'wrongpassword',
    };

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('invalid username or password');
  });

  test('fails with missing username', async () => {
    const loginData = {
      password: 'testpassword',
    };

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('username and password are required');
  });

  test('fails with missing password', async () => {
    const loginData = {
      username: 'testuser',
    };

    const response = await api
      .post('/api/login')
      .send(loginData)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('username and password are required');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
