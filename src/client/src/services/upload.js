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

const uploadImage = async (userId, file, type) => {
  try {
    const config = getConfig();
    const formData = new FormData();
    formData.append('image', file);
    if (type) {
      formData.append('type', type);
    }

    const response = await axios.post(`${baseUrl}/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload image');
  }
};

const deleteImage = async (userId, publicId, type = null, itemId = null) => {
  try {
    const config = getConfig();
    const requestData = { publicId };

    if (type && itemId) {
      requestData.type = type;
      requestData.itemId = itemId;
    }

    const response = await axios.delete(`${baseUrl}/${userId}`, {
      ...config,
      data: requestData,
    });
    return response.data;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete image');
  }
};

export default { uploadImage, deleteImage };
