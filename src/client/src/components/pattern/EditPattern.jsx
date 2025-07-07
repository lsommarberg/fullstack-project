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
    <Box p={5} shadow="md" borderWidth="1px" bg="box">
      <Input
        value={editableName}
        onChange={(e) => setEditableName(e.target.value)}
        mb={4}
        placeholder="Name"
        bg={'secondaryBox'}
        borderColor={'gray.200'}
      />
      <Textarea
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        rows={10}
        cols={50}
        mb={4}
        placeholder="Text"
        bg={'secondaryBox'}
        borderColor={'gray.200'}
      />
      <Input
        value={editableLink}
        onChange={(e) => setEditableLink(e.target.value)}
        mb={4}
        placeholder="Link"
        bg={'secondaryBox'}
        borderColor={'gray.200'}
      />
      <Input
        value={editableTags}
        onChange={(e) => setEditableTags(e.target.value)}
        mb={4}
        placeholder="Tags (comma separated)"
        bg={'secondaryBox'}
        borderColor={'gray.200'}
      />
      <Textarea
        value={editableNotes}
        onChange={(e) => setEditableNotes(e.target.value)}
        rows={5}
        cols={50}
        mb={4}
        placeholder="Notes"
        bg={'secondaryBox'}
        borderColor={'gray.200'}
      />
      <Button onClick={handleSave} mr={2}>
        Save
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Box>
  );
};

export default EditPattern;
