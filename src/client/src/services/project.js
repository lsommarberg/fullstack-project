import axios from 'axios';
import getToken from '../utils/auth';
import API_BASE_URL from '../config/api';

const baseUrl = `${API_BASE_URL}/api/projects`;

const getConfig = () => {
  const token = getToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getProjects = async (userId) => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/${userId}`, config);
  return response.data;
};

const getProjectById = async (userId, projectId) => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/${userId}/${projectId}`, config);
  return response.data;
};

const createProject = async (newProject) => {
  const config = getConfig();
  const response = await axios.post(baseUrl, newProject, config);
  return response.data;
};

const deleteProject = async (userId, projectId) => {
  const config = getConfig();
  const response = await axios.delete(
    `${baseUrl}/${userId}/${projectId}`,
    config,
  );
  return response.data;
};

const updateProject = async (userId, projectId, updatedProject) => {
  const config = getConfig();
  const response = await axios.put(
    `${baseUrl}/${userId}/${projectId}`,
    updatedProject,
    config,
  );
  return response.data;
};

export default {
  getProjects,
  getProjectById,
  createProject,
  deleteProject,
  updateProject,
};
