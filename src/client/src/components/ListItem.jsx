import {
  Text,
  Flex,
  Card,
  HStack,
  Wrap,
  Box,
  WrapItem,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Tag } from '@/components/ui/tag';

const ListItem = ({ item, getItemPath, finished, cardBg = 'card.bg' }) => (
  <Card.Root
    key={item.id}
    bg={cardBg}
    color="fg.default"
    borderWidth="1px"
    borderColor="input.border"
    as={RouterLink}
    to={getItemPath(item)}
    _hover={{ boxShadow: 'md', cursor: 'pointer' }}
    data-testid={'item-' + item.name}
  >
    <Card.Body>
      <Flex justify="space-between" align="center" p={4} minHeight="50px">
        <HStack>
          <Text fontSize="lg" fontWeight="bold">
            {item.name}
          </Text>
          {finished && (
            <Text as="span" color="green.500" fontSize="xl" ml={2}>
              ✓
            </Text>
          )}
        </HStack>
        <Box minWidth="120px" ml={8}>
          <Wrap justify="flex-end">
            {item.tags &&
              item.tags.length > 0 &&
              item.tags.map((tag, tagIndex) => (
                <WrapItem key={tagIndex}>
                  <Tag
                    color="fg.default"
                    bg="input.bg"
                    borderColor="blue.400"
                    borderWidth="1px"
                    size="lg"
                  >
                    {tag}
                  </Tag>
                </WrapItem>
              ))}
          </Wrap>
        </Box>
      </Flex>
    </Card.Body>
  </Card.Root>
);

export default ListItem;
