import React from 'react';
import { Box, Text, Link, Button, List, Input, HStack } from '@chakra-ui/react';
import { Tag } from '@/components/ui/tag';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import patternService from '../services/pattern';
import SidebarLayout from './SidebarLayout';

const Pattern = () => {
  const { id, patternId } = useParams();
  const [patternData, setPatternData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showMore, setShowMore] = useState(false);
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

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleInputVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleAddNote = async () => {
    if (newNote.trim() === '') {
      console.log('Note cannot be empty');
      return;
    }

    try {
      const updatedPattern = await patternService.updatePattern(id, patternId, {
        notes: newNote,
      });
      setPatternData(updatedPattern);
      setNewNote('');
      setIsVisible(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleRemoveNote = async (note) => {
    try {
      const updatedPattern = await patternService.updatePattern(id, patternId, {
        removeNote: note,
      });
      setPatternData(updatedPattern);
    } catch (error) {
      console.error('Error removing note:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await patternService.deletePattern(id, patternId);
      navigate(`/patterns/${id}`);
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

        <Box mb={4} ml={4}>
          <ReactMarkdown>
            {showMore ? text : `${text.substring(0, 100)}...`}
          </ReactMarkdown>
          <Link color="teal.500" onClick={toggleShowMore} ml={2}>
            {showMore ? 'Show Less' : 'Show More'}
          </Link>
        </Box>

        <Link href={link} color="teal.500" isExternal>
          View Full Pattern
        </Link>
        <Box mt={4}>
          <Text fontSize="lg" mb={4}>
            Notes for this pattern:
          </Text>
          <List.Root>
            {notes.map((note, index) => (
              <Box key={index} display="flex" alignItems="center">
                <List.Item>{note}</List.Item>
                <Button ml={4} size="xs" onClick={() => handleRemoveNote(note)}>
                  Delete
                </Button>
              </Box>
            ))}
          </List.Root>
          {isVisible && (
            <Box mt={4}>
              <Input
                placeholder="Add a new note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button mt={2} colorScheme="teal" onClick={handleAddNote}>
                Save Note
              </Button>
            </Box>
          )}
          <Button
            mt={4}
            size="sm"
            colorScheme="teal"
            onClick={toggleInputVisibility}
          >
            {isVisible ? 'Cancel' : 'Add Note'}
          </Button>
        </Box>
        <Box mt={4}>
          {tags.map((tag, index) => (
            <Tag key={index} mr={2} mb={2}>
              {tag}
            </Tag>
          ))}
        </Box>
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
