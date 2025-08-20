import axios from 'axios';
import getToken from '../utils/auth';
import API_BASE_URL from '../config/api';

const baseUrl = `${API_BASE_URL}/api/patterns`;

const getConfig = () => {
  const token = getToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getPatterns = async (userId) => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/${userId}`, config);
  return response.data;
};

const getPatternById = async (userId, patternId) => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/${userId}/${patternId}`, config);
  return response.data;
};

const createPattern = async (newPattern) => {
  const config = getConfig();
  const response = await axios.post(baseUrl, newPattern, config);
  return response.data;
};

const deletePattern = async (userId, patternId) => {
  const config = getConfig();
  const response = await axios.delete(
    `${baseUrl}/${userId}/${patternId}`,
    config,
  );
  return response.data;
};

const updatePattern = async (userId, patternId, updatedPattern) => {
  const config = getConfig();
  const response = await axios.put(
    `${baseUrl}/${userId}/${patternId}`,
    updatedPattern,
    config,
  );
  return response.data;
};

const searchPatterns = async (query) => {
  const config = getConfig();
  const params = new URLSearchParams({ q: query });
  const response = await axios.get(
    `${baseUrl}/search?${params.toString()}`,
    config,
  );
  return response.data;
};

export default {
  getPatterns,
  getPatternById,
  createPattern,
  deletePattern,
  updatePattern,
  searchPatterns,
};
