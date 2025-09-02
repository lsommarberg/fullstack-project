import { Box, Flex, VStack, Button, Link, Text } from '@chakra-ui/react';
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom';

/**
 * Sidebar layout component that provides a persistent side navigation for user dashboard pages.
 * Uses React Router's Outlet to render child routes while maintaining sidebar navigation state.
 * Includes navigation links for user patterns, projects, and account management.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.userId - The current user's ID for navigation routing
 * @returns {JSX.Element} Layout with sidebar navigation and outlet for child routes
 */
const SidebarLayout = ({ userId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Flex height="calc(100vh - 80px)" overflow="hidden">
      <Box
        width="200px"
        p={4}
        ml={4}
        borderRight="1px"
        borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
        overflowY="auto"
        flexShrink={0}
        style={{ overscrollBehavior: 'auto' }}
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
                color={isActive(`/patterns/${userId}`) ? 'blue.500' : 'text'}
                fontWeight={
                  isActive(`/patterns/${userId}`) ? 'medium' : 'normal'
                }
                _hover={{ color: 'blue.500' }}
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
                _hover={{ color: 'blue.500' }}
                data-testid="sidebar-create-pattern"
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
              <Link
                as={RouterLink}
                to={`/projects/${userId}`}
                fontWeight={
                  isActive(`/projects/${userId}`) ? 'medium' : 'normal'
                }
                justifyContent="flex-start"
                variant="ghost"
                size="sm"
                pl={0}
                color={isActive(`/projects/${userId}`) ? 'blue.500' : 'text'}
                fontSize="sm"
                _hover={{ color: 'blue.500' }}
              >
                My Projects
              </Link>
              <Button
                variant="ghost"
                size="sm"
                justifyContent="flex-start"
                pl={0}
                fontSize="sm"
                color="text"
                _hover={{ color: 'blue.500' }}
                onClick={() => navigate(`/projects/${userId}/create`)}
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
              <Link
                as={RouterLink}
                to={`/projects/${userId}/finished`}
                fontSize="sm"
                color="text"
                _hover={{ color: 'blue.500' }}
              >
                Finished Projects
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Box>

      <Box flex="1" p={4} overflow="auto">
        <Outlet />
      </Box>
    </Flex>
  );
};

export default SidebarLayout;
