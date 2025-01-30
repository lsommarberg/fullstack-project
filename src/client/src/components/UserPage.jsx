import React, { useEffect } from 'react';
import { Box, Text, Flex, Button, Link, VStack } from '@chakra-ui/react';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const UserPage = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Flex height="100vh">
      <Box width="250px" bg="gray.800" color="white" p={4}>
        <AccordionRoot type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                Patterns
              </Box>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <VStack align="start" spacing={4}>
                <Link>My Patterns</Link>
                <Button>Create Pattern</Button>
              </VStack>
            </AccordionItemContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                Projects
              </Box>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <VStack align="start" spacing={4}>
                <Link>My Projects</Link>
                <Button>Start New</Button>
              </VStack>
            </AccordionItemContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                Finished Projects
              </Box>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <VStack align="start" spacing={4}>
                <Link>Finished Projects</Link>
              </VStack>
            </AccordionItemContent>
          </AccordionItem>
        </AccordionRoot>
      </Box>

      <Box flex="1" p={4}>
        <Text fontSize="2xl" mb={4}>
          User Page
        </Text>
        {user && <Text>Welcome: {user.username}</Text>}
      </Box>
    </Flex>
  );
};

export default UserPage;
