import { useEffect, useState } from 'react';
import {
  Text,
  Flex,
  Input,
  Button,
  Stack,
  Card,
  HStack,
  Spacer,
  Wrap,
  Box,
  WrapItem,
} from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import patternService from '../../services/pattern';
import { Tag } from '@/components/ui/tag';
import SidebarLayout from '../layout/SidebarLayout';

export const ListItem = ({ item, getItemPath, finished }) => (
  <Card.Root
    key={item.id}
    bg="card.bg"
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

const PatternList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patterns, setPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getItemPath = (pattern) => `/patterns/${id}/${pattern.id}`;

  useEffect(() => {
    const getPatternData = async () => {
      try {
        setIsLoading(true);
        const patterns = await patternService.getPatterns(id);
        setPatterns(patterns);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };
    getPatternData();
  }, [id, navigate]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const result = await patternService.searchPatterns(searchQuery);
      setPatterns(result);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarLayout userId={id}>
      <Flex direction="column" p={6}>
        <HStack mb={4} align="center" justify={'space-between'}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            data-testid="patterns-title"
          >
            My Patterns
          </Text>
          <Spacer />
          <Button
            onClick={() => navigate(`/patterns/${id}/create`)}
            variant="secondary"
          >
            Create New
          </Button>
        </HStack>
        <Flex mb={4} my="5" gap={4} align="center">
          <Input
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            flex={2}
            minWidth="200px"
            variant={'input'}
            size={'lg'}
          />
          <Button onClick={handleSearch} variant="primary">
            Search
          </Button>
        </Flex>
        <Stack spacing={4} data-testid="patterns-list">
          {isLoading ? (
            <Text>Loading...</Text>
          ) : patterns.length === 0 ? (
            <Text>No patterns yet</Text>
          ) : (
            patterns.map((pattern) => (
              <ListItem
                item={pattern}
                key={pattern.id}
                getItemPath={getItemPath}
              />
            ))
          )}
        </Stack>
      </Flex>
    </SidebarLayout>
  );
};

export default PatternList;
