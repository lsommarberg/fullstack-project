import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import SidebarLayout from './SidebarLayout';
import patternService from '../services/pattern';
import { toaster } from './ui/toaster';

const PatternForm = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tagsString.split(',').map((item) => item.trim());
    try {
      await patternService.createPattern({
        name,
        text,
        link,
        tags: tagsArray,
        notes,
      });
      toaster.success({
        description: 'Pattern created successfully',
        duration: 5000,
      });
      navigate(`/users/${id}`);
    } catch (error) {
      console.error('Error creating pattern:', error);
      toaster.error({ description: 'Error creating pattern', duration: 5000 });
    }
  };

  const handleCancel = () => {
    navigate(`/users/${id}`);
  };

  return (
    <SidebarLayout userId={id}>
      <Box p={5} shadow="md" borderWidth="1px" bg="box">
        <form onSubmit={handleSubmit}>
          <Fieldset.Root>
            <Stack spacing={4}>
              <Fieldset.Legend>Create a Pattern</Fieldset.Legend>
              <Fieldset.HelperText>
                Please provide details for your new pattern.
              </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              <Field label="Name" required>
                <Input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  width="100%"
                  bg={'secondaryBox'}
                />
              </Field>
              <Field label="Text" required>
                <Textarea
                  name="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  width="100%"
                  minHeight={200}
                  bg={'secondaryBox'}
                />
              </Field>
              <Field
                label="Link"
                helperText="Optional: Provide a link to the pattern."
              >
                <Input
                  name="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  width="100%"
                  bg={'secondaryBox'}
                />
              </Field>
              <Field
                label="Tags"
                helperText='Separate tags with a comma, e.g. "tag1, tag2"'
              >
                <Input
                  name="tags"
                  value={tagsString}
                  onChange={(e) => setTagsString(e.target.value)}
                  width="100%"
                  bg={'secondaryBox'}
                />
              </Field>
              <Field label="Notes">
                <Textarea
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  width="100%"
                  bg={'secondaryBox'}
                />
              </Field>
            </Fieldset.Content>
            <HStack>
              <Button colorScheme="gray" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="teal" name="Create Pattern">
                Create Pattern
              </Button>
            </HStack>
          </Fieldset.Root>
        </form>
      </Box>
    </SidebarLayout>
  );
};

export default PatternForm;
