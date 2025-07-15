import React, { useState } from 'react';
import { Box, Link } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const PatternText = ({ text }) => {
  const [showMore, setShowMore] = useState(true);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const preprocessText = (inputText) => {
    return inputText.replace(/^- /gm, '\\- ').replace(/\n/g, '  \n');
  };

  return (
    <Box mb={4} bg="input.bg" color="fg.default">
      <Box mx={4} my={4}>
        <ReactMarkdown>
          {showMore
            ? preprocessText(text)
            : preprocessText(text.substring(0, 100)) + '...'}
        </ReactMarkdown>
      </Box>
      <Link color="link" onClick={toggleShowMore} ml={2}>
        {showMore ? 'Show Less' : 'Show More'}
      </Link>
    </Box>
  );
};

export default PatternText;
