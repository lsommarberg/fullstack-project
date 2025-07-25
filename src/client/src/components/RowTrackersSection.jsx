import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

const RowTrackersSection = ({
  rowTrackers,
  onAddTracker,
  onRemoveTracker,
  onUpdateTracker,
  isEditable = true,
}) => {
  return (
    <Box>
      <HStack justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold">Row Trackers (optional)</Text>
        {isEditable && (
          <Button size="sm" onClick={onAddTracker}>
            Add Section
          </Button>
        )}
      </HStack>

      <VStack spacing={3} align="stretch">
        {rowTrackers.map((tracker, index) => (
          <Box
            key={index}
            p={3}
            border="1px solid"
            borderColor="input.border"
            borderRadius="md"
            bg="input.bg"
          >
            <HStack spacing={3} align="end">
              <Field label="Section Name" flex="1">
                <Input
                  value={tracker.section}
                  onChange={(e) =>
                    onUpdateTracker(index, 'section', e.target.value)
                  }
                  placeholder="e.g., Body, Sleeves, etc."
                  bg="card.bg"
                  color="fg.default"
                  borderColor="input.border"
                  size="sm"
                  readOnly={!isEditable}
                />
              </Field>

              <Field label="Total Rows" width="120px">
                <Input
                  type="number"
                  value={tracker.totalRows || ''}
                  onChange={(e) =>
                    onUpdateTracker(index, 'totalRows', e.target.value)
                  }
                  placeholder="100"
                  bg="card.bg"
                  color="fg.default"
                  borderColor="input.border"
                  size="sm"
                  min="0"
                  readOnly={!isEditable}
                />
              </Field>

              {isEditable && rowTrackers.length > 1 && (
                <IconButton
                  size="sm"
                  onClick={() => onRemoveTracker(index)}
                  bg="deleteButton"
                  color="white"
                  _hover={{ opacity: 0.8 }}
                >
                  ×
                </IconButton>
              )}
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default RowTrackersSection;
