import axios from 'axios';
import getToken from '../utils/auth';
import API_BASE_URL from '../config/api';

const baseUrl = `${API_BASE_URL}/api/users`;

const getConfig = () => {
  const token = getToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getUserStorage = async (userId) => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/storage/${userId}`, config);
  return response.data;
};

const getUser = async (userId) => {
  const config = getConfig();
  const response = await axios.get(`${baseUrl}/${userId}`, config);
  return response.data;
};

export default {
  getUserStorage,
  getUser,
};
