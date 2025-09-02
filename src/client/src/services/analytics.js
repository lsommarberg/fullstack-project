import axios from 'axios';
import getToken from '../utils/auth';
import API_BASE_URL from '../config/api';

const baseUrl = `${API_BASE_URL}/api/analytics`;

const getConfig = () => {
  const token = getToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getAnalytics = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`, getConfig());
  return response.data;
};

export default { getAnalytics };
