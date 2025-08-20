import { useEffect, useState } from 'react';
import {
  Box,
  Textarea,
  Input,
  Button,
  Fieldset,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import RowTrackersSection from './RowTrackersSection';
import { Field } from '@/components/ui/field';
import { PatternMenu } from './PatternSelectionMenu';
import patternService from '../../services/pattern';
import ImageManager from '../ImageManager';

const EditProject = ({
  name,
  notes,
  pattern,
  files,
  rowTrackers,
  tags,
  onSave,
  userId,
  onCancel,
  handleImageDelete,
  isFinished,
}) => {
  const [projectName, setProjectName] = useState(name);
  const [projectNotes, setProjectNotes] = useState(notes);
  const [rowTrackersState, setRowTrackersState] = useState(rowTrackers);
  const [projectTags, setProjectTags] = useState(tags.join(', '));
  const [projectFiles, setProjectFiles] = useState(files || []);
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(pattern);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserPatterns = async () => {
      try {
        setIsLoading(true);
        const userPatterns = await patternService.getPatterns(userId);
        if (userPatterns) {
          setPatterns(userPatterns);
        }
      } catch (error) {
        console.error('Error fetching patterns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserPatterns();
  }, [userId]);

  const handleSave = () => {
    const validRowTrackers = rowTrackersState
      .filter((tracker) => {
        return tracker.section.trim() || tracker.totalRows;
      })
      .map((tracker) => ({
        ...tracker,
        section: tracker.section.trim() || 'Main',
        totalRows: parseInt(tracker.totalRows) || 0,
      }));

    onSave({
      name: projectName,
      notes: projectNotes,
      rowTrackers: validRowTrackers,
      pattern: selectedPattern,
      files: projectFiles,
      tags: projectTags.split(',').map((tag) => tag.trim()),
    });
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

    setProjectFiles((prev) => [...prev, newFile]);
  };

  const addRowTracker = () => {
    setRowTrackersState([
      ...rowTrackersState,
      { section: '', currentRow: 0, totalRows: '' },
    ]);
  };

  const removeRowTracker = (index) => {
    setRowTrackersState(rowTrackersState.filter((_, i) => i !== index));
  };

  const updateRowTracker = (index, field, value) => {
    const updatedTrackers = rowTrackersState.map((tracker, i) =>
      i === index ? { ...tracker, [field]: value } : tracker,
    );
    setRowTrackersState(updatedTrackers);
  };

  const handlePatternSelect = (id) => {
    const selectedPattern = patterns.find((p) => p.id === id);
    setSelectedPattern(selectedPattern);
  };

  const handleImageDeleteLocal = (publicId) => {
    setProjectFiles((prevFiles) =>
      prevFiles.filter((file) => file.publicId !== publicId),
    );
    handleImageDelete(publicId);
  };

  return (
    <Box
      p={8}
      shadow="lg"
      borderWidth="1px"
      borderRadius="xl"
      bg="card.bg"
      color="fg.default"
    >
      <form onSubmit={handleSave}>
        <Fieldset.Root>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center" mb={2}>
              <Fieldset.Legend
                fontSize="2xl"
                fontWeight="bold"
                color="fg.default"
              >
                Edit Project
              </Fieldset.Legend>
              <Fieldset.HelperText fontSize="md" color="fg.muted" mt={2}>
                Update your project details and settings
              </Fieldset.HelperText>
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
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    size="lg"
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                    data-testid="project-name-input"
                  />
                </Field>

                <Field label="Pattern">
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
              </VStack>
            </Box>
            <Field label="Tags (optional)">
              <Input
                value={projectTags}
                onChange={(e) => setProjectTags(e.target.value)}
                placeholder="Tags separated by commas (e.g., knitting, scarf, beginner)"
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

            <Box
              p={6}
              bg="section.bg"
              borderRadius="lg"
              border="1px solid"
              borderColor="section.border"
              shadow="sm"
            >
              <Field>
                <ImageManager
                  files={projectFiles}
                  headerText="Project Images"
                  showUpload={true}
                  showDelete={true}
                  type="projects"
                  onImageUpload={handleImageUpload}
                  onImageDelete={handleImageDeleteLocal}
                  onUploadError={(error) =>
                    console.error('Upload error:', error)
                  }
                  buttonText="Add Project Image"
                  itemType="project"
                  userId={userId}
                />
              </Field>
            </Box>

            {!isFinished && (
              <Box
                p={6}
                bg="section.bg"
                borderRadius="lg"
                border="1px solid"
                borderColor="section.border"
                shadow="sm"
              >
                <RowTrackersSection
                  rowTrackers={rowTrackersState}
                  onAddTracker={addRowTracker}
                  onRemoveTracker={removeRowTracker}
                  onUpdateTracker={updateRowTracker}
                  isEditable={true}
                />
              </Box>
            )}

            <Box
              p={6}
              bg="section.bg"
              borderRadius="lg"
              border="1px solid"
              borderColor="section.border"
              shadow="sm"
            >
              <Field label="Notes">
                <Textarea
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Add notes about your project"
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

            <HStack mt={8} spacing={4} justify="center">
              <Button
                type="submit"
                onClick={handleSave}
                size="lg"
                colorScheme="blue"
                px={8}
                py={6}
                fontSize="md"
                fontWeight="semibold"
              >
                Save Changes
              </Button>
              <Button
                onClick={onCancel}
                bg={'cancelButton'}
                size="lg"
                px={8}
                py={6}
                fontSize="md"
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Fieldset.Root>
      </form>
    </Box>
  );
};

export default EditProject;
