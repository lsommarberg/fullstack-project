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
  VStack,
  Text,
  IconButton,
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
  const [rowTrackers, setRowTrackers] = useState([
    { section: '', currentRow: 0, totalRows: '' },
  ]);

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
          setNotes(patternData.notes || '');
          setName(patternData.name || '');
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

  const addRowTracker = () => {
    setRowTrackers([
      ...rowTrackers,
      { section: '', currentRow: 0, totalRows: '' },
    ]);
  };

  const removeRowTracker = (index) => {
    if (rowTrackers.length > 1) {
      setRowTrackers(rowTrackers.filter((_, i) => i !== index));
    }
  };

  const updateRowTracker = (index, field, value) => {
    const updatedTrackers = rowTrackers.map((tracker, i) => {
      if (i === index) {
        return { ...tracker, [field]: value };
      }
      return tracker;
    });
    setRowTrackers(updatedTrackers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validRowTrackers = rowTrackers
        .filter((tracker) => tracker.section.trim() || tracker.totalRows)
        .map((tracker) => ({
          section: tracker.section.trim() || 'Main',
          currentRow: 0,
          totalRows: parseInt(tracker.totalRows) || 0,
        }));

      await projectService.createProject({
        name,
        startedAt,
        rowTrackers: validRowTrackers,
        pattern: patternFromState || null,
        notes,
      });
      toaster.success({
        description: 'Project created successfully',
        duration: 5000,
      });
      navigate(`/projects/${id}`);
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

              <Box>
                <HStack justify="space-between" align="center" mb={3}>
                  <Text fontWeight="semibold">Row Trackers (optional)</Text>
                  <Button size="sm" onClick={addRowTracker}>
                    Add Section
                  </Button>
                </HStack>

                <VStack spacing={3} align="stretch">
                  {rowTrackers.map((tracker, index) => (
                    <Box
                      key={index}
                      p={3}
                      border="1px solid"
                      borderColor="input.border"
                      borderRadius="md"
                      bg="input.bg"
                    >
                      <HStack spacing={3} align="end">
                        <Field label="Section Name" flex="1">
                          <Input
                            value={tracker.section}
                            onChange={(e) =>
                              updateRowTracker(index, 'section', e.target.value)
                            }
                            placeholder="e.g., Body, Sleeves, etc."
                            bg="card.bg"
                            color="fg.default"
                            borderColor="input.border"
                            size="sm"
                          />
                        </Field>

                        <Field label="Total Rows" width="120px">
                          <Input
                            type="number"
                            value={tracker.totalRows}
                            onChange={(e) =>
                              updateRowTracker(
                                index,
                                'totalRows',
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            bg="card.bg"
                            color="fg.default"
                            borderColor="input.border"
                            size="sm"
                            min="0"
                          />
                        </Field>

                        {rowTrackers.length > 1 && (
                          <IconButton
                            size="sm"
                            onClick={() => removeRowTracker(index)}
                            bg="deleteButton"
                            color="white"
                            _hover={{ opacity: 0.8 }}
                          >
                            ×
                          </IconButton>
                        )}
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>

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
