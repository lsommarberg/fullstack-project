import { useState, useEffect } from 'react';
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Input,
  Textarea,
  VStack,
  Checkbox,
  Box,
  HStack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import ImageManager from '../ImageManager';

/**
 * Modal dialog component for finishing/completing projects with comprehensive project completion options.
 * Provides functionality to set finish date, add final notes, manage project images,
 * and handle existing image cleanup. Includes validation and proper form state management.
 *
 * @component
 * @param {Object} props - The component props
 * @param {boolean} props.isOpen - Whether the dialog is currently open
 * @param {Function} props.onClose - Callback function when dialog is closed
 * @param {Function} props.onConfirm - Callback function when project completion is confirmed
 * @param {string} props.cancelText - Text for the cancel button
 * @param {string} props.confirmText - Text for the confirm button
 * @param {boolean} props.isLoading - Whether the completion operation is in progress
 * @param {string} props.currentProjectName - Current name of the project being finished
 * @param {Array} props.currentImages - Existing project images
 * @param {string} props.userId - Current user ID for image management
 * @returns {JSX.Element} Modal dialog for project completion with image and data management
 */
const FinishProjectDialog = ({
  isOpen,
  onClose,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Finish Project',
  isLoading = false,
  currentProjectName = '',
  currentImages = [],
  userId,
}) => {
  const [projectName, setProjectName] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [notes, setNotes] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);
  const [deleteExistingImages, setDeleteExistingImages] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProjectName(currentProjectName);
      setFinishDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setNewImages([]);
      setKeepExistingImages(true);
      setDeleteExistingImages(false);
    }
  }, [isOpen, currentProjectName]);

  const handleImageUpload = (uploadedImageUrl, fullResult) => {
    if (uploadedImageUrl === null) {
      return;
    }

    const imageObject = {
      url: uploadedImageUrl,
      publicId: fullResult.publicId,
      size: fullResult.size,
    };

    setNewImages((prev) => [...prev, imageObject]);
  };

  const handleImageDelete = (publicId) => {
    setNewImages((prev) => prev.filter((img) => img.publicId !== publicId));
  };

  const handleConfirm = async () => {
    let finalImages = [];

    if (keepExistingImages) {
      finalImages = [...currentImages];
    }

    finalImages = [...finalImages, ...newImages];

    const finishData = {
      name: projectName,
      finishedAt: finishDate,
      notes: notes.trim() || undefined,
      images: finalImages,
      deleteExistingImages: deleteExistingImages && !keepExistingImages,
    };

    await onConfirm(finishData);
  };

  const handleCancel = () => {
    setProjectName(currentProjectName);
    setFinishDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setNewImages([]);
    setKeepExistingImages(true);
    setDeleteExistingImages(false);
    onClose();
  };

  return (
    <Dialog.Root
      placement="center"
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="card.bg" color="fg.default">
            <Dialog.Body>
              <VStack spacing={4} align="stretch">
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
                {currentImages && currentImages.length > 0 && (
                  <Field label="Current Project Images">
                    <ImageManager
                      files={currentImages}
                      headerText="Current Project Images"
                      showUpload={false}
                      showDelete={false}
                      itemType="project"
                      type="projects"
                      userId={userId}
                    />
                    <VStack align="start" spacing={2} mt={3}>
                      <Checkbox.Root
                        variant={'solid'}
                        checked={keepExistingImages}
                        onCheckedChange={(details) => {
                          setKeepExistingImages(details.checked);
                          if (details.checked) {
                            setDeleteExistingImages(false);
                          }
                        }}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          Keep existing images in finished project
                        </Checkbox.Label>
                      </Checkbox.Root>
                      {!keepExistingImages && (
                        <Checkbox.Root
                          checked={deleteExistingImages}
                          onCheckedChange={(details) =>
                            setDeleteExistingImages(details.checked)
                          }
                          colorScheme="red"
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Label>
                            Delete existing images from storage (this cannot be
                            undone)
                          </Checkbox.Label>
                        </Checkbox.Root>
                      )}
                    </VStack>
                  </Field>
                )}
                <Field
                  label="Add Final Images"
                  helperText="Upload any final images for this finished project (optional)"
                >
                  <ImageManager
                    files={newImages}
                    headerText="Final Project Images"
                    showUpload={true}
                    showDelete={true}
                    type="projects"
                    onImageUpload={handleImageUpload}
                    onImageDelete={handleImageDelete}
                    onUploadError={(error) =>
                      console.error('Image upload error:', error)
                    }
                    buttonText="Add Final Image"
                    itemType="project"
                    userId={userId}
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
                    _focus={{
                      borderColor: 'input.borderFocus',
                      boxShadow: '0 0 0 1px input.borderFocus',
                    }}
                  />
                </Field>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <HStack spacing={2}>
                <Button
                  onClick={handleCancel}
                  variant="cancel"
                  aria-label="Cancel finishing project"
                >
                  {cancelText}
                </Button>
                <Button
                  data-testid="confirm-button"
                  onClick={handleConfirm}
                  isLoading={isLoading}
                  disabled={!projectName.trim() || !finishDate}
                  variant="primary"
                  aria-label="Confirm finish project"
                >
                  {confirmText}
                </Button>
              </HStack>
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
