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

const FinishProjectDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Finish Project',
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

                {currentImages && currentImages.length > 0 && (
                  <Box>
                    <ImageManager
                      files={currentImages}
                      headerText="Current Project Images"
                      showUpload={false}
                      showDelete={false}
                      itemType="project"
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
                  </Box>
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
                  />
                </Field>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <HStack spacing={2}>
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
