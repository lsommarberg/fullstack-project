import React from 'react';
import { Box, Input, Button } from '@chakra-ui/react';

const AddNoteForm = ({ newNote, setNewNote, onSave }) => (
  <Box mt={4}>
    <Input
      placeholder="Add a new note"
      value={newNote}
      onChange={(e) => setNewNote(e.target.value)}
    />
    <Button mt={2} colorScheme="teal" onClick={onSave}>
      Save
    </Button>
  </Box>
);

export default AddNoteForm;
