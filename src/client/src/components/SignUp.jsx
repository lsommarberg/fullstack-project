import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import signupService from '../services/signup';

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  passwordConfirm: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate();

  const handleSignupError = (exception) => {
    if (
      exception.response &&
      exception.response.data &&
      exception.response.data.error
    ) {
      const errorMessage = exception.response.data.error;
      if (errorMessage.includes('unique')) {
        setError('username', {
          type: 'manual',
          message: 'Username must be unique',
        });
      }
    }
    console.log('Error:', exception);
  };

  const onSubmit = async (data) => {
    try {
      await signupService.signup(data);
      navigate('/login');
    } catch (exception) {
      handleSignupError(exception);
    }
  };

  return (
    <Box maxW="300px" mx="auto" mt="10">
      <Text fontSize="2xl" mb="4">
        Sign Up
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="username" isInvalid={errors.username} mb="4">
          <FormLabel>Username</FormLabel>
          <Input type="text" placeholder="Username" {...register('username')} />
          {errors.username && (
            <Text color="red.500" mt="1">
              {errors.username.message}
            </Text>
          )}
        </FormControl>
        <FormControl id="password" isInvalid={errors.password} mb="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <Text color="red.500" mt="1">
              {errors.password.message}
            </Text>
          )}
        </FormControl>
        <FormControl
          id="passwordConfirm"
          isInvalid={errors.passwordConfirm}
          mb="4"
        >
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register('passwordConfirm')}
          />
          {errors.passwordConfirm && (
            <Text color="red.500" mt="1">
              {errors.passwordConfirm.message}
            </Text>
          )}
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          Sign Up
        </Button>
      </form>
    </Box>
  );
};

export default SignupForm;
