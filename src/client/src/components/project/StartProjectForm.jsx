import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Input,
  Stack,
  Textarea,
  Box,
  HStack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import SidebarLayout from '../layout/SidebarLayout';
import RowTrackersSection from './RowTrackersSection';
import projectService from '../../services/project';
import patternService from '../../services/pattern';
import { toaster } from '../ui/toaster';
import ImageManager from '../ImageManager';

const ProjectForm = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [startedAt, setStartedAt] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const [rowTrackers, setRowTrackers] = useState([
    { section: '', currentRow: 0, totalRows: '' },
  ]);
  const [files, setFiles] = useState([]);
  const location = useLocation();
  const patternFromState = location.state?.patternId;

  useEffect(() => {
    if (patternFromState) {
      const fetchPattern = async () => {
        try {
          const patternData = await patternService.getPatternById(
            id,
            patternFromState,
          );
          setNotes(patternData.notes || '');
          setName(patternData.name || '');
        } catch (error) {
          console.error('Error fetching pattern:', error);
          toaster.error({
            description: 'Failed to fetch pattern',
            duration: 5000,
          });
        }
      };
      fetchPattern();
    }
  }, [patternFromState]);

  const addRowTracker = () => {
    setRowTrackers([
      ...rowTrackers,
      { section: '', currentRow: 0, totalRows: '' },
    ]);
  };

  const removeRowTracker = (index) => {
    if (rowTrackers.length > 1) {
      setRowTrackers(rowTrackers.filter((_, i) => i !== index));
    }
  };

  const updateRowTracker = (index, field, value) => {
    const updatedTrackers = rowTrackers.map((tracker, i) => {
      if (i === index) {
        return { ...tracker, [field]: value };
      }
      return tracker;
    });
    setRowTrackers(updatedTrackers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validRowTrackers = rowTrackers
        .filter((tracker) => tracker.section.trim() || tracker.totalRows)
        .map((tracker) => ({
          section: tracker.section.trim() || 'Main',
          currentRow: 0,
          totalRows: parseInt(tracker.totalRows) || 0,
        }));

      await projectService.createProject({
        name,
        startedAt,
        rowTrackers: validRowTrackers,
        pattern: patternFromState || null,
        notes,
        files: files,
      });
      toaster.success({
        description: 'Project created successfully',
        duration: 5000,
      });
      navigate(`/projects/${id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toaster.error({ description: 'Error creating project', duration: 5000 });
    }
  };

  const handleImageUpload = (uploadedImageUrl, fullResult) => {
    if (uploadedImageUrl === null) {
      return;
    }

    const newFile = {
      url: uploadedImageUrl,
      publicId: fullResult.publicId,
      uploadedAt: new Date(),
    };

    setFiles((prev) => [...prev, newFile]);
    toaster.success({
      description: 'Image uploaded successfully',
      duration: 3000,
    });
  };

  const handleImageDelete = (publicId) => {
    setFiles((prev) => prev.filter((file) => file.publicId !== publicId));
  };

  const handleImageError = (error) => {
    console.error('Image upload failed:', error);
    toaster.error({
      description: `Image upload failed: ${error}`,
      duration: 5000,
    });
  };

  return (
    <SidebarLayout userId={id}>
      <Box p={5} shadow="md" borderWidth="1px" bg="card.bg" color="fg.default">
        <form onSubmit={handleSubmit}>
          <Fieldset.Root>
            <Stack spacing={4}>
              <Fieldset.Legend>Create a Project</Fieldset.Legend>
              <Fieldset.HelperText>
                Fill in the details to create a new project.
              </Fieldset.HelperText>

              <Field label="Project Name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                  required
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                />
              </Field>

              <Field label="Started At">
                <Input
                  type="date"
                  value={startedAt}
                  onChange={(e) => setStartedAt(e.target.value)}
                  required
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                />
              </Field>

              <RowTrackersSection
                rowTrackers={rowTrackers}
                onAddTracker={addRowTracker}
                onRemoveTracker={removeRowTracker}
                onUpdateTracker={updateRowTracker}
                isEditable={true}
              />
              <Field
                label="Project Images"
                helperText="Upload images for your project (optional)"
              >
                <ImageManager
                  files={files}
                  headerText="Project Images"
                  showUpload={true}
                  showDelete={true}
                  type="projects"
                  onImageUpload={handleImageUpload}
                  onImageDelete={handleImageDelete}
                  onUploadError={handleImageError}
                  buttonText="Upload Project Image"
                  itemType="project"
                />
              </Field>
              <Field label="Notes (optional)">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes for the project"
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                />
              </Field>
            </Stack>

            <HStack mt={4} spacing={4}>
              <Button data-testid="create-project-button" type="submit">
                Create Project
              </Button>
              <Button onClick={() => navigate(-1)} bg="cancelButton">
                Cancel
              </Button>
            </HStack>
          </Fieldset.Root>
        </form>
      </Box>
    </SidebarLayout>
  );
};

export default ProjectForm;
