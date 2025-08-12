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
}) => {
  const [editableName, setEditableName] = useState(name);
  const [editableText, setEditableText] = useState(text);
  const [editableLink, setEditableLink] = useState(link);
  const [editableTags, setEditableTags] = useState(tags.join(', '));
  const [editableNotes, setEditableNotes] = useState(notes);
  const [patternFiles, setPatternFiles] = useState(files || []);

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
                    bg="input.bg"
                    color="fg.default"
                    borderColor="input.border"
                    _focus={{
                      borderColor: 'blue.400',
                      boxShadow: '0 0 0 1px blue.400',
                    }}
                    data-testid="pattern-name-input"
                  />
                </Field>

                <Field label="Pattern Link (optional)">
                  <Input
                    value={editableLink}
                    onChange={(e) => setEditableLink(e.target.value)}
                    placeholder="Link to pattern source or website"
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

                <Field label="Tags (optional)">
                  <Input
                    value={editableTags}
                    onChange={(e) => setEditableTags(e.target.value)}
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
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px blue.400',
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
              <Field>
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
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px blue.400',
                  }}
                />
              </Field>
            </Box>

            <HStack mt={8} spacing={4} justify="center">
              <Button
                onClick={handleSave}
                size="lg"
                colorScheme="blue"
                px={8}
                py={6}
                fontSize="md"
                fontWeight="semibold"
                data-testid="save-button"
              >
                Save
              </Button>
              <Button
                onClick={onCancel}
                size="lg"
                px={8}
                py={6}
                fontSize="md"
                bg={'cancelButton'}
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

export default EditPattern;
