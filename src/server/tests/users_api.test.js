const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const api = supertest(app);

describe('users api tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    const user = new User({ username: 'testuser3', passwordHash });
    const savedUser = await user.save();
    userId = savedUser._id.toString();

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });
  });

  test('gets all users', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].username).toBe('testuser3');
  });

  test('gets a user by id', async () => {
    const response = await api
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.username).toBe('testuser3');
  });

  test('fails to get a user by id without token', async () => {
    const response = await api
      .get(`/api/users/${userId}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('token missing');
  });

  test('fails to get a user by id with invalid token', async () => {
    const invalidToken = token.slice(0, token.length - 1);
    const response = await api
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('token missing or invalid');
  });

  test('fails to get a user by id with expired token', async () => {
    const userForToken = {
      username: 'testuser3',
      id: userId,
    };
    const expiredToken = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: '0s',
    });
    const response = await api
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('token expired');
  });

  test('fails to get a user by id with wrong token', async () => {
    const otherPasswordHash = await bcrypt.hash('testpassword', 10);
    const otherUser = new User({ username: 'test2', otherPasswordHash });
    const savedOtherUser = await otherUser.save();
    const savedOtherUserId = savedOtherUser._id.toString();

    const response = await api
      .get(`/api/users/${savedOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
