import { Box, Flex, Button, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ColorModeButton } from '@/components/ui/color-mode';

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
      p={4}
      boxShadow="md"
      bg="nav.bg"
      color="fg.default"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex align="center">
        <Button variant="primary" onClick={() => navigate('/')} mr={4}>
          Home
        </Button>
        <ColorModeButton bg="input.bg" color="fg.default" />

        <Spacer />
        {user ? (
          <Button onClick={logout} variant="cancel">
            Logout
          </Button>
        ) : (
          <>
            <Button onClick={() => navigate('/login')} mr={4} variant="primary">
              Login
            </Button>
            <Button onClick={() => navigate('/signup')} variant="secondary">
              Sign Up
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Navigation;
