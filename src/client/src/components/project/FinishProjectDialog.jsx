import React, { useState, useEffect } from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';

const FinishProjectDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Finish Project',
  cancelText = 'Cancel',
  confirmText = 'Finish Project',
  isLoading = false,
  currentProjectName = '',
}) => {
  const [projectName, setProjectName] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProjectName(currentProjectName);
      setFinishDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [isOpen, currentProjectName]);

  const handleConfirm = async () => {
    const finishData = {
      name: projectName,
      finishedAt: finishDate,
      notes: notes.trim() || undefined,
    };

    await onConfirm(finishData);
  };

  const handleCancel = () => {
    setProjectName(currentProjectName);
    setFinishDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    onClose();
  };

  return (
    <Dialog.Root
      placement="center"
      open={isOpen}
      onOpenChange={onClose}
      size="md"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="card.bg" color="fg.default">
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack spacing={4} align="stretch">
                <Field label="Project Name">
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    required
                  />
                </Field>

                <Field label="Finish Date">
                  <Input
                    type="date"
                    value={finishDate}
                    onChange={(e) => setFinishDate(e.target.value)}
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    required
                  />
                </Field>

                <Field label="Notes (optional)">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any final notes about this project..."
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    rows={4}
                  />
                </Field>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  bg="cancelButton"
                >
                  {cancelText}
                </Button>
              </Dialog.ActionTrigger>
              <Button
                data-testid="confirm-button"
                onClick={handleConfirm}
                isLoading={isLoading}
                disabled={!projectName.trim() || !finishDate}
                colorScheme="green"
              >
                {confirmText}
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default FinishProjectDialog;
