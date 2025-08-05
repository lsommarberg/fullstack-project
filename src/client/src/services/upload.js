import axios from 'axios';
import API_BASE_URL from '../config/api';

const baseUrl = `${API_BASE_URL}/api/upload`;

export const uploadImage = async (file, type = 'general') => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const response = await axios.post(baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

export default { uploadImage };
