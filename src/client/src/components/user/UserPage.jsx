import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Box,
  Text,
  VStack,
  HStack,
  Tabs,
  Link,
} from '@chakra-ui/react';
import UserSettings from './UserSettings';
import UserAnalytics from '../analytics/UserAnalytics';
import SidebarLayout from '../layout/SidebarLayout';
import userService from '../../services/user';

const MAX_STORAGE_LIMIT = 100 * 1024 * 1024;

const UserPage = ({ user }) => {
  const { id } = useParams();
  const [fullUserData, setFullUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.token) return;

      try {
        const userData = await userService.getUser(id);
        setFullUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, user]);

  if (!user) {
    return <div>Please log in</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!fullUserData) {
    return <div>Error loading user data</div>;
  }

  const handleSave = async (updatedUser) => {
    try {
      const savedUser = await userService.updateUser(id, updatedUser);
      setFullUserData(savedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <SidebarLayout userId={user.id}>
      {fullUserData && isEditing ? (
        <UserSettings
          user={fullUserData}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Box
          p={8}
          shadow="lg"
          borderWidth="1px"
          borderRadius="xl"
          bg="card.bg"
          color="fg.default"
        >
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <Text fontSize="2xl" fontWeight="bold">
                {fullUserData.username}'s Dashboard
              </Text>
            </HStack>

            <Tabs.Root defaultValue="profile">
              <HStack justify="space-between" align="center" mb={4}>
                <Tabs.List>
                  <Tabs.Trigger value="profile" asChild>
                    <Link unstyled href="#profile">
                      Profile
                    </Link>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="analytics" asChild>
                    <Link unstyled href="#analytics">
                      Analytics
                    </Link>
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Context>
                  {(tabs) =>
                    tabs.value === 'profile' && (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )
                  }
                </Tabs.Context>
              </HStack>

              <Tabs.Content value="profile">
                <Box
                  p={6}
                  bg="section.bg"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="section.border"
                  shadow="sm"
                >
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="lg">
                      <Text as="span" fontWeight="semibold">
                        Username:
                      </Text>{' '}
                      {fullUserData.username}
                    </Text>
                    <Text fontSize="lg">
                      <Text as="span" fontWeight="semibold">
                        Storage Used:
                      </Text>{' '}
                      {Math.round(
                        (fullUserData.uploadStats / 1024 / 1024) * 100,
                      ) / 100}{' '}
                      MB / {Math.round(MAX_STORAGE_LIMIT / 1024 / 1024)} MB
                    </Text>
                    <Text fontSize="lg">
                      <Text as="span" fontWeight="semibold">
                        Patterns:
                      </Text>{' '}
                      {fullUserData.patterns.length}
                    </Text>
                    <Text fontSize="lg">
                      <Text as="span" fontWeight="semibold">
                        Projects:
                      </Text>{' '}
                      {fullUserData.projects.length}
                    </Text>
                  </VStack>
                </Box>
              </Tabs.Content>

              <Tabs.Content value="analytics">
                <UserAnalytics userId={id} />
              </Tabs.Content>
            </Tabs.Root>
          </VStack>
        </Box>
      )}
    </SidebarLayout>
  );
};

export default UserPage;
