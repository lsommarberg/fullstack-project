import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/login';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginService.login({ username, password });
      navigate('/');
    } catch (exception) {
      if (
        exception.response &&
        exception.response.data &&
        exception.response.data.error
      ) {
        setError(exception.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
      setTimeout(() => {
        setError(null);
      }, 5000);
      console.log('Error:', exception);
    }
  };

  return (
    <Box maxW="300px" mx="auto" mt="10">
      <Text fontSize="2xl" mb="4">
        Login
      </Text>
      {error && (
        <Text color="red.500" mb="4">
          {error}
        </Text>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl id="username" isInvalid={!!error} mb="4">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            tabIndex="1"
          />
        </FormControl>
        <FormControl id="password" isInvalid={!!error} mb="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            tabIndex="2"
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
