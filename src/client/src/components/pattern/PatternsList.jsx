import { useEffect, useState } from 'react';
import { Text, Flex } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import patternService from '../../services/pattern';
import { Tag } from '@/components/ui/tag';
import ListPage from '../layout/ListPage';

const PatternList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patterns, setPatterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const renderPatternItem = (pattern) => (
    <Flex justify="space-between" align="center">
      <Text fontSize="lg" fontWeight="bold">
        {pattern.name}
      </Text>
      <Flex>
        {pattern.tags &&
          pattern.tags.map((tag, tagIndex) => (
            <Tag key={tagIndex} color="fg.default" bg="input.bg" mr={2}>
              {tag}
            </Tag>
          ))}
      </Flex>
    </Flex>
  );

  return (
    <ListPage
      userId={id}
      title="My Patterns:"
      items={patterns}
      searchPlaceholder="Search patterns..."
      createButtonText="Create New"
      createPath={`/patterns/${id}/create`}
      renderItem={renderPatternItem}
      getItemPath={(pattern) => `/patterns/${id}/${pattern.id}`}
      isLoading={isLoading}
      emptyStateText="No patterns yet"
    />
  );
};

export default PatternList;
