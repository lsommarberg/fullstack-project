import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';

const Navigation = ({ user }) => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <nav>
      <Box
        as="nav"
        bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
        p={4}
        boxShadow="md"
      >
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
        </Button>
        <Button onClick={() => navigate('/')}>Home</Button>
        {user ? (
          <>
            <Button onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </>
        )}
      </Box>
    </nav>
  );
};

export default Navigation;
