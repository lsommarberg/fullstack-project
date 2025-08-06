import { useState } from 'react';
import uploadService from '../services/upload';

const useImageUpload = (type) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadService.uploadImage(file, type);

      if (!result) throw new Error('Upload failed');

      if (onSuccess) {
        const url = result.url || result.secure_url;
        onSuccess(url, result);
      }

      return result;
    } catch (err) {
      console.error(err);
      setError('Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (publicId, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadService.deleteImage(publicId);

      if (!result || result.error) {
        const errMsg = result?.error || 'Delete failed';
        throw new Error(errMsg);
      }

      if (onSuccess) {
        onSuccess();
      }

      return result;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, deleteImage, loading, error };
};

export default useImageUpload;
