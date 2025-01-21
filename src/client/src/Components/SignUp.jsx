import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import signupService from '../services/signup';
import { useState } from 'react';
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState(null);
  const onSubmit = async (data) => {
    try {
      await signupService.signup(data);
      navigate('/login');
    } catch (exception) {
      if (
        exception.response &&
        exception.response.data &&
        exception.response.data.error
      ) {
        setBackendError(exception.response.data.error);
      } else {
        setBackendError('An unexpected error occurred');
      }
      console.log('Error:', exception);
    }
  };

  return (
    <Box maxW="300px" mx="auto" mt="10">
      <Text fontSize="2xl" mb="4">
        Sign Up
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        {backendError && (
          <Text color="red.500" mb="4">
            {backendError}
          </Text>
        )}
        <FormControl id="username" isInvalid={errors.username} mb="4">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Username"
            {...register('username', { required: 'Username is required' })}
          />
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
            {...register('password', { required: 'Password is required' })}
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
            {...register('passwordConfirm', {
              required: 'Confirm Password is required',
            })}
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
