import { useEffect, useState } from 'react';
import { Text, Flex, Input, Button, Stack, Card } from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import patternService from '../../services/pattern';
import { Tag } from '@/components/ui/tag';
import SidebarLayout from '../layout/SidebarLayout';

export const ListItem = ({ item, getItemPath }) => (
  <Card.Root
    key={item.id}
    bg="card.bg"
    color="fg.default"
    borderWidth="1px"
    borderColor="input.border"
    as={RouterLink}
    to={getItemPath(item)}
    _hover={{ boxShadow: 'md', cursor: 'pointer' }}
  >
    <Card.Body>
      <Flex
        justify="space-between"
        align="center"
        p={4}
        minHeight="50px"
        height="50px"
      >
        <Text fontSize="lg" fontWeight="bold">
          {item.name}
        </Text>
        <Flex>
          {item.tags &&
            item.tags.length > 0 &&
            item.tags.map((tag, tagIndex) => (
              <Tag key={tagIndex} color="fg.default" bg="input.bg" mr={2}>
                {tag}
              </Tag>
            ))}
        </Flex>
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
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          My Patterns
        </Text>
        <Flex mb={4} gap={4} align="center">
          <Input
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            flex={2}
            minWidth="200px"
            borderColor="input.border"
          />
          <Button onClick={handleSearch} minWidth="100px">
            Search
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => navigate(`/patterns/${id}/create`)}
            minWidth="100px"
          >
            Create New
          </Button>
        </Flex>
        <Stack spacing={4}>
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
