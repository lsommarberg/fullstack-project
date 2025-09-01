import {
  Box,
  Button,
  Fieldset,
  Input,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toaster } from '../ui/toaster';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  currentPassword: Yup.string(),
  newPassword: Yup.string(),
  confirmPassword: Yup.string(),
});

const UserSettings = ({ user, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: user?.username || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setError();

      if (data.newPassword && data.newPassword.length > 0) {
        if (!data.currentPassword) {
          setError('currentPassword', {
            type: 'manual',
            message: 'Current password is required to set a new password',
          });
          return;
        }
        if (data.newPassword.length < 6) {
          setError('newPassword', {
            type: 'manual',
            message: 'Password must be at least 6 characters',
          });
          return;
        }
        if (!data.confirmPassword) {
          setError('confirmPassword', {
            type: 'manual',
            message: 'Please confirm your new password',
          });
          return;
        }
        if (data.newPassword !== data.confirmPassword) {
          setError('confirmPassword', {
            type: 'manual',
            message: 'Passwords do not match',
          });
          return;
        }
      }

      const updatedData = {
        username: data.username.trim(),
      };

      if (data.newPassword) {
        updatedData.currentPassword = data.currentPassword;
        updatedData.newPassword = data.newPassword;
      }

      await onSave(updatedData);

      toaster.success({
        description: 'Profile updated successfully',
        duration: 3000,
      });

      reset({
        username: data.username,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      if (
        error.message?.includes('username') ||
        error.message?.includes('unique')
      ) {
        setError('username', {
          type: 'manual',
          message: 'Username is already taken',
        });
      } else if (error.message?.includes('password')) {
        setError('currentPassword', {
          type: 'manual',
          message: 'Current password is incorrect',
        });
      } else {
        toaster.error({
          description: error.message || 'Failed to update profile',
          duration: 3000,
        });
      }
    }
  };

  return (
    <Box
      p={8}
      shadow="lg"
      borderWidth="1px"
      borderRadius="xl"
      bg="card.bg"
      color="fg.default"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center" mb={2}>
              <Fieldset.Legend
                fontSize="2xl"
                fontWeight="bold"
                color="fg.default"
              >
                Edit Profile
              </Fieldset.Legend>
              <Fieldset.HelperText fontSize="md" color="fg.muted" mt={2}>
                Update your username and password settings
              </Fieldset.HelperText>
            </Box>

            <Box
              p={6}
              bg="section.bg"
              borderRadius="lg"
              border="1px solid"
              borderColor="section.border"
              shadow="sm"
            >
              <VStack spacing={4} align="stretch">
                <Field label="Username" required invalid={!!errors.username}>
                  <Input
                    data-testid="username-input"
                    placeholder="Enter your username"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                    {...register('username')}
                  />
                  {errors.username && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.username.message}
                    </Text>
                  )}
                </Field>
              </VStack>
            </Box>

            <Box
              p={6}
              bg="section.bg"
              borderRadius="lg"
              border="1px solid"
              borderColor="section.border"
              shadow="sm"
            >
              <VStack spacing={4} align="stretch">
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  color="fg.default"
                  mb={2}
                >
                  Change Password (Optional)
                </Text>

                <Field
                  label="Current Password"
                  invalid={!!errors.currentPassword}
                >
                  <Input
                    type="password"
                    data-testid="current-password-input"
                    placeholder="Enter your current password"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                    {...register('currentPassword')}
                  />
                  {errors.currentPassword && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.currentPassword.message}
                    </Text>
                  )}
                </Field>

                <Field label="New Password" invalid={!!errors.newPassword}>
                  <Input
                    type="password"
                    data-testid="new-password-input"
                    placeholder="Enter new password"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                    {...register('newPassword')}
                  />
                  {errors.newPassword && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.newPassword.message}
                    </Text>
                  )}
                </Field>

                <Field
                  label="Confirm New Password"
                  invalid={!!errors.confirmPassword}
                >
                  <Input
                    type="password"
                    data-testid="confirm-password-input"
                    placeholder="Confirm new password"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </Field>
              </VStack>
            </Box>

            <HStack mt={8} spacing={4} justify="center">
              <Button
                type="submit"
                data-testid="save-button"
                variant="primary"
                isLoading={isSubmitting}
                loadingText="Saving..."
                aria-label="Save profile changes"
              >
                Save Changes
              </Button>
              <Button
                onClick={onCancel}
                data-testid="cancel-button"
                variant="cancel"
                disabled={isSubmitting}
                aria-label="Cancel profile editing"
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Fieldset.Root>
      </form>
    </Box>
  );
};

export default UserSettings;
