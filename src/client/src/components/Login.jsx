import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginService from '../services/login';
import { Button, Fieldset, Input, Stack, Text } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      const expirationTime = new Date().getTime() + 3600000;
      const userWithExpiration = { user, expirationTime };
      window.localStorage.setItem('user', JSON.stringify(userWithExpiration));
      setUser(user);
      navigate('/');
    } catch (exception) {
      handleLoginError(exception);
    }
  };

  const handleLoginError = (exception) => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { username, password };
    handleLogin(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      {' '}
      <Fieldset.Root
        size="lg"
        maxW="sm"
        mx="auto"
        mt={10}
        p={6}
        borderRadius="md"
        borderWidth={1}
        borderColor="card.border"
        shadow="md"
        bg="card.bg"
        color="fg.default"
      >
        <Stack>
          <Fieldset.Legend>Login</Fieldset.Legend>
          {error && <Text color="red.500">{error}</Text>}
        </Stack>

        <Fieldset.Content>
          <Field label="Username">
            <Input
              name="username"
              data-testid="username_login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              borderColor="input.border"
              bg="input.bg"
              color="fg.default"
            />
          </Field>

          <Field label="Password">
            <Input
              name="password"
              type="password"
              data-testid="password_login"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              borderColor="input.border"
              bg="input.bg"
              color="fg.default"
            />
          </Field>
        </Fieldset.Content>

        <Button type="submit" width="full">
          Login
        </Button>
      </Fieldset.Root>
    </form>
  );
};

export default Login;
