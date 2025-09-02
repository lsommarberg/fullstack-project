import { useState } from 'react';
import {
  Box,
  Textarea,
  Input,
  Button,
  Fieldset,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import ImageManager from '../ImageManager';
import useUnsavedChangesWarning from '../../hooks/useUnSavedChangesWarning';

/**
 * Pattern editing form component with unsaved changes warning and comprehensive pattern management.
 * Allows editing of pattern name, instructions, external links, tags, notes, and associated images.
 * Provides save/cancel functionality with automatic change detection to warn about unsaved changes.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.name - Current pattern name
 * @param {string} props.text - Current pattern instructions/text
 * @param {string} props.link - External link to pattern source
 * @param {Array} props.tags - Pattern tags array
 * @param {string} props.notes - Pattern notes
 * @param {Array} props.files - Pattern image files
 * @param {Function} props.onSave - Callback function when pattern is saved
 * @param {Function} props.onCancel - Callback function when editing is cancelled
 * @param {string} props.userId - Current user ID
 * @param {string} props.patternId - ID of the pattern being edited
 * @returns {JSX.Element} Comprehensive pattern editing form with change detection
 */
const EditPattern = ({
  name,
  text,
  link,
  tags,
  notes,
  files = [],
  onSave,
  onCancel,
  userId,
  patternId,
}) => {
  const [editableName, setEditableName] = useState(name);
  const [editableText, setEditableText] = useState(text);
  const [editableLink, setEditableLink] = useState(link);
  const [editableTags, setEditableTags] = useState(tags.join(', '));
  const [editableNotes, setEditableNotes] = useState(notes);
  const [patternFiles, setPatternFiles] = useState(files || []);

  const hasUnsavedChanges =
    editableName !== name ||
    editableText !== text ||
    editableLink !== link ||
    editableTags !== tags.join(', ') ||
    editableNotes !== notes;
  useUnsavedChangesWarning(hasUnsavedChanges);

  const handleSave = (e) => {
    e?.preventDefault();
    onSave({
      name: editableName,
      text: editableText,
      link: editableLink,
      tags: editableTags.split(',').map((tag) => tag.trim()),
      notes: editableNotes,
      files: patternFiles,
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

    setPatternFiles((prev) => [...prev, newFile]);
  };

  const handleImageDelete = (publicId) => {
    setPatternFiles((prev) =>
      prev.filter((file) => file.publicId !== publicId),
    );
  };

  return (
    <Box
      p={8}
      shadow="lg"
      borderWidth="1px"
      borderRadius="xl"
      bg="cardPattern.bg"
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
                Edit Pattern
              </Fieldset.Legend>
              <Fieldset.HelperText fontSize="md" color="fg.muted" mt={2}>
                Update your pattern details and instructions
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
                <Field label="Pattern Name" required>
                  <Input
                    value={editableName}
                    onChange={(e) => setEditableName(e.target.value)}
                    placeholder="Enter a name for your pattern"
                    size="lg"
                    variant="input"
                    data-testid="pattern-name-input"
                  />
                </Field>

                <Field label="Pattern Link (optional)">
                  <Input
                    value={editableLink}
                    onChange={(e) => setEditableLink(e.target.value)}
                    placeholder="Link to pattern source or website"
                    size="lg"
                    variant="input"
                  />
                </Field>

                <Field label="Tags (optional)">
                  <Input
                    value={editableTags}
                    onChange={(e) => setEditableTags(e.target.value)}
                    placeholder="Tags separated by commas (e.g., knitting, scarf, beginner)"
                    size="lg"
                    variant="input"
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
              <Field label="Pattern Instructions">
                <Textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  minH="200px"
                  placeholder="Enter detailed pattern instructions, stitch counts, and step-by-step directions"
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                  _focus={{
                    borderColor: 'input.borderFocus',
                    boxShadow: '0 0 0 1px input.borderFocus',
                  }}
                  data-testid="pattern-textarea"
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
              <Field label="Pattern Images">
                <ImageManager
                  files={patternFiles}
                  headerText="Pattern Images"
                  showUpload={true}
                  showDelete={true}
                  type="patterns"
                  onImageUpload={handleImageUpload}
                  onImageDelete={handleImageDelete}
                  onUploadError={(error) =>
                    console.error('Upload error:', error)
                  }
                  buttonText="Add Pattern Image"
                  itemType="pattern"
                  userId={userId}
                  itemId={patternId}
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
              <Field label="Additional Notes (optional)">
                <Textarea
                  value={editableNotes}
                  onChange={(e) => setEditableNotes(e.target.value)}
                  minH="120px"
                  placeholder="Add any additional notes, modifications, or personal reminders about this pattern"
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                  _focus={{
                    borderColor: 'input.borderFocus',
                    boxShadow: '0 0 0 1px input.borderFocus',
                  }}
                />
              </Field>
            </Box>

            <HStack mt={8} spacing={4} justify="center">
              <Button onClick={onCancel} size="xl" variant="cancel">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                size="xl"
                variant="primary"
                data-testid="save-button"
                aria-label="Save pattern changes"
              >
                Save Changes
              </Button>
            </HStack>
          </VStack>
        </Fieldset.Root>
      </form>
    </Box>
  );
};

export default EditPattern;
