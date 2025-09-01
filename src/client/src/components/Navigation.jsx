import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';

import { Outlet, Link as RouterLink } from 'react-router-dom';

/**
 * Main navigation component that provides persistent navigation bar and user authentication controls.
 * Uses React Router's Outlet pattern to render child routes while maintaining navigation state.
 * Displays different navigation options based on user authentication status.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object|null} props.user - Current authenticated user object, null if not logged in
 * @param {Function} props.setUser - Function to update user state (for logout functionality)
 * @returns {JSX.Element} Navigation bar with outlet for child routes
 */
const Navigation = ({ user, setUser }) => {
  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <>
      <Box
        as="nav"
        p={4}
        boxShadow="md"
        bg="nav.bg"
        color="fg.default"
        position="sticky"
        top={0}
        zIndex={1000}
      >
        <Flex align="center">
          <Button
            as={RouterLink}
            to="/"
            variant="primary"
            mr={4}
            aria-label="Home"
          >
            Home
          </Button>
          <ColorModeButton bg="input.bg" color="fg.default" />

          <Spacer />
          {user ? (
            <Button
              as={RouterLink}
              to="/"
              onClick={logout}
              variant="cancel"
              aria-label="Logout"
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                mr={4}
                variant="primary"
                aria-label="Login"
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                variant="secondary"
                aria-label="Sign Up"
                data-testid="nav-signup"
              >
                Sign Up
              </Button>
            </>
          )}
        </Flex>
      </Box>
      <Outlet />
    </>
  );
};

export default Navigation;
