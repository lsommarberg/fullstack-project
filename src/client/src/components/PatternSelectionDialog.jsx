import React, { useState, useEffect } from 'react';
import {
  Button,
  VStack,
  Text,
  HStack,
  Dialog,
  Portal,
  Menu,
} from '@chakra-ui/react';
import patternService from '../services/pattern';

const PatternSelectionDialog = ({ isOpen, onClose, onConfirm, userId }) => {
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedPatternName, setSelectedPatternName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPatterns();
    }
  }, [isOpen, userId]);

  const fetchPatterns = async () => {
    try {
      setIsLoading(true);
      const userPatterns = await patternService.getPatterns(userId);
      setPatterns(userPatterns);
    } catch (error) {
      console.error('Error fetching patterns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatternSelect = (patternId, patternName) => {
    setSelectedPattern(patternId);
    setSelectedPatternName(patternName);
  };

  const handleConfirm = () => {
    onConfirm(selectedPattern);
    setSelectedPattern('');
    setSelectedPatternName('');
  };

  const handleCancel = () => {
    onClose();
    setSelectedPattern('');
    setSelectedPatternName('');
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      size="md"
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="card.bg" color="fg.default">
            <Dialog.Header>
              <Dialog.Title>Start New Project</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm">
                  Would you like to use an existing pattern for this project?
                </Text>

                {isLoading ? (
                  <Text>Loading patterns...</Text>
                ) : patterns.length > 0 ? (
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button bg="input.bg" color="fg.default" width="100%">
                        {selectedPatternName || 'Select a pattern (optional)'}
                      </Button>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content>
                        <Menu.Item
                          onClick={() => handlePatternSelect('', '')}
                          value=""
                        >
                          No pattern
                        </Menu.Item>
                        {patterns.map((pattern) => (
                          <Menu.Item
                            key={pattern.id}
                            onClick={() =>
                              handlePatternSelect(pattern.id, pattern.name)
                            }
                            value={pattern.id}
                          >
                            {pattern.name}
                          </Menu.Item>
                        ))}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    No patterns available. You can create one first or start
                    without a pattern.
                  </Text>
                )}
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack spacing={3}>
                <Dialog.ActionTrigger asChild>
                  <Button bg="cancelButton" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleConfirm}>Continue</Button>
              </HStack>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <Button variant="ghost" size="sm">
                ×
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PatternSelectionDialog;
