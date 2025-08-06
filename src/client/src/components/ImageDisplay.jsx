import { Box, Text, Image, SimpleGrid, Button } from '@chakra-ui/react';
import { useState } from 'react';

const ImageDisplay = ({
  files,
  headerText,
  showDeleteButton = true,
  onImageDelete,
  itemType = 'pattern',
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleImageDelete = async (imageObj) => {
    if (!onImageDelete) return;

    setDeletingId(imageObj.publicId);

    try {
      await onImageDelete(imageObj.publicId);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box mt={6}>
      <Text fontSize="lg" mb={4} fontWeight="semibold">
        {headerText}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {files.map((file, index) => (
          <Box
            key={file.publicId || index}
            position="relative"
            borderRadius="md"
            overflow="hidden"
          >
            <Image
              src={file.url}
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
              onClick={() => window.open(file.url, '_blank')}
            />

            {/* Delete button */}
            {showDeleteButton && (
              <Button
                position="absolute"
                top="8px"
                right="8px"
                size="sm"
                colorScheme="red"
                variant="solid"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening image when clicking delete
                  handleImageDelete(file);
                }}
                isLoading={deletingId === file.publicId}
                loadingText="Deleting..."
                zIndex={1}
              >
                ✕
              </Button>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ImageDisplay;
