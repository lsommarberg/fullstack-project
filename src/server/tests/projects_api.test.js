const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Pattern = require('../models/pattern');
const Project = require('../models/project');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

let token;
let userId;
let patternId;
let anotherUserId;
let anotherUserToken;
let projectId;

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

  const anotherPasswordHash = await bcrypt.hash('password', 10);
  const anotherUser = new User({
    username: 'anotheruser',
    passwordHash: anotherPasswordHash,
  });
  const savedAnotherUser = await anotherUser.save();
  anotherUserId = savedAnotherUser._id;

  const anotherUserResponse = await api
    .post('/api/login')
    .send({ username: 'anotheruser', password: 'password' });

  anotherUserToken = anotherUserResponse.body.token;

  const newPattern = new Pattern({
    name: 'Basic Knit Scarf',
    text: 'This is a simple knitting pattern for beginners.',
    link: 'https://example.com/basic-knit-scarf-pattern',
    tags: ['knitting', 'scarf', 'beginner', 'simple'],
    notes: 'This pattern is great for beginners.',
    user: userId,
  });

  const savedPattern = await newPattern.save();
  patternId = savedPattern._id;

  const newProject = new Project({
    name: 'My First Project',
    pattern: patternId,
    notes: 'Working on my first project using this pattern.',
    user: userId,
  });

  const savedProject = await newProject.save();
  projectId = savedProject._id;
});

describe('Project API', () => {
  test('should create a new project', async () => {
    const newProject = {
      name: 'My Knitting Project',
      pattern: patternId,
      notes: 'Starting my first scarf project with this pattern.',
    };

    const response = await api
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(newProject)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe(newProject.name);
    expect(response.body.pattern.toString()).toBe(patternId.toString());
    expect(response.body.notes).toBe(newProject.notes);
  });

  test('should return 401 Unauthorized for creating a project without token', async () => {
    const newProject = {
      name: 'Unauthorized Project',
      pattern: patternId,
      notes: 'This project should not be created without a token.',
    };
    const response = await api
      .post('/api/projects')
      .send(newProject)
      .expect(401)
      .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('token missing');
  });

  test('should return 400 Bad Request for creating a project without required fields', async () => {
    const newProject = {
      pattern: patternId,
      notes: 'This project is missing a name.',
    };
    const response = await api
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(newProject)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe(
      'Project validation failed: name: Path `name` is required.',
    );
  });

  test('should get all projects for a user', async () => {
    const response = await api
      .get(`/api/projects/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe('My First Project');
    expect(response.body[1].name).toBe('My Knitting Project');
  });

  test('should return 403 Forbidden for getting projects of another user', async () => {
    const response = await api
      .get(`/api/projects/${anotherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  test('should get a specific project for the authenticated user', async () => {
    const response = await api
      .get(`/api/projects/${userId}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe('My First Project');
  });

  test('should return 403 Forbidden for getting a specific project of another user', async () => {
    const response = await api
      .get(`/api/projects/${anotherUserId}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  test('should update a specific project for the authenticated user', async () => {
    const updatedProject = {
      name: 'Updated Project Name',
      notes: 'Updated notes for the project.',
    };

    const response = await api
      .put(`/api/projects/${userId}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProject)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.name).toBe(updatedProject.name);
    expect(response.body.notes).toBe(updatedProject.notes);
  });

  test('should return 403 Forbidden for updating a specific project of another user', async () => {
    const updatedProject = {
      name: 'Updated Project Name',
    };

    const response = await api
      .put(`/api/projects/${anotherUserId}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProject)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  test('should return 404 Not Found for updating a non-existing project', async () => {
    const nonExistingProjectId = new mongoose.Types.ObjectId();
    const updatedProject = {
      name: 'Updated Project Name',
    };
    const response = await api
      .put(`/api/projects/${userId}/${nonExistingProjectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProject)
      .expect(404)
      .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('project not found');
  });

  test('should delete a specific project for the authenticated user', async () => {
    const response = await api
      .delete(`/api/projects/${userId}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    expect(response.body).toEqual({});
  });

  test('should return 403 Forbidden for deleting a specific project of another user', async () => {
    const response = await api
      .delete(`/api/projects/${anotherUserId}/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('forbidden');
  });

  test('should return 404 Not Found for deleting a non-existing project', async () => {
    const nonExistingProjectId = new mongoose.Types.ObjectId();

    const response = await api
      .delete(`/api/projects/${userId}/${nonExistingProjectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('project not found');
  });

  test('should return 404 Not Found for getting a non-existing project', async () => {
    const nonExistingProjectId = new mongoose.Types.ObjectId();

    const response = await api
      .get(`/api/projects/${userId}/${nonExistingProjectId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('project not found');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
