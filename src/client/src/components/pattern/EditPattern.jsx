import { useState } from 'react';
import { Box, Textarea, Input, Button } from '@chakra-ui/react';

const EditPattern = ({ name, text, link, tags, notes, onSave, onCancel }) => {
  const [editableName, setEditableName] = useState(name);
  const [editableText, setEditableText] = useState(text);
  const [editableLink, setEditableLink] = useState(link);
  const [editableTags, setEditableTags] = useState(tags.join(', '));
  const [editableNotes, setEditableNotes] = useState(notes);

  const handleSave = () => {
    onSave({
      name: editableName,
      text: editableText,
      link: editableLink,
      tags: editableTags.split(',').map((tag) => tag.trim()),
      notes: editableNotes,
    });
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
      <Button onClick={handleSave} mr={2}>
        Save
      </Button>
      <Button bg="cancelButton" onClick={onCancel}>
        Cancel
      </Button>
    </Box>
  );
};

export default EditPattern;
