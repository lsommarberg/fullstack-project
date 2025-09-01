import { useEffect, useState } from 'react';
import { Text, Flex, Stack, HStack, Spacer, Button } from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import patternService from '../../services/pattern';
import SidebarLayout from '../layout/SidebarLayout';
import SearchBar from '../SearchBar';
import ListItem from '../ListItem';

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

  const handleClearSearch = async () => {
    setSearchQuery('');
    setIsLoading(true);
    try {
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
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
          placeHolderText="Search patterns..."
          labelText="Search Patterns"
          isLoading={isLoading}
          showAdvanced={false}
          status={{ value: 'pattern' }}
        />
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
                cardBg="cardPattern.bg"
              />
            ))
          )}
        </Stack>
      </Flex>
    </SidebarLayout>
  );
};

export default PatternList;
