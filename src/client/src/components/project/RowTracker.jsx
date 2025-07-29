import { Box, HStack, Input, Text } from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

export const RowTracker = ({
  index,
  section,
  currentRow,
  totalRows,
  onCurrentRowChange,
  onTotalRowsChange,
}) => {
  return (
    <Box
      p={3}
      border="1px solid"
      borderColor="input.border"
      borderRadius="md"
      bg="input.bg"
      my={4}
    >
      <HStack spacing={4} align="center">
        <Box flex="1">
          <Text fontWeight="semibold" fontSize="md">
            {section}
          </Text>
        </Box>

        <Field label="Current Row" width="120px">
          <Input
            type="number"
            value={currentRow === 0 ? '' : currentRow}
            onChange={(e) => onCurrentRowChange(index, e.target.value)}
            placeholder="0"
            bg="card.bg"
            color="fg.default"
            borderColor="input.border"
            size="sm"
            min="0"
          />
        </Field>

        <Field label="Total Rows" width="120px">
          <Input
            type="number"
            value={totalRows === 0 ? '' : totalRows}
            onChange={(e) => onTotalRowsChange(index, e.target.value)}
            bg="card.bg"
            color="fg.default"
            borderColor="input.border"
            size="sm"
            min="0"
          />
        </Field>
      </HStack>
    </Box>
  );
};
