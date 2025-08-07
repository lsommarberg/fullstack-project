import { useEffect, useState } from 'react';
import {
  Box,
  Textarea,
  Input,
  Button,
  Fieldset,
  Stack,
  Text,
} from '@chakra-ui/react';
import RowTrackersSection from './RowTrackersSection';
import { Field } from '@/components/ui/field';
import { PatternMenu } from '../PatternSelectionDialog';
import patternService from '../../services/pattern';
import ImageManager from '../ImageManager';

const EditProject = ({
  name,
  notes,
  pattern,
  files,
  rowTrackers,
  onSave,
  userId,
  onCancel,
  handleImageDelete,
}) => {
  const [projectName, setProjectName] = useState(name);
  const [projectNotes, setProjectNotes] = useState(notes);
  const [rowTrackersState, setRowTrackersState] = useState(rowTrackers);
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
    onSave({
      name: projectName,
      notes: projectNotes,
      rowTrackers: rowTrackersState,
      pattern: selectedPattern,
      files: projectFiles,
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
    <Box p={5} shadow="md" borderWidth="1px" bg="card.bg" color="fg.default">
      <form onSubmit={handleSave}>
        <Fieldset.Root>
          <Stack spacing={4}>
            <Fieldset.Legend>Edit Project</Fieldset.Legend>
            <Fieldset.HelperText>
              Update your project details
            </Fieldset.HelperText>

            <Field label="Project Name">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                bg="input.bg"
                color="fg.default"
                borderColor="input.border"
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
                <Text fontSize="sm" color="gray.500">
                  No patterns available. You can create one first or start
                  without a pattern.
                </Text>
              )}
            </Field>
            <Field label="Images">
              <ImageManager
                files={projectFiles}
                headerText="Project Images"
                showUpload={true}
                showDelete={true}
                type="projects"
                onImageUpload={handleImageUpload}
                onImageDelete={handleImageDeleteLocal}
                onUploadError={(error) => console.error('Upload error:', error)}
                buttonText="Add Project Image"
                itemType="project"
              />
            </Field>
            <RowTrackersSection
              rowTrackers={rowTrackersState}
              onAddTracker={addRowTracker}
              onRemoveTracker={removeRowTracker}
              onUpdateTracker={updateRowTracker}
              isEditable={true}
            />

            <Field label="Notes">
              <Textarea
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                placeholder="Add notes about your project"
                bg="input.bg"
                color="fg.default"
                borderColor="input.border"
              />
            </Field>

            <Button type="submit" onClick={handleSave}>
              Save Changes
            </Button>
            <Button bg="cancelButton" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </Fieldset.Root>
      </form>
    </Box>
  );
};

export default EditProject;
