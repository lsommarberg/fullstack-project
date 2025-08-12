import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  IconButton,
} from '@chakra-ui/react';

const RowTrackersSection = ({
  rowTrackers,
  onAddTracker,
  onRemoveTracker,
  onUpdateTracker,
  isEditable = true,
  showHeader = true,
}) => {
  return (
    <Box>
      {showHeader && (
        <HStack justify="space-between" align="center" mb={3}>
          <Text fontWeight="semibold">Row Trackers (optional)</Text>
          {isEditable && (
            <Button size="sm" onClick={onAddTracker}>
              Add Section
            </Button>
          )}
        </HStack>
      )}

      <VStack spacing={3} align="stretch">
        {rowTrackers.map((tracker, index) => {
          const needsSectionName = tracker.totalRows && !tracker.section.trim();

          return (
            <Box
              key={index}
              p={3}
              border="1px solid"
              borderColor={needsSectionName ? 'orange.400' : 'input.border'}
              borderRadius="md"
              bg="input.bg"
            >
              {isEditable ? (
                <HStack spacing={3} align="start">
                  <VStack flex="1" align="stretch" spacing={1}>
                    <Text fontSize="sm" fontWeight="medium" color="fg.default">
                      Section Name
                    </Text>
                    <Input
                      value={tracker.section}
                      onChange={(e) =>
                        onUpdateTracker(index, 'section', e.target.value)
                      }
                      placeholder="e.g., Body, Sleeves, etc."
                      bg="card.bg"
                      color="fg.default"
                      borderColor={
                        needsSectionName ? 'orange.400' : 'input.border'
                      }
                      size="sm"
                      data-testid={'tracker-section'}
                    />
                    <Box minH="20px" fontSize="xs">
                      {needsSectionName && (
                        <Text color="orange.600" fontSize="xs">
                          Section name required when total rows is set
                        </Text>
                      )}
                    </Box>
                  </VStack>

                  <VStack width="120px" align="stretch" spacing={1}>
                    <Text fontSize="sm" fontWeight="medium" color="fg.default">
                      Total Rows
                    </Text>
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
                      data-testid="tracker-total-rows"
                    />
                    <Box minH="20px"></Box>
                  </VStack>

                  <VStack justify="start" pt={6}>
                    <IconButton
                      size="sm"
                      onClick={() => onRemoveTracker(index)}
                      bg="deleteButton"
                      color="white"
                      _hover={{ opacity: 0.8 }}
                    >
                      ×
                    </IconButton>
                  </VStack>
                </HStack>
              ) : (
                <HStack spacing={4} align="center">
                  <Box flex="1">
                    <Text fontWeight="semibold" fontSize="md">
                      {tracker.section}
                    </Text>
                  </Box>

                  <Box width="120px">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="fg.default"
                      mb={1}
                    >
                      Current Row
                    </Text>
                    <Input
                      type="number"
                      value={tracker.currentRow === 0 ? '' : tracker.currentRow}
                      onChange={(e) =>
                        onUpdateTracker(index, 'currentRow', e.target.value)
                      }
                      placeholder="0"
                      bg="card.bg"
                      color="fg.default"
                      borderColor="input.border"
                      size="sm"
                      min="0"
                    />
                  </Box>

                  <Box width="120px">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="fg.default"
                      mb={1}
                    >
                      Total Rows
                    </Text>
                    <Input
                      type="number"
                      value={tracker.totalRows === 0 ? '' : tracker.totalRows}
                      onChange={(e) =>
                        onUpdateTracker(index, 'totalRows', e.target.value)
                      }
                      bg="card.bg"
                      color="fg.default"
                      borderColor="input.border"
                      size="sm"
                      min="0"
                    />
                  </Box>
                </HStack>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default RowTrackersSection;
