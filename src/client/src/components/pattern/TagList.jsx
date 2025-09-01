import { Box } from '@chakra-ui/react';
import { Tag } from '@/components/ui/tag';

const TagList = ({ tags }) => (
  <Box mt={4}>
    {tags.map((tag, index) => (
      <Tag
        key={index}
        mr={2}
        mb={2}
        borderRadius="md"
        bg="input.bg"
        color="fg.default"
        borderColor="input.border"
        borderWidth="1px"
        size="lg"
      >
        {tag}
      </Tag>
    ))}
  </Box>
);

export default TagList;
