import axios from 'axios';
import API_BASE_URL from '../config/api';
import getToken from '../utils/auth';

const baseUrl = `${API_BASE_URL}/api/upload`;

const getConfig = () => {
  const token = getToken();
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const uploadImage = async (file, type = 'general') => {
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

const deleteImage = async (publicId) => {
  try {
    const response = await axios.delete(baseUrl, {
      ...getConfig(),
      data: { publicId },
    });
    return response.data;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete image');
  }
};

export default { uploadImage, deleteImage };
