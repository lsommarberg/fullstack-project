import { Box, Text, Flex, Button } from '@chakra-ui/react';
import Notes from '../pattern/Notes';
import ImageManager from '../ImageManager';
import ConfirmDialog from '../ConfirmDialog';

const FinishedProject = ({
  projectData,
  formattedDate,
  handleDelete,
  handleImageDelete,
  showDeleteDialog,
  setShowDeleteDialog,
  confirmDelete,
  isDeleting,
}) => {
  const { name, notes, files, finishedAt } = projectData;

  return (
    <Box p={5} shadow="md" borderWidth="1px" bg="card.bg" color="fg.default">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="green.500">
          ✓ {name} (Completed)
        </Text>
        <Button
          color="deleteButton"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete Project
        </Button>
      </Flex>

      <Text mb={4}>Started on: {formattedDate}</Text>

      {finishedAt && (
        <Text mb={4}>
          Finished on: {new Date(finishedAt).toLocaleDateString()}
        </Text>
      )}

      <ImageManager
        files={files || []}
        headerText="Final Project Images"
        showUpload={false}
        showDelete={false}
        itemType="project"
      />

      <Box mb={4}>
        <Text fontWeight="bold">Final Notes:</Text>
        {notes && <Notes notes={notes} />}
      </Box>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        confirmText="Delete Project"
        cancelText="Cancel"
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />
    </Box>
  );
};

export default FinishedProject;
