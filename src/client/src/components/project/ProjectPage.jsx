import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Text, Link, Box, Flex, HStack, Button } from '@chakra-ui/react';
import projectService from '../../services/project';
import SidebarLayout from '../layout/SidebarLayout';
import Notes from '../pattern/Notes';
import { toaster } from '../ui/toaster';
import ConfirmDialog from '../ConfirmDialog';
import { RowTracker } from './RowTracker';
import EditProject from './EditProject';
import FinishProjectDialog from './FinishProjectDialog';

const ProjectPage = () => {
  const { id, projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

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
  const { name, startedAt, pattern, notes, rowTrackers, finishedAt } =
    projectData;

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
    });
    setIsEditing(false);

    toaster.success({ description: 'Project updated successfully' });
  };

  const handleFinishProject = async (finishData) => {
    try {
      setIsFinishing(true);

      await projectService.updateProject(id, projectId, {
        ...finishData,
      });

      toaster.success({
        description: 'Project finished successfully!',
        duration: 5000,
      });

      const updatedProject = await projectService.getProjectById(id, projectId);
      setProjectData(updatedProject);
      setIsFinished(true);
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

  if (isEditing) {
    return (
      <SidebarLayout userId={id}>
        {projectData && (
          <EditProject
            name={name}
            notes={notes}
            rowTrackers={rowTrackers}
            pattern={pattern}
            onSave={updateProject}
            onCancel={() => setIsEditing(false)}
            userId={id}
          />
        )}
      </SidebarLayout>
    );
  }

  const renderFinishedProject = () => (
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

      {projectData.finishedAt && (
        <Text mb={4}>
          Finished on: {new Date(projectData.finishedAt).toLocaleDateString()}
        </Text>
      )}

      <Box mb={4}>
        <Text fontWeight="bold">Notes:</Text>
        {notes && <Notes notes={notes} />}
      </Box>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        confirmText={'Delete Project'}
        cancelText="Cancel"
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />
    </Box>
  );

  return (
    <SidebarLayout userId={id}>
      {projectData ? (
        <>
          {isFinished || finishedAt !== null ? (
            renderFinishedProject()
          ) : (
            <>
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                bg="card.bg"
                color="fg.default"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    {name}
                  </Text>
                  <HStack spacing={4}>
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Project
                    </Button>
                    <Button onClick={() => setFinishDialogOpen(true)}>
                      Finish project
                    </Button>
                    <Button
                      color="deleteButton"
                      onClick={handleDelete}
                      isLoading={isDeleting}
                    >
                      Delete Project
                    </Button>
                  </HStack>
                </Flex>
                <Text mb={4}>Started on: {formattedDate}</Text>
                {pattern && (
                  <Text mb={4}>
                    Pattern:{' '}
                    <Link
                      as={RouterLink}
                      to={`/patterns/${id}/${pattern.id}`}
                      color="blue.500"
                      textDecoration="underline"
                    >
                      {pattern.name}
                    </Link>
                  </Text>
                )}
                <Box mb={4}>
                  <Text fontWeight="bold">Row Trackers:</Text>
                  {rowTrackers.map((tracker, index) => (
                    <RowTracker
                      key={index}
                      index={index}
                      section={tracker.section}
                      currentRow={tracker.currentRow}
                      totalRows={tracker.totalRows}
                      onCurrentRowChange={onCurrentRowChange}
                      onTotalRowsChange={onTotalRowsChange}
                    />
                  ))}
                </Box>
                <Box mb={4}>
                  <Text fontWeight="bold">Notes:</Text>
                  {notes && <Notes notes={notes} />}
                </Box>
                <ConfirmDialog
                  isOpen={showDeleteDialog}
                  onClose={() => setShowDeleteDialog(false)}
                  onConfirm={confirmDelete}
                  isLoading={isDeleting}
                  confirmText={'Delete Project'}
                  cancelText="Cancel"
                  title="Delete Project"
                  message="Are you sure you want to delete this project?"
                />
                <FinishProjectDialog
                  isOpen={finishDialogOpen}
                  onClose={() => setFinishDialogOpen(false)}
                  onConfirm={handleFinishProject}
                  isLoading={isFinishing}
                  currentProjectName={name}
                />
              </Box>
            </>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </SidebarLayout>
  );
};

export default ProjectPage;
