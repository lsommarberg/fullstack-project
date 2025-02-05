import React from 'react';
import { Text } from '@chakra-ui/react';
import SidebarLayout from './SidebarLayout';

const UserPage = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <SidebarLayout userId={user.id}>
      <Text fontSize="2xl" mb={4}>
        User Page
      </Text>
      {user && <Text>Welcome: {user.username}</Text>}
    </SidebarLayout>
  );
};

export default UserPage;
