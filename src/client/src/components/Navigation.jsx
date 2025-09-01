import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { ColorModeButton } from '@/components/ui/color-mode';

import { Outlet, Link as RouterLink } from 'react-router-dom';

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
