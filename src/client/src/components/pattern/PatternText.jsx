import React, { useState } from 'react';
import { Box, Link } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

const PatternText = ({ text }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <Box mb={4} ml={4}>
      <ReactMarkdown>
        {showMore ? text : `${text.substring(0, 100)}...`}
      </ReactMarkdown>
      <Link color="teal.500" onClick={toggleShowMore} ml={2}>
        {showMore ? 'Show Less' : 'Show More'}
      </Link>
    </Box>
  );
};

export default PatternText;
