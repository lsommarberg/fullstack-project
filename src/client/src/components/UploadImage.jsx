import { useState } from 'react';
import { Button, FileUpload, Text, VStack } from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import { uploadImage } from '../services/upload';

const UploadImage = ({
  type = 'patterns',
  onUploadSuccess,
  onUploadError,
  showPreview = true,
  buttonText = 'Upload Image',
  buttonSize = 'sm',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (details) => {
    console.log('handleFileChange called with details:', details);

    const files = details.acceptedFiles || details.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    console.log('Selected file:', file);

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const result = await uploadImage(file, type);

      setUploadResult(result);

      if (onUploadSuccess) {
        onUploadSuccess(result.url || result.secure_url, result);
      }
    } catch (err) {
      setError(err.message);
      console.error('Upload failed:', err);

      if (onUploadError) {
        onUploadError(err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <VStack spacing={4} align="start">
      <FileUpload.Root
        accept="image/*"
        maxFiles={1}
        onFileChange={handleFileChange}
      >
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button
            variant="outline"
            size={buttonSize}
            isLoading={uploading}
            loadingText="Uploading..."
          >
            <HiUpload /> {buttonText}
          </Button>
        </FileUpload.Trigger>
        <FileUpload.List />
      </FileUpload.Root>

      {error && (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      )}

      {uploadResult && showPreview && (
        <VStack align="start" spacing={2}>
          <Text color="green.500" fontSize="sm">
            Upload successful!
          </Text>
          <Text fontSize="xs" color="gray.600">
            URL: {uploadResult.url || uploadResult.secure_url}
          </Text>
          {uploadResult.url && (
            <img
              src={uploadResult.url || uploadResult.secure_url}
              alt="Uploaded"
              style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default UploadImage;
