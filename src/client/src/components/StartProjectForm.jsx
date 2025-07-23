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
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import SidebarLayout from './SidebarLayout';
import projectService from '../services/project';
import patternService from '../services/pattern';
import { toaster } from './ui/toaster';

const ProjectForm = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const [pattern, setPattern] = useState(null);

  const location = useLocation();
  const patternFromState = location.state?.patternId;

  useEffect(() => {
    if (patternFromState) {
      const fetchPattern = async () => {
        try {
          const patternData = await patternService.getPatternById(
            id,
            patternFromState,
          );
          setPattern(patternData);
          setNotes(patternData.notes || '');
        } catch (error) {
          console.error('Error fetching pattern:', error);
          toaster.error({
            description: 'Failed to fetch pattern',
            duration: 5000,
          });
        }
      };
      fetchPattern();
    }
  }, [patternFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.createProject({
        name,
        startedAt,
        pattern,
        notes,
      });
      toaster.success({
        description: 'Project created successfully',
        duration: 5000,
      });
      navigate(`/users/${id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toaster.error({ description: 'Error creating project', duration: 5000 });
    }
  };

  return (
    <SidebarLayout userId={id}>
      <Box p={5} shadow="md" borderWidth="1px" bg="card.bg" color="fg.default">
        <form onSubmit={handleSubmit}>
          <Fieldset.Root>
            <Stack spacing={4}>
              <Fieldset.Legend>Create a Project</Fieldset.Legend>
              <Fieldset.HelperText>
                Fill in the details to create a new project.
              </Fieldset.HelperText>
              <Field label="Project Name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name"
                  required
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                />
              </Field>
              <Field label="Started At">
                <Input
                  type="date"
                  value={startedAt}
                  onChange={(e) => setStartedAt(e.target.value)}
                  required
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                />
              </Field>
              <Field label="Notes (optional)">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes for the project"
                  bg="input.bg"
                  color="fg.default"
                  borderColor="input.border"
                />
              </Field>
            </Stack>
            <HStack mt={4} spacing={4}>
              <Button type="submit">Create Project</Button>
              <Button onClick={() => navigate(-1)} bg="cancelButton">
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
