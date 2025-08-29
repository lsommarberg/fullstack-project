import { Button, CloseButton, Dialog, HStack, Portal } from '@chakra-ui/react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  cancelText = 'Cancel',
  confirmText,
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };
  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
        placement={'top'}
        motionPreset="slide-in-bottom"
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        open={isOpen}
        onOpenChange={onClose}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>{message}</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="cancel">{cancelText}</Button>
                </Dialog.ActionTrigger>
                <Button
                  data-testid="confirm-button"
                  onClick={handleConfirm}
                  isLoading={isLoading}
                  variant="primary"
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
    </HStack>
  );
};

export default ConfirmDialog;
