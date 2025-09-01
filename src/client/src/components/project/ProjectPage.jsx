import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Text,
  Link,
  Box,
  Flex,
  HStack,
  Button,
  VStack,
} from '@chakra-ui/react';
import projectService from '../../services/project';
import Notes from '../pattern/Notes';
import { toaster } from '../ui/toaster';
import ConfirmDialog from '../ConfirmDialog';
import RowTrackersSection from './RowTrackersSection';
import EditProject from './EditProject';
import FinishProjectDialog from './FinishProjectDialog';
import useImageUpload from '../../hooks/useImageManagement';
import ImageManager from '../ImageManager';
import uploadService from '../../services/upload';
import TagList from '../pattern/TagList';

const ProjectPage = () => {
  const { id, projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const { deleteImage } = useImageUpload();

  useEffect(() => {
    const getProjectData = async () => {
      try {
        const projectData = await projectService.getProjectById(id, projectId);
        setProjectData(projectData);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    getProjectData();
  }, [id, projectId]);

  if (!projectData) {
    return <Text>Loading...</Text>;
  }
  const {
    name,
    startedAt,
    pattern,
    notes,
    rowTrackers,
    finishedAt,
    files,
    tags,
  } = projectData;

  const formattedDate = new Date(startedAt).toLocaleDateString();

  const handleDelete = () => setShowDeleteDialog(true);

  const onCurrentRowChange = async (index, value) => {
    const newRowTrackers = [...rowTrackers];
    newRowTrackers[index].currentRow = parseInt(value) || 0;

    const updatedProject = { ...projectData, rowTrackers: newRowTrackers };
    setProjectData(updatedProject);

    try {
      await projectService.updateProject(id, projectId, {
        rowTrackers: newRowTrackers,
      });
    } catch (error) {
      console.error('Error updating row tracker:', error);
      toaster.error({ description: 'Failed to update row tracker' });
    }
  };

  const onTotalRowsChange = async (index, value) => {
    const newRowTrackers = [...rowTrackers];
    newRowTrackers[index].totalRows = parseInt(value) || 0;

    const updatedProject = { ...projectData, rowTrackers: newRowTrackers };
    setProjectData(updatedProject);

    try {
      await projectService.updateProject(id, projectId, {
        rowTrackers: newRowTrackers,
      });
    } catch (error) {
      console.error('Error updating row tracker:', error);
      toaster.error({ description: 'Failed to update row tracker' });
    }
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            await deleteImage(file.publicId, projectId);
          } catch (imageError) {
            console.error(`Error deleting image ${file.publicId}:`, imageError);
          }
        }
      }
      await projectService.deleteProject(id, projectId);
      toaster.success({ description: 'Project deleted successfully' });
      navigate(`/projects/${id}`);
    } catch (error) {
      toaster.error({ description: 'Failed to delete project' });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const updateProject = (updatedData) => {
    if (updatedData.files) {
      updatedData.files = updatedData.files.map((file) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt),
      }));
    }
    setProjectData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));

    if (updatedData.pattern) {
      updatedData.pattern = updatedData.pattern.id;
    }

    projectService.updateProject(id, projectId, {
      name: updatedData.name,
      notes: updatedData.notes,
      rowTrackers: updatedData.rowTrackers,
      pattern: updatedData.pattern,
      files: updatedData.files,
      tags: updatedData.tags,
    });
    setIsEditing(false);

    toaster.success({ description: 'Project updated successfully' });
  };

  const handleFinishProject = async (finishData) => {
    try {
      setIsFinishing(true);

      if (finishData.deleteExistingImages && files && files.length > 0) {
        for (const image of files) {
          try {
            await uploadService.deleteImage(id, image.publicId);
          } catch (error) {
            console.error('Failed to delete image:', error);
          }
        }
      }

      const updateData = {
        name: finishData.name,
        finishedAt: finishData.finishedAt,
        notes: finishData.notes,
        files: finishData.images,
      };

      await projectService.updateProject(id, projectId, updateData);

      toaster.success({
        description: 'Project finished successfully!',
        duration: 5000,
      });

      const updatedProject = await projectService.getProjectById(id, projectId);
      setProjectData(updatedProject);
      setFinishDialogOpen(false);
    } catch (error) {
      console.error('Error finishing project:', error);
      toaster.error({
        description: 'Failed to finish project',
        duration: 5000,
      });
    } finally {
      setIsFinishing(false);
    }
  };

  const handleImageDelete = async (publicId) => {
    try {
      await deleteImage(publicId);
      setProjectData((prevData) => ({
        ...prevData,
        files: prevData.files.filter((file) => file.publicId !== publicId),
      }));
      toaster.success({ description: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      toaster.error({ description: 'Failed to delete image' });
    }
  };

  return (
    <>
      {projectData ? (
        <>
          {isEditing ? (
            <EditProject
              name={name}
              notes={notes}
              rowTrackers={rowTrackers}
              pattern={pattern}
              onSave={updateProject}
              onCancel={() => setIsEditing(false)}
              userId={id}
              handleImageDelete={handleImageDelete}
              files={files}
              isFinished={finishedAt}
              tags={tags}
            />
          ) : (
            <Box
              p={8}
              shadow="lg"
              borderWidth="1px"
              borderRadius="xl"
              bg="card.bg"
              color="fg.default"
            >
              <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={finishedAt ? 'green.500' : 'fg.default'}
                  >
                    {finishedAt ? '✓ ' : ''}
                    {name}
                    {finishedAt ? ' (Completed)' : ''}
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                      aria-label="Edit this project"
                    >
                      Edit Project
                    </Button>
                    {!finishedAt && (
                      <Button
                        variant="primary"
                        onClick={() => setFinishDialogOpen(true)}
                        aria-label="Finish this project"
                      >
                        Finish project
                      </Button>
                    )}
                    <Button
                      variant="delete"
                      onClick={handleDelete}
                      isLoading={isDeleting}
                      aria-label="Delete this project"
                    >
                      Delete Project
                    </Button>
                  </HStack>
                </Flex>

                <VStack spacing={4} align="stretch">
                  <Box
                    p={4}
                    bg="section.bg"
                    borderRadius="md"
                    border="2px solid"
                    borderColor="card.border"
                    display="flex"
                    alignItems="center"
                  >
                    <HStack spacing={3} align="center">
                      <Box as="span" fontSize="2xl" color="fg.muted">
                        📅
                      </Box>
                      <Text fontSize="xl" fontWeight="bold" color="fg.muted">
                        Project Started:
                      </Text>
                      <Text fontSize="xl" color="fg.muted">
                        {formattedDate}
                      </Text>
                    </HStack>
                  </Box>

                  {finishedAt && (
                    <Box
                      p={4}
                      bg="section.bg"
                      borderRadius="md"
                      border="2px solid"
                      borderColor="card.border"
                      display="flex"
                      alignItems="center"
                    >
                      <HStack spacing={3} align="center">
                        <Box as="span" fontSize="2xl" color="fg.muted">
                          ✅
                        </Box>
                        <Text fontSize="xl" fontWeight="bold" color="fg.muted">
                          Project Completed:
                        </Text>
                        <Text fontSize="xl" color="fg.muted">
                          {new Date(finishedAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                    </Box>
                  )}

                  {pattern && (
                    <Box
                      p={4}
                      bg="section.bg"
                      borderRadius="md"
                      border="2px solid"
                      borderColor="card.border"
                      display="flex"
                      alignItems="center"
                    >
                      <HStack spacing={3} align="center">
                        <Box as="span" fontSize="2xl" color="fg.muted">
                          🧶
                        </Box>
                        <Text fontSize="xl" fontWeight="bold" color="fg.muted">
                          Pattern:
                        </Text>
                        <Link
                          as={RouterLink}
                          to={`/patterns/${id}/${pattern.id}`}
                          color="fg.muted"
                          textDecoration="underline"
                          _hover={{ color: 'fg.default' }}
                          aria-label={`View pattern ${pattern.name}`}
                        >
                          {pattern.name}
                        </Link>
                      </HStack>
                    </Box>
                  )}
                </VStack>

                {rowTrackers && rowTrackers.length > 0 && !finishedAt && (
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
                      Row Trackers
                    </Text>
                    <RowTrackersSection
                      rowTrackers={rowTrackers}
                      onUpdateTracker={(index, field, value) => {
                        if (field === 'currentRow') {
                          onCurrentRowChange(index, value);
                        } else if (field === 'totalRows') {
                          onTotalRowsChange(index, value);
                        }
                      }}
                      isEditable={false}
                      showHeader={false}
                    />
                  </Box>
                )}

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
                      {finishedAt ? 'Final Project Images' : 'Project Images'}
                    </Text>
                    <ImageManager
                      files={files}
                      headerText=""
                      showUpload={false}
                      showDelete={false}
                      itemType="project"
                      type="projects"
                      userId={id}
                    />
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
                      {finishedAt ? 'Final Notes' : 'Notes'}
                    </Text>
                    <Notes notes={notes} />
                  </Box>
                )}
              </VStack>

              <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                confirmText={'Delete Project'}
                cancelText="Cancel"
                title="Delete Project"
                message="Are you sure you want to delete this project and all associated images? This action cannot be undone."
              />
              {!finishedAt && (
                <FinishProjectDialog
                  isOpen={finishDialogOpen}
                  onClose={() => setFinishDialogOpen(false)}
                  onConfirm={handleFinishProject}
                  isLoading={isFinishing}
                  currentProjectName={name}
                  currentImages={files}
                  userId={id}
                />
              )}
            </Box>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};

export default ProjectPage;
