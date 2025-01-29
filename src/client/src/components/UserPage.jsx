import React, { useState, useEffect } from 'react';
import userService from '../services/user';
import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const sections = [
    {
      title: 'Patterns',
      items: ['item1', 'item2', 'item3'],
    },
    {
      title: 'Progress',
      items: ['item1', 'item2', 'item3'],
    },
    {
      title: 'Finished projects',
      items: ['item1', 'item2', 'item3'],
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getUserById(id);
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl">User Page</Text>
      {user && <Text>Welcome: {user.username}</Text>}
    </Box>
  );
};

export default UserPage;
