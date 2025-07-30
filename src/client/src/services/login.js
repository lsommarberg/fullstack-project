import axios from 'axios';
import API_BASE_URL from '../config/api';

const baseUrl = `${API_BASE_URL}/api/login`;

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
