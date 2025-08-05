import { Box, Text, Image, SimpleGrid } from '@chakra-ui/react';

export const ImageDisplay = ({ files, headerText }) => {
  return (
    <Box mt={6}>
      <Text fontSize="lg" mb={4} fontWeight="semibold">
        {headerText}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {files.map((imageUrl, index) => (
          <Box key={index} borderRadius="md" overflow="hidden">
            <Image
              src={imageUrl}
              alt={`Pattern image ${index + 1}`}
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
              onClick={() => window.open(imageUrl, '_blank')}
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
