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
import { useState } from 'react';
import { toaster } from '../ui/toaster';

const UserSettings = ({ user, onSave, onCancel }) => {
  const [username, setUsername] = useState(user.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toaster.error({
        description: 'Username is required',
        duration: 3000,
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toaster.error({
        description: 'New passwords do not match',
        duration: 3000,
      });
      return;
    }

    if (newPassword && !currentPassword) {
      toaster.error({
        description: 'Current password is required to set a new password',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const updatedData = {
        username: username.trim(),
      };

      if (newPassword) {
        updatedData.currentPassword = currentPassword;
        updatedData.newPassword = newPassword;
      }

      await onSave(updatedData);

      toaster.success({
        description: 'Profile updated successfully',
        duration: 3000,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toaster.error({
        description: error.message || 'Failed to update profile',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
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
      <form onSubmit={handleSave}>
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
                <Field label="Username" required>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                  />
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

                <Field label="Current Password">
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                  />
                </Field>

                <Field label="New Password">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                  />
                </Field>

                <Field label="Confirm New Password">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                  />
                </Field>
              </VStack>
            </Box>

            <HStack mt={8} spacing={4} justify="center">
              <Button
                type="submit"
                size="lg"
                colorScheme="blue"
                px={8}
                py={6}
                fontSize="md"
                fontWeight="semibold"
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
              <Button
                onClick={onCancel}
                size="lg"
                px={8}
                py={6}
                fontSize="md"
                bg="cancelButton"
                disabled={isLoading}
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
