import React from 'react';
import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const Notes = ({ notes }) => {
  const preprocessText = (inputText) => {
    return inputText.replace(/^- /gm, '\\- ').replace(/\n/g, '  \n');
  };

  return (
    <Box mb={4} bg="input.bg" color="fg.default">
      <Box mx={4} my={4}>
        <ReactMarkdown>{preprocessText(notes)}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default Notes;
