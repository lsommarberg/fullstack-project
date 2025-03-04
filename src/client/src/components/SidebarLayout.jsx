import React from 'react';
import { Box, Flex, VStack, Button, Link } from '@chakra-ui/react';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '@/components/ui/accordion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const SidebarLayout = ({ children, userId }) => {
  const navigate = useNavigate();

  return (
    <Flex height="100vh">
      <Box width="250px" p={4} ml={4}>
        <AccordionRoot type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionItemTrigger>
              <Box flex="1" textAlign="left">
                Patterns
              </Box>
            </AccordionItemTrigger>
            <AccordionItemContent>
              <VStack align="start" spacing={4}>
                <Link as={RouterLink} to={`/patterns/${userId}`}>
                  My Patterns
                </Link>
                <Button onClick={() => navigate(`/patterns/${userId}/create`)}>
                  Create Pattern
                </Button>
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

      <Box flex="1" p={4} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
};

export default SidebarLayout;
