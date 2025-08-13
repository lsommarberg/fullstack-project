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
  Text,
  VStack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import SidebarLayout from '../layout/SidebarLayout';
import RowTrackersSection from './RowTrackersSection';
import { PatternMenu } from './PatternSelectionMenu';
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
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tagsString, setTagsString] = useState('');

  useEffect(() => {
    const loadUserPatterns = async () => {
      try {
        setIsLoading(true);
        const userPatterns = await patternService.getPatterns(id);
        if (userPatterns) {
          setPatterns(userPatterns);
          if (patternFromState) {
            const preselectedPattern = userPatterns.find(
              (p) => p.id === patternFromState,
            );
            if (preselectedPattern) {
              setSelectedPattern(preselectedPattern);
              setNotes(preselectedPattern.notes || '');
              setName(preselectedPattern.name || '');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching patterns:', error);
        toaster.error({
          description: 'Failed to fetch patterns',
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadUserPatterns();
  }, [id, patternFromState]);

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

  const handlePatternSelect = (patternId) => {
    const pattern = patterns.find((p) => p.id === patternId);
    setSelectedPattern(pattern || null);
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
      const tagsArray = tagsString
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      await projectService.createProject({
        name,
        startedAt,
        rowTrackers: validRowTrackers,
        pattern: selectedPattern ? selectedPattern.id : null,
        notes,
        files: files,
        tags: tagsArray,
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
      <Box
        p={8}
        shadow="lg"
        borderWidth="1px"
        borderRadius="xl"
        bg="card.bg"
        color="fg.default"
      >
        <form onSubmit={handleSubmit}>
          <Fieldset.Root>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center" mb={2}>
                <Fieldset.Legend
                  fontSize="2xl"
                  fontWeight="bold"
                  color="fg.default"
                >
                  Create a New Project
                </Fieldset.Legend>
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <VStack spacing={4} align="stretch">
                  <Field label="Project Name" required>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter a name for your project"
                      required
                      size="lg"
                      bg="input.bg"
                      color="fg.default"
                      borderColor="input.border"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </Field>

                  <Field label="Started At" required>
                    <Input
                      type="date"
                      value={startedAt}
                      onChange={(e) => setStartedAt(e.target.value)}
                      required
                      size="lg"
                      bg="input.bg"
                      color="fg.default"
                      borderColor="input.border"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </Field>

                  <Field label="Pattern (optional)">
                    {isLoading ? (
                      <Text>Loading patterns...</Text>
                    ) : patterns.length > 0 ? (
                      <PatternMenu
                        onPatternSelect={handlePatternSelect}
                        patterns={patterns}
                        selectedPatternName={
                          selectedPattern ? selectedPattern.name : ''
                        }
                      />
                    ) : (
                      <Text
                        fontSize="sm"
                        color="fg.muted"
                        p={4}
                        bg={{ base: 'gray.100', _dark: 'gray.700' }}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="card.border"
                      >
                        No patterns available. You can create one first or start
                        without a pattern.
                      </Text>
                    )}
                  </Field>
                  <Field
                    label="Tags (optional)"
                    helperText="Separate tags with commas (e.g., knitting, scarf, beginner)"
                  >
                    <Input
                      name="tags"
                      value={tagsString}
                      onChange={(e) => setTagsString(e.target.value)}
                      placeholder="Tags separated by commas"
                      size="lg"
                      bg="input.bg"
                      color="fg.default"
                      borderColor="input.border"
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </Field>
                </VStack>
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <RowTrackersSection
                  rowTrackers={rowTrackers}
                  onAddTracker={addRowTracker}
                  onRemoveTracker={removeRowTracker}
                  onUpdateTracker={updateRowTracker}
                  isEditable={true}
                />
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Field helperText="Upload reference images, charts, or progress photos">
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
                    userId={id}
                  />
                </Field>
              </Box>

              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <Field label="Notes (optional)">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes, reminders, or special instructions for this project"
                    minH="120px"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                  />
                </Field>
              </Box>
            </VStack>

            <HStack mt={8} spacing={4} justify="center">
              <Button
                data-testid="create-project-button"
                type="submit"
                size="lg"
                colorScheme="blue"
                px={8}
                py={6}
                fontSize="md"
                fontWeight="semibold"
              >
                Create Project
              </Button>
              <Button
                onClick={() => navigate(-1)}
                bg={'cancelButton'}
                size="lg"
                px={8}
                py={6}
                fontSize="md"
              >
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
