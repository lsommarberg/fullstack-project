import React from 'react';
import { Box, Textarea, Input, Button } from '@chakra-ui/react';

const EditPattern = ({ name, text, link, tags, notes, onSave, onCancel }) => {
  const [editableName, setEditableName] = React.useState(name);
  const [editableText, setEditableText] = React.useState(text);
  const [editableLink, setEditableLink] = React.useState(link);
  const [editableTags, setEditableTags] = React.useState(tags.join(', '));
  const [editableNotes, setEditableNotes] = React.useState(notes);

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
    <Box p={5} shadow="md" borderWidth="1px">
      <Input
        value={editableName}
        onChange={(e) => setEditableName(e.target.value)}
        mb={4}
        placeholder="Name"
      />
      <Textarea
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        rows={10}
        cols={50}
        mb={4}
        placeholder="Text"
      />
      <Input
        value={editableLink}
        onChange={(e) => setEditableLink(e.target.value)}
        mb={4}
        placeholder="Link"
      />
      <Input
        value={editableTags}
        onChange={(e) => setEditableTags(e.target.value)}
        mb={4}
        placeholder="Tags (comma separated)"
      />
      <Textarea
        value={editableNotes}
        onChange={(e) => setEditableNotes(e.target.value)}
        rows={5}
        cols={50}
        mb={4}
        placeholder="Notes"
      />
      <Button colorScheme="teal" onClick={handleSave} mr={2}>
        Save
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Box>
  );
};

export default EditPattern;
