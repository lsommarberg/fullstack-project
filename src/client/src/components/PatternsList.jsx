import React, { useEffect, useState } from 'react';
import { Stack, Text, Flex, Card } from '@chakra-ui/react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import patternService from '../services/pattern';
import { Tag } from '@/components/ui/tag';
import SidebarLayout from './SidebarLayout';

const PatternList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    const getPatternData = async () => {
      try {
        const patterns = await patternService.getPatterns(id);
        setPatterns(patterns);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/');
        }
      }
    };
    getPatternData();
  }, [id, navigate]);

  if (!patterns.length) {
    return <Text>No patterns yet</Text>;
  }

  return (
    <SidebarLayout userId={id}>
      <Stack spacing={4}>
        {patterns.map((pattern, index) => (
          <Card.Root key={index} variant="outline">
            <RouterLink
              to={`/patterns/${id}/${pattern.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card.Body>
                <Flex justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="bold">
                    {pattern.name}
                  </Text>
                  <Flex>
                    {pattern.tags.map((tag, tagIndex) => (
                      <Tag key={tagIndex} colorScheme="blue" mr={2}>
                        {tag}
                      </Tag>
                    ))}
                  </Flex>
                </Flex>
              </Card.Body>
            </RouterLink>
          </Card.Root>
        ))}
      </Stack>
    </SidebarLayout>
  );
};

export default PatternList;
