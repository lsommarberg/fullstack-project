import { useState } from 'react';
import { Box, Textarea, Input, Button } from '@chakra-ui/react';
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

  const handleSave = () => {
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
    <Box p={5} shadow="md" borderWidth="1px" bg="card.bg" color="fg.default">
      <Input
        value={editableName}
        onChange={(e) => setEditableName(e.target.value)}
        mb={4}
        placeholder="Name"
        bg="input.bg"
        color="fg.default"
        borderColor="input.border"
        data-testid="pattern-name-input"
      />
      <Textarea
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        rows={10}
        cols={50}
        mb={4}
        placeholder="Text"
        bg="input.bg"
        color="fg.default"
        borderColor="input.border"
        data-testid="pattern-textarea"
      />
      <Input
        value={editableLink}
        onChange={(e) => setEditableLink(e.target.value)}
        mb={4}
        placeholder="Link"
        bg="input.bg"
        color="fg.default"
        borderColor="input.border"
      />
      <Input
        value={editableTags}
        onChange={(e) => setEditableTags(e.target.value)}
        mb={4}
        placeholder="Tags (comma separated)"
        bg="input.bg"
        color="fg.default"
        borderColor="input.border"
      />
      <Textarea
        value={editableNotes}
        onChange={(e) => setEditableNotes(e.target.value)}
        rows={5}
        cols={50}
        mb={4}
        placeholder="Notes"
        bg="input.bg"
        color="fg.default"
        borderColor="input.border"
      />

      <Box mb={4}>
        <ImageManager
          files={patternFiles}
          headerText="Pattern Images"
          showUpload={true}
          showDelete={true}
          type="patterns"
          onImageUpload={handleImageUpload}
          onImageDelete={handleImageDelete}
          onUploadError={(error) => console.error('Upload error:', error)}
          buttonText="Add Pattern Image"
          itemType="pattern"
          userId={userId}
        />
      </Box>

      <Button onClick={handleSave} data-testid="save-button" mr={2}>
        Save
      </Button>
      <Button bg="cancelButton" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
};

export default EditPattern;
