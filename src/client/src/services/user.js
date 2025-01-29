import axios from 'axios';
import getToken from '../utils/auth';

const baseUrl = '/api/users';

const getUserById = async (id) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getUserById };
