import axios from 'axios';
import getToken from '../utils/auth';

const baseUrl = '/api/analytics';

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
