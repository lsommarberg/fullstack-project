import {
  Box,
  Text,
  Link,
  Button,
  HStack,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import patternService from '../../services/pattern';
import SidebarLayout from '../layout/SidebarLayout';
import Notes from './Notes';
import TagList from './TagList';
import PatternText from './PatternText';
import EditPattern from './EditPattern';
import { toaster } from '../ui/toaster';
import ConfirmDialog from '../ConfirmDialog';
import ImageManager from '../ImageManager';
import useImageUpload from '../../hooks/useImageManagement';

const Pattern = () => {
  const { id, patternId } = useParams();
  const [patternData, setPatternData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteImage } = useImageUpload();

  const navigate = useNavigate();

  useEffect(() => {
    const getPatternData = async () => {
      try {
        const patternData = await patternService.getPatternById(id, patternId);
        setPatternData(patternData);
      } catch (error) {
        console.error('Error fetching pattern data:', error);
        setError(error);
      }
    };
    getPatternData();
  }, [id, patternId]);

  if (!patternData) {
    return <Text> Loading... </Text>;
  }
  const { name, text, link, notes, tags, files } = patternData;

  const handleDelete = async () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);

      if (files && files.length > 0) {
        for (const file of files) {
          try {
            await deleteImage(file.publicId, patternId);
          } catch (imageError) {
            console.error(`Error deleting image ${file.publicId}:`, imageError);
          }
        }
      }
      await patternService.deletePattern(id, patternId);
      toaster.success({
        description: 'Pattern deleted successfully',
        duration: 5000,
      });
      navigate(`/patterns/${id}`);
    } catch (error) {
      console.error('Error deleting pattern:', error);
      toaster.error({
        description: 'An error occurred while deleting the pattern.',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (updatedPattern) => {
    try {
      await patternService.updatePattern(id, patternId, updatedPattern);
      setPatternData(updatedPattern);
      setIsEditing(false);
      toaster.success({
        description: 'Pattern updated successfully.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error updating pattern:', error);
      toaster.error({
        description: 'An error occurred while updating the pattern.',
        duration: 5000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <SidebarLayout userId={id}>
      {!patternData ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : isEditing ? (
        <EditPattern
          name={name}
          text={text}
          link={link}
          tags={tags}
          notes={notes}
          files={files}
          onSave={handleSave}
          onCancel={handleCancel}
          userId={id}
          patternId={patternId}
        />
      ) : (
        <Box
          p={8}
          shadow="lg"
          borderWidth="1px"
          borderRadius="xl"
          bg="cardPattern.bg"
          color="fg.default"
        >
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="2xl" fontWeight="bold" color="fg.default">
                {name}
              </Text>
              <HStack spacing={4}>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate(`/projects/${id}/create`, { state: { patternId } })
                  }
                >
                  Start Project
                </Button>
                <Button variant="secondary" onClick={toggleIsEditing}>
                  Edit Pattern
                </Button>
                <Button variant="delete" onClick={handleDelete}>
                  Delete Pattern
                </Button>
              </HStack>
            </Flex>

            <Box
              p={6}
              bg="section.bg"
              borderRadius="lg"
              border="1px solid"
              borderColor="section.border"
              shadow="sm"
            >
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="fg.muted">
                Pattern Instructions
              </Text>
              <PatternText text={text} />
            </Box>

            {files && files.length > 0 && (
              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  mb={4}
                  color="fg.muted"
                >
                  Pattern Images
                </Text>
                <ImageManager
                  files={files}
                  headerText=""
                  showUpload={false}
                  showDelete={false}
                  itemType="pattern"
                  type="patterns"
                  userId={id}
                />
              </Box>
            )}

            {link && (
              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  mb={4}
                  color="fg.muted"
                >
                  Pattern Source
                </Text>
                <Link
                  href={link}
                  color="blue.500"
                  isExternal
                  _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                >
                  {link}
                </Link>
              </Box>
            )}

            {tags && tags.length > 1 && (
              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  mb={4}
                  color="fg.muted"
                >
                  Tags
                </Text>
                <TagList tags={tags} />
              </Box>
            )}

            {notes && notes.trim() && (
              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  mb={4}
                  color="fg.muted"
                >
                  Additional Notes
                </Text>
                <Notes notes={notes} />
              </Box>
            )}
          </VStack>

          <ConfirmDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={confirmDelete}
            title="Confirm Deletion"
            message="Are you sure you want to delete this pattern and all associated images? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isDeleting}
          />
        </Box>
      )}
    </SidebarLayout>
  );
};

export default Pattern;
