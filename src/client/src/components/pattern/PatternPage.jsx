import React from 'react';
import {
  Box,
  Text,
  Link,
  Button,
  HStack,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import patternService from '../../services/pattern';
import SidebarLayout from '../SidebarLayout';
import Notes from './Notes';
import TagList from './TagList';
import PatternText from './PatternText';
import EditPattern from './EditPattern';
import { toaster } from '../ui/toaster';

const Pattern = () => {
  const { id, patternId } = useParams();
  const [patternData, setPatternData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getPatternData = async () => {
      try {
        const patternData = await patternService.getPatternById(id, patternId);
        setPatternData(patternData);
      } catch (error) {
        console.error('Error fetching pattern data:', error);
        setError(error);
      }
    };
    getPatternData();
  }, [id, patternId]);

  if (!patternData) {
    return <Text> Loading... </Text>;
  }
  const { name, text, link, notes, tags } = patternData;

  const handleDelete = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this pattern?')) {
        await patternService.deletePattern(id, patternId);
        navigate(`/patterns/${id}`);
      }
    } catch (error) {
      console.error('Error deleting pattern:', error);
      toaster.error({
        description: 'An error occurred while deleting the pattern.',
        duration: 5000,
      });
    }
  };

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (updatedPattern) => {
    try {
      await patternService.updatePattern(id, patternId, updatedPattern);
      setPatternData(updatedPattern);
      setIsEditing(false);
      toaster.success({
        description: 'Pattern updated successfully.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error updating pattern:', error);
      toaster.error({
        description: 'An error occurred while updating the pattern.',
        duration: 5000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <SidebarLayout userId={id}>
      {!patternData ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : isEditing ? (
        <EditPattern
          name={name}
          text={text}
          link={link}
          tags={tags}
          notes={notes}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          bg="card.bg"
          color="fg.default"
        >
          <Text fontSize="2xl" mb={4}>
            {name}
          </Text>

          <PatternText text={text} />

          {link && (
            <Link href={link} color="blue.500" isExternal>
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

          <Flex mt={4} align="center">
            <Button size="sm">Start Project</Button>
            <Spacer />

            <HStack spacing={4}>
              <Button size="sm" onClick={toggleIsEditing}>
                Edit Pattern
              </Button>
              <Button size="sm" color="deleteButton" onClick={handleDelete}>
                Delete Pattern
              </Button>
            </HStack>
          </Flex>
        </Box>
      )}
    </SidebarLayout>
  );
};

export default Pattern;
