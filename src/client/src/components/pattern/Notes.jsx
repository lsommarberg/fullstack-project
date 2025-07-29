import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const Notes = ({ notes }) => {
  const preprocessText = (inputText) => {
    return inputText.replace(/^- /gm, '\\- ').replace(/\n/g, '  \n');
  };

  return (
    <Box
      mb={4}
      bg="input.bg"
      color="fg.default"
      borderRadius="md"
      p={4}
      border="1px solid"
      borderColor="input.border"
      my={4}
    >
      <Box mx={4} my={4}>
        <ReactMarkdown>{preprocessText(notes)}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default Notes;
