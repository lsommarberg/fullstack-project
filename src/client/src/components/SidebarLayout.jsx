import { Box, Flex, VStack, Button, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

const SidebarLayout = ({ children, userId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Flex height="100vh">
      <Box
        width="250px"
        p={4}
        ml={4}
        borderRight="1px"
        borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
      >
        <VStack align="start" spacing={6}>
          <Box width="100%">
            <Text
              fontWeight="semibold"
              mb={3}
              fontSize="sm"
              color={{ base: 'gray.600', _dark: 'gray.300' }}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Patterns
            </Text>
            <VStack align="start" spacing={2} pl={2}>
              <Link
                as={RouterLink}
                to={`/patterns/${userId}`}
                color={isActive(`/patterns/${userId}`) ? 'linkText' : 'text'}
                fontWeight={
                  isActive(`/patterns/${userId}`) ? 'medium' : 'normal'
                }
                _hover={{ color: 'linkText' }}
                fontSize="sm"
              >
                My Patterns
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/patterns/${userId}/create`)}
                justifyContent="flex-start"
                pl={0}
                fontSize="sm"
                color="text"
                _hover={{ color: 'linkText', bg: 'secondaryBox' }}
              >
                Create Pattern
              </Button>
            </VStack>
          </Box>

          <Box width="100%">
            <Text
              fontWeight="semibold"
              mb={3}
              fontSize="sm"
              color={{ base: 'gray.600', _dark: 'gray.300' }}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Projects
            </Text>
            <VStack align="start" spacing={2} pl={2}>
              <Link fontSize="sm" color="text" _hover={{ color: 'linkText' }}>
                My Projects
              </Link>
              <Button
                variant="ghost"
                size="sm"
                justifyContent="flex-start"
                pl={0}
                fontSize="sm"
                color="text"
                _hover={{ color: 'linkText', bg: 'secondaryBox' }}
              >
                Start New
              </Button>
            </VStack>
          </Box>

          <Box width="100%">
            <Text
              fontWeight="semibold"
              mb={3}
              fontSize="sm"
              color={{ base: 'gray.600', _dark: 'gray.300' }}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Archive
            </Text>
            <VStack align="start" spacing={2} pl={2}>
              <Link fontSize="sm" color="text" _hover={{ color: 'linkText' }}>
                Finished Projects
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Box>

      <Box flex="1" p={4} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
};

export default SidebarLayout;
