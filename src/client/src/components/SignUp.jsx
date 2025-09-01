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

/**
 * User registration component that handles new account creation with form validation.
 * Uses react-hook-form with Yup validation for password strength and confirmation matching.
 * Redirects to login page after successful registration.
 *
 * @component
 * @returns {JSX.Element} Registration form with username, password, and confirmation fields
 */
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
        borderWidth={1}
        borderColor="card.border"
        shadow="md"
        bg="card.bg"
        color="fg.default"
      >
        <Stack>
          <Fieldset.Legend>Sign Up</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <Field label="Username" invalid={!!errors.username}>
            <Input
              name="username"
              placeholder="Username"
              data-testid="username_signup"
              {...register('username')}
              variant="input"
            />
            {errors.username && (
              <Text color="red.500">{errors.username.message}</Text>
            )}
          </Field>

          <Field label="Password" invalid={!!errors.password}>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              data-testid="password_signup"
              {...register('password')}
              variant="input"
            />
            {errors.password && (
              <Text color="red.500">{errors.password.message}</Text>
            )}
          </Field>

          <Field label="Confirm Password" invalid={!!errors.passwordConfirm}>
            <Input
              name="passwordConfirm"
              type="password"
              data-testid="password_signup_confirmation"
              placeholder="Confirm Password"
              {...register('passwordConfirm')}
              variant="input"
            />
            {errors.passwordConfirm && (
              <Text color="red.500">{errors.passwordConfirm.message}</Text>
            )}
          </Field>
        </Fieldset.Content>

        <Button
          type="submit"
          data-testid="signup_submit"
          width="full"
          variant="primary"
          aria-label="Sign up for a new account"
        >
          Sign Up
        </Button>
      </Fieldset.Root>
    </form>
  );
};

export default SignupForm;
