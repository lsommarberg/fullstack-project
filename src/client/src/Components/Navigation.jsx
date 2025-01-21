import React from 'react';
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';

const Navigation = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <Box
      as="nav"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
      p={4}
      boxShadow="md"
    >
      <Flex align="center">
        <Button onClick={toggleColorMode} mr={4}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
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
