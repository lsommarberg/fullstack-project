import { Box, Text } from '@chakra-ui/react';

const UserPage = ({ user }) => {
  return (
    <Box p={4}>
      <Text fontSize="2xl">User Page</Text>
      {user && <Text>Welcome: {user.username}</Text>}
    </Box>
  );
};

export default UserPage;
