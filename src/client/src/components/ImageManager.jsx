import { Box, Text, Image, SimpleGrid, Button, VStack } from '@chakra-ui/react';
import { FileUpload } from '@chakra-ui/react';
import { HiUpload } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import useImageUpload from '../hooks/useImageManagement';
import userService from '../services/user';

const MAX_STORAGE_LIMIT = 100 * 1024 * 1024;

/**
 * Image management component that handles upload, display, and deletion of images.
 * Provides storage limit checking and accessibility features for image interactions.
 * Used across patterns, projects, and user profiles for image management.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.files - Array of image files to display
 * @param {string} props.headerText - Header text for the image section
 * @param {string} props.type - Type of images (pattern, project, user)
 * @param {boolean} props.showUpload - Whether to show upload functionality
 * @param {boolean} props.showDelete - Whether to show delete functionality
 * @param {Function} props.onImageUpload - Callback for image upload events
 * @param {Function} props.onImageDelete - Callback for image deletion events
 * @param {Function} props.onUploadError - Callback for upload error handling
 * @param {string} props.itemType - Type of item the images belong to
 * @param {string} props.buttonText - Text for the upload button
 * @param {string} props.buttonSize - Size of the upload button
 * @param {string} props.userId - ID of the user uploading images
 * @param {string} props.itemId - ID of the item the images belong to
 * @returns {JSX.Element} Image management interface with upload/delete controls
 */
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
      {showUpload && (
        <>
          {userStorageUsed && (
            <Text fontSize="sm" mb={4} color="fg.muted" fontWeight="medium">
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
              aria-label="Upload image file"
            >
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button
                  size={buttonSize}
                  isLoading={loading}
                  loadingText="Uploading..."
                  aria-label={buttonText}
                >
                  <HiUpload /> {buttonText}
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List aria-label="Uploaded image files list" />
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
                aria-label={`Image container for ${itemType} image ${
                  index + 1
                }`}
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
                      <Text color="fg.muted">Image not available</Text>
                    </Box>
                  }
                  _hover={{ transform: 'scale(1.05)', cursor: 'pointer' }}
                  transition="transform 0.2s"
                  onClick={() =>
                    window.open(file.url || file.secure_url, '_blank')
                  }
                  aria-label={`View ${itemType} image ${index + 1}`}
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
                    aria-label={`Delete ${itemType} image ${index + 1}`}
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
          <Text color="secondaryButtonText" fontSize="sm">
            No images uploaded yet.
          </Text>
        )
      )}
    </Box>
  );
};

export default ImageManager;
