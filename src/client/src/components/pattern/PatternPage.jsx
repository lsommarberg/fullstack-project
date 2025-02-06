import React from 'react';
import { Box, Text, Link, Button, HStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import patternService from '../../services/pattern';
import SidebarLayout from '../SidebarLayout';
import NoteList from './Notes';
import AddNoteForm from './AddNote';
import TagList from './TagList';
import PatternText from './PatternText';

const Pattern = () => {
  const { id, patternId } = useParams();
  const [patternData, setPatternData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
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
          <NoteList notes={notes} onRemove={handleRemoveNote} />
          {isVisible && (
            <AddNoteForm
              newNote={newNote}
              setNewNote={setNewNote}
              onSave={handleAddNote}
            />
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
