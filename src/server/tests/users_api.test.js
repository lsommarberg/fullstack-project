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
    const otherUser = new User({
      username: 'test2',
      passwordHash: otherPasswordHash,
    });
    const savedOtherUser = await otherUser.save();
    const savedOtherUserId = savedOtherUser._id.toString();

    const response = await api
      .get(`/api/users/${savedOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  describe('PUT /api/users/:id', () => {
    test('updates username successfully', async () => {
      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'updatedusername' })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.username).toBe('updatedusername');
      expect(response.body.id).toBe(userId);
    });

    test('updates password successfully', async () => {
      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'testpassword',
          newPassword: 'newtestpassword',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.id).toBe(userId);

      const updatedUser = await User.findById(userId);
      const passwordCorrect = await bcrypt.compare(
        'newtestpassword',
        updatedUser.passwordHash,
      );
      expect(passwordCorrect).toBe(true);
    });

    test('updates both username and password successfully', async () => {
      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'newerusername',
          currentPassword: 'newtestpassword',
          newPassword: 'anothernewpassword',
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.username).toBe('newerusername');

      const updatedUser = await User.findById(userId);
      const passwordCorrect = await bcrypt.compare(
        'anothernewpassword',
        updatedUser.passwordHash,
      );
      expect(passwordCorrect).toBe(true);
    });

    test('fails to update with duplicate username', async () => {
      const otherPasswordHash = await bcrypt.hash('testpassword', 10);
      const otherUser = new User({
        username: 'duplicateuser',
        passwordHash: otherPasswordHash,
      });
      await otherUser.save();

      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'duplicateuser' })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('Username already taken');
    });

    test('fails to update password without current password', async () => {
      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ newPassword: 'newpassword' })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe(
        'Current password is required to set new password',
      );
    });

    test('fails to update password with incorrect current password', async () => {
      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword',
        })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('Current password is incorrect');
    });

    test('fails to update user without token', async () => {
      const response = await api
        .put(`/api/users/${userId}`)
        .send({ username: 'newusername' })
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('token missing');
    });

    test('fails to update user with invalid token', async () => {
      const invalidToken = token.slice(0, token.length - 1);
      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({ username: 'newusername' })
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('token missing or invalid');
    });

    test('fails to update another user', async () => {
      const otherPasswordHash = await bcrypt.hash('testpassword', 10);
      const otherUser = new User({
        username: 'otheruser',
        passwordHash: otherPasswordHash,
      });
      const savedOtherUser = await otherUser.save();
      const otherUserId = savedOtherUser._id.toString();

      const response = await api
        .put(`/api/users/${otherUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'hackedusername' })
        .expect(403)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('forbidden');
    });

    test('allows updating username to same value', async () => {
      const userResponse = await api
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const currentUsername = userResponse.body.username;

      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ username: currentUsername })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.username).toBe(currentUsername);
    });

    test('handles empty request body gracefully', async () => {
      const response = await api
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.id).toBe(userId);
    });
  });

  describe('GET /api/users/storage/:id', () => {
    test('gets storage stats for user', async () => {
      const response = await api
        .get(`/api/users/storage/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.storageUsed).toBeDefined();
      expect(response.body.storageLimit).toBe(100 * 1024 * 1024); // 100MB
      expect(response.body.usagePercentage).toBeDefined();
      expect(response.body.remainingStorage).toBeDefined();
      expect(typeof response.body.storageUsed).toBe('number');
      expect(typeof response.body.usagePercentage).toBe('number');
      expect(typeof response.body.remainingStorage).toBe('number');
    });

    test('fails to get storage stats without token', async () => {
      const response = await api
        .get(`/api/users/storage/${userId}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('token missing');
    });

    test('fails to get storage stats with invalid token', async () => {
      const invalidToken = token.slice(0, token.length - 1);
      const response = await api
        .get(`/api/users/storage/${userId}`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('token missing or invalid');
    });

    test('fails to get storage stats for another user', async () => {
      const otherPasswordHash = await bcrypt.hash('testpassword', 10);
      const otherUser = new User({
        username: 'otherstorageuser',
        passwordHash: otherPasswordHash,
      });
      const savedOtherUser = await otherUser.save();
      const otherUserId = savedOtherUser._id.toString();

      const response = await api
        .get(`/api/users/storage/${otherUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('forbidden');
    });

    test('calculates usage percentage correctly', async () => {
      const testStorageUsage = 25 * 1024 * 1024; // 25MB
      await User.findByIdAndUpdate(userId, { uploadStats: testStorageUsage });

      const response = await api
        .get(`/api/users/storage/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.storageUsed).toBe(testStorageUsage);
      expect(response.body.usagePercentage).toBe(25);
      expect(response.body.remainingStorage).toBe(75 * 1024 * 1024);
    });

    test('handles zero storage usage', async () => {
      await User.findByIdAndUpdate(userId, { uploadStats: 0 });

      const response = await api
        .get(`/api/users/storage/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.storageUsed).toBe(0);
      expect(response.body.usagePercentage).toBe(0);
      expect(response.body.remainingStorage).toBe(100 * 1024 * 1024);
    });

    test('handles maximum storage usage', async () => {
      const maxStorage = 100 * 1024 * 1024;
      await User.findByIdAndUpdate(userId, { uploadStats: maxStorage });

      const response = await api
        .get(`/api/users/storage/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.success).toBe(true);
      expect(response.body.storageUsed).toBe(maxStorage);
      expect(response.body.usagePercentage).toBe(100);
      expect(response.body.remainingStorage).toBe(0);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
