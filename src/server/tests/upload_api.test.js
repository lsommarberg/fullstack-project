const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');

jest.mock('../config/cloudinary');
jest.mock('../middleware/upload', () => ({
  single: jest.fn(() => (req, res, next) => {
    if (req.body.mockFile) {
      req.file = JSON.parse(req.body.mockFile);
    }
    next();
  }),
}));

const cloudinary = require('../config/cloudinary');
const api = supertest(app);

describe('Upload API tests', () => {
  let testUser;
  let token;

  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('testpassword', 10);
    testUser = new User({
      username: 'testuser',
      passwordHash,
      uploadStats: 50 * 1024 * 1024,
    });
    await testUser.save();

    const loginResponse = await api.post('/api/login').send({
      username: 'testuser',
      password: 'testpassword',
    });

    token = loginResponse.body.token;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    cloudinary.uploader = {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
    };
    cloudinary.api = {
      resource: jest.fn().mockResolvedValue({ bytes: 1024 * 1024 }),
    };
  });

  const mockFile = {
    size: 1024 * 1024,
    path: 'https://cloudinary.com/image.jpg',
    filename: 'test-image-id',
  };

  describe('POST /:id', () => {
    test('should upload image successfully', async () => {
      const response = await api
        .post(`/api/upload/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ mockFile: JSON.stringify(mockFile) })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        success: true,
        url: mockFile.path,
        secure_url: mockFile.path,
        publicId: mockFile.filename,
        fileSize: mockFile.size,
        storageUsed: testUser.uploadStats + mockFile.size,
        storageLimit: 100 * 1024 * 1024,
        message: 'Image uploaded successfully',
      });
    });

    test('should return 403 when user ID does not match', async () => {
      const response = await api
        .post('/api/upload/differentUserId')
        .set('Authorization', `Bearer ${token}`)
        .send({ mockFile: JSON.stringify(mockFile) })
        .expect(403)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({ error: 'forbidden' });
    });

    test('should return 400 when no file is provided', async () => {
      const response = await api
        .post(`/api/upload/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        success: false,
        message: 'No image file provided',
      });
    });

    test('should return 401 when no token is provided', async () => {
      const response = await api
        .post(`/api/upload/${testUser.id}`)
        .send({ mockFile: JSON.stringify(mockFile) })
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('token missing');
    });

    test('should return 413 when storage limit is exceeded', async () => {
      testUser.uploadStats = 99.5 * 1024 * 1024;
      await testUser.save();

      const response = await api
        .post(`/api/upload/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ mockFile: JSON.stringify(mockFile) })
        .expect(413)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        success: false,
        message: 'Storage limit exceeded',
        currentUsage: 99.5 * 1024 * 1024,
        limit: 100 * 1024 * 1024,
        fileSize: mockFile.size,
      });

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        mockFile.filename,
      );
    });
  });

  describe('DELETE /:id', () => {
    const deletePayload = { publicId: 'test-image-id' };

    test('should delete image successfully', async () => {
      const response = await api
        .delete(`/api/upload/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(deletePayload)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        success: true,
        fileSize: 1024 * 1024,
        storageUsed: Math.max(0, testUser.uploadStats - 1024 * 1024),
        storageLimit: 100 * 1024 * 1024,
        message: 'Image deleted successfully',
      });

      expect(cloudinary.api.resource).toHaveBeenCalledWith('test-image-id');
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test-image-id');
    });

    test('should return 403 when user ID does not match', async () => {
      const response = await api
        .delete('/api/upload/differentUserId')
        .set('Authorization', `Bearer ${token}`)
        .send(deletePayload)
        .expect(403)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({ error: 'forbidden' });
    });

    test('should return 400 when publicId is missing', async () => {
      const response = await api
        .delete(`/api/upload/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        success: false,
        message: 'Public ID is required',
      });
    });

    test('should return 401 when no token is provided', async () => {
      const response = await api
        .delete(`/api/upload/${testUser.id}`)
        .send(deletePayload)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('token missing');
    });

    test('should return 500 when cloudinary deletion fails', async () => {
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'error' });

      const response = await api
        .delete(`/api/upload/${testUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(deletePayload)
        .expect(500)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        success: false,
        message: 'Failed to delete image from storage',
      });
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
