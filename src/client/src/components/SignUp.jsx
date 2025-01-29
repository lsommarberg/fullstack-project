import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import signupService from '../services/signup';

import { Button, Fieldset, Input, Stack, Text } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset.Root
        size="lg"
        maxW="sm"
        mx="auto"
        mt={10}
        p={6}
        borderRadius="md"
        shadow="md"
      >
        <Stack>
          <Fieldset.Legend>Sign Up</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <Field label="Username" error={errors.username?.message}>
            <Input
              name="username"
              placeholder="Username"
              {...register('username')}
            />
          </Field>

          <Field label="Password" error={errors.password?.message}>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              {...register('password')}
            />
          </Field>

          <Field
            label="Confirm Password"
            error={errors.passwordConfirm?.message}
          >
            <Input
              name="passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              {...register('passwordConfirm')}
            />
          </Field>
        </Fieldset.Content>

        <Button type="submit" colorScheme="teal" width="full">
          Sign Up
        </Button>
      </Fieldset.Root>
    </form>
  );
};

export default SignupForm;
