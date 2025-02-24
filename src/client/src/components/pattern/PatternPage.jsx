import React from 'react';
import { Box, Text, Link, Button, HStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import patternService from '../../services/pattern';
import SidebarLayout from '../SidebarLayout';
import Notes from './Notes';
import TagList from './TagList';
import PatternText from './PatternText';

const Pattern = () => {
  const { id, patternId } = useParams();
  const [patternData, setPatternData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPatternData = async () => {
      try {
        const patternData = await patternService.getPatternById(id, patternId);
        setPatternData(patternData);
      } catch (error) {
        console.error('Error fetching pattern data:', error);
      }
    };
    getPatternData();
  }, [id, patternId]);

  if (!patternData) {
    return <Text> Loading... </Text>;
  }
  const { name, text, link, notes, tags } = patternData;
  console.log('notes:', notes);

  const handleDelete = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this pattern?')) {
        await patternService.deletePattern(id, patternId);
        navigate(`/patterns/${id}`);
      }
    } catch (error) {
      console.error('Error deleting pattern:', error);
    }
  };

  return (
    <SidebarLayout userId={id}>
      <Box p={5} shadow="md" borderWidth="1px">
        <Text fontSize="2xl" mb={4}>
          {name}
        </Text>

        <PatternText text={text} />

        {link && (
          <Link href={link} color="teal.500" isExternal>
            Link to pattern
          </Link>
        )}
        <Box mt={4}>
          <Text fontSize="lg" mb={4}>
            Notes for this pattern:
          </Text>
          <Notes notes={notes} />
        </Box>

        <TagList tags={tags} />

        <HStack mt={4} align="start">
          <Button colorScheme="red" size="sm" onClick={handleDelete}>
            Delete Pattern
          </Button>
          <Button colorScheme="teal" size="sm">
            Start Project
          </Button>
        </HStack>
      </Box>
    </SidebarLayout>
  );
};

export default Pattern;
