import React from 'react';
import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const Notes = ({ notes }) => {
  return (
    <Box>
      <ReactMarkdown>{notes}</ReactMarkdown>
    </Box>
  );
};

export default Notes;
