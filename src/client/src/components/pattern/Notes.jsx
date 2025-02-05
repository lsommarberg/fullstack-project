import React from 'react';
import { Box, IconButton, List } from '@chakra-ui/react';
import { AiOutlineClose } from 'react-icons/ai';

const NoteItem = ({ note, onRemove }) => (
  <List.Item display="flex" alignItems="center" mb={2}>
    <Box>{note}</Box>
    <IconButton
      ml={4}
      size="xs"
      onClick={() => onRemove(note)}
      aria-label="Delete note"
    >
      <AiOutlineClose />
    </IconButton>
  </List.Item>
);

const NoteList = ({ notes, onRemove }) => (
  <Box mt={4}>
    <List.Root>
      {notes.map((note, index) => (
        <NoteItem key={index} note={note} onRemove={onRemove} />
      ))}
    </List.Root>
  </Box>
);

export default NoteList;
