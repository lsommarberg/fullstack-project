import React from 'react';
import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ user, setUser }) => {
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate('/');
  };

  return (
    <Box
      as="nav"
      variant="brand-secondary"
      borderWidth="1px"
      p={4}
      boxShadow="md"
    >
      <Flex align="center">
        <Button onClick={() => navigate('/')} mr={4}>
          Home
        </Button>
        <Spacer />
        {user ? (
          <Button onClick={logout} colorScheme="teal">
            Logout
          </Button>
        ) : (
          <>
            <Button onClick={() => navigate('/login')} mr={4}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')} colorScheme="teal">
              Sign Up
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Navigation;
