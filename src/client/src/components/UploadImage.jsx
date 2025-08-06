import { useState } from 'react';
import { Button, FileUpload, Text, VStack, Box, Image } from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import useImageUpload from '../hooks/useImageManagement';

const UploadImage = ({
  type,
  onUploadSuccess,
  onUploadError,
  showPreview = true,
  buttonText = 'Upload Image',
  buttonSize = 'sm',
}) => {
  const [uploadResult, setUploadResult] = useState(null);
  const [localError, setLocalError] = useState(null);
  const { uploadImage, deleteImage, loading, error } = useImageUpload(type);

  // Combine hook error with local error
  const displayError = error || localError;

  const handleFileChange = async (details) => {
    const files = details.acceptedFiles || details.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setLocalError('Please select an image file');
      if (onUploadError) {
        onUploadError('Please select an image file');
      }
      return;
    }

    setLocalError(null);

    try {
      await uploadImage(file, (url, result) => {
        setUploadResult(result);
        if (onUploadSuccess) {
          onUploadSuccess(url, result);
        }
      });
    } catch (err) {
      if (onUploadError) {
        onUploadError(err.message || 'Upload failed');
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!uploadResult || !uploadResult.publicId) return;

    if (!window.confirm('Are you sure you want to remove this image?')) {
      return;
    }

    try {
      await deleteImage(uploadResult.publicId, () => {
        setUploadResult(null);
        if (onUploadSuccess) {
          onUploadSuccess(null, null);
        }
      });
    } catch (err) {
      if (onUploadError) {
        onUploadError(err.message || 'Delete failed');
      }
    }
  };

  return (
    <VStack spacing={4} align="start">
      {!uploadResult && (
        <FileUpload.Root
          accept="image/*"
          maxFiles={1}
          onFileChange={handleFileChange}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Trigger asChild>
            <Button
              size={buttonSize}
              isLoading={loading}
              loadingText="Uploading..."
            >
              <HiUpload /> {buttonText}
            </Button>
          </FileUpload.Trigger>
          <FileUpload.List />
        </FileUpload.Root>
      )}

      {displayError && (
        <Text color="red.500" fontSize="sm">
          {displayError}
        </Text>
      )}

      {uploadResult && showPreview && (
        <VStack align="start" spacing={3}>
          <Text color="green.500" fontSize="sm">
            Upload successful!
          </Text>

          <Box position="relative" borderRadius="md" overflow="hidden">
            <Image
              src={uploadResult.url || uploadResult.secure_url}
              alt="Uploaded"
              maxWidth="200px"
              maxHeight="200px"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>

          <Button
            size="sm"
            onClick={handleRemoveImage}
            isLoading={loading}
            loadingText="Removing..."
          >
            Remove Image
          </Button>

          <Text fontSize="xs" color="gray.600">
            URL: {uploadResult.url || uploadResult.secure_url}
          </Text>
        </VStack>
      )}
    </VStack>
  );
};

export default UploadImage;
