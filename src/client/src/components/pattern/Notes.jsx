import React from 'react';
import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const Notes = ({ notes }) => {
  return (
    <Box mb={4} ml={4}>
      <ReactMarkdown>{notes}</ReactMarkdown>
    </Box>
  );
};

export default Notes;
