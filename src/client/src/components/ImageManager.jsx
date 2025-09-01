import { Box, Text, Image, SimpleGrid, Button, VStack } from '@chakra-ui/react';
import { FileUpload } from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import useImageUpload from '../hooks/useImageManagement';
import userService from '../services/user';

const MAX_STORAGE_LIMIT = 100 * 1024 * 1024;

const ImageManager = ({
  files = [],
  headerText = 'Images',
  type,
  showUpload = false,
  showDelete = false,
  onImageUpload,
  onImageDelete,
  onUploadError,
  itemType = 'pattern',
  buttonText = 'Upload Image',
  buttonSize = 'sm',
  userId,
  itemId,
}) => {
  const [deletingId, setDeletingId] = useState(null);
  const [localError, setLocalError] = useState(null);
  const { uploadImage, deleteImage, loading, error } = useImageUpload(
    userId,
    type,
  );
  const [userStorageUsed, setUserStorageUsed] = useState(0);

  useEffect(() => {
    const fetchUserStorage = async () => {
      try {
        const { storageUsed } = await userService.getUserStorage(userId);
        setUserStorageUsed(storageUsed);
      } catch (error) {
        console.error('Error fetching user storage:', error);
      }
    };

    fetchUserStorage();
  }, [userId, files]);

  const totalStorage = MAX_STORAGE_LIMIT;

  const displayError = error || localError;

  const handleFileChange = async (details) => {
    const fileList = details.acceptedFiles || details.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];

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
        if (onImageUpload) {
          onImageUpload(url, result);
        }
      });
    } catch (err) {
      if (onUploadError) {
        onUploadError(err.message || 'Upload failed');
      }
    }
  };

  const handleImageDelete = async (imageObj) => {
    if (!onImageDelete) return;

    const publicId = imageObj.publicId || imageObj.public_id;
    if (!publicId) return;

    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeletingId(publicId);

    try {
      await deleteImage(publicId, itemId || null, () => {
        if (onImageDelete) {
          onImageDelete(publicId);
        }
      });
    } catch (error) {
      console.error('Delete failed:', error);
      if (onUploadError) {
        onUploadError(error.message || 'Delete failed');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box mt={6}>
      <Text fontSize="lg" mb={4} fontWeight="semibold">
        {headerText}
      </Text>
      {showUpload && (
        <>
          {userStorageUsed && (
            <Text fontSize="sm" mb={4} color="blue.600" fontWeight="medium">
              Storage used:{' '}
              {((userStorageUsed / totalStorage) * 100).toFixed(2)}% (
              {(userStorageUsed / (1024 * 1024)).toFixed(2)} MB of{' '}
              {(totalStorage / (1024 * 1024)).toFixed(2)} MB)
            </Text>
          )}
          <VStack spacing={4} align="start" mb={6}>
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

            {displayError && (
              <Text color="red.500" fontSize="sm">
                {displayError}
              </Text>
            )}
          </VStack>
        </>
      )}

      {files && files.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {files.map((file, index) => {
            const publicId = file.publicId || file.public_id;
            return (
              <Box
                key={publicId || index}
                position="relative"
                borderRadius="md"
                overflow="hidden"
                p={2}
              >
                <Image
                  src={file.url || file.secure_url}
                  alt={`${itemType} image ${index + 1}`}
                  objectFit="cover"
                  w="100%"
                  h="200px"
                  fallback={
                    <Box
                      w="100%"
                      h="200px"
                      bg="gray.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color="gray.500">Image not available</Text>
                    </Box>
                  }
                  _hover={{ transform: 'scale(1.05)', cursor: 'pointer' }}
                  transition="transform 0.2s"
                  onClick={() =>
                    window.open(file.url || file.secure_url, '_blank')
                  }
                />

                {showDelete && publicId && (
                  <Button
                    position="absolute"
                    top="8px"
                    right="8px"
                    size="sm"
                    variant="solid"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageDelete(file);
                    }}
                    isLoading={deletingId === publicId}
                    loadingText="Deleting..."
                    zIndex={1}
                  >
                    ✕
                  </Button>
                )}
              </Box>
            );
          })}
        </SimpleGrid>
      ) : (
        showUpload && (
          <Text color="gray.500" fontSize="sm">
            No images uploaded yet.
          </Text>
        )
      )}
    </Box>
  );
};

export default ImageManager;
