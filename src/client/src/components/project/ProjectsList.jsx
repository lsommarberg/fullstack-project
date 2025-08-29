import { useEffect, useState } from 'react';
import {
  Text,
  Flex,
  Tabs,
  Link,
  Input,
  Button,
  Stack,
  Fieldset,
  HStack,
  VStack,
  Spacer,
} from '@chakra-ui/react';
import { Field } from '@/components/ui/field';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../../services/project';
import SidebarLayout from '../layout/SidebarLayout';
import { ListItem } from '../pattern/PatternsList';

export const ProjectsSearch = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  startedAfter,
  setStartedAfter,
  startedBefore,
  setStartedBefore,
  finishedAfter,
  setFinishedAfter,
  finishedBefore,
  setFinishedBefore,
  status,
  handleClearSearch,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <Flex mb={4} w="full" align="center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        style={{ width: '100%' }}
      >
        <Fieldset.Root>
          <VStack align="stretch" spacing={4}>
            <Field label="Search Projects">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                variant="input"
              />
            </Field>
            <Button
              variant="ghost"
              borderColor={'section.border'}
              size="sm"
              alignSelf="flex-start"
              onClick={() => setShowAdvanced((prev) => !prev)}
              mb={2}
            >
              {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </Button>
            {showAdvanced && (
              <>
                <HStack spacing={4}>
                  <Field label="Started Between">
                    <HStack>
                      <Input
                        type="date"
                        value={startedAfter}
                        onChange={(e) => setStartedAfter(e.target.value)}
                        borderColor={'input.border'}
                        data-testid="started-after-input"
                      />
                      <Input
                        type="date"
                        value={startedBefore}
                        onChange={(e) => setStartedBefore(e.target.value)}
                        borderColor={'input.border'}
                        data-testid="started-before-input"
                      />
                    </HStack>
                  </Field>
                </HStack>
                {status.value !== 'inprogress' && (
                  <HStack spacing={4}>
                    <Field label="Finished Between">
                      <HStack>
                        <Input
                          type="date"
                          value={finishedAfter}
                          onChange={(e) => setFinishedAfter(e.target.value)}
                          borderColor={'input.border'}
                          data-testid="finished-after-input"
                        />
                        <Input
                          type="date"
                          value={finishedBefore}
                          onChange={(e) => setFinishedBefore(e.target.value)}
                          borderColor={'input.border'}
                          data-testid="finished-before-input"
                        />
                      </HStack>
                    </Field>
                  </HStack>
                )}
              </>
            )}
            <HStack spacing={4} justify="flex-end">
              <Button
                variant="ghost"
                borderColor={'section.border'}
                onClick={handleClearSearch}
              >
                Clear Search
              </Button>
              <Button
                type="submit"
                variant="primary"
                data-testid="projects-search-button"
              >
                Search
              </Button>
            </HStack>
          </VStack>
        </Fieldset.Root>
      </form>
    </Flex>
  );
};

const ProjectsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startedAfter, setStartedAfter] = useState('');
  const [startedBefore, setStartedBefore] = useState('');
  const [finishedAfter, setFinishedAfter] = useState('');
  const [finishedBefore, setFinishedBefore] = useState('');
  const [status, setStatus] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);

  const handleClearSearch = () => {
    setSearchQuery('');
    setStartedAfter('');
    setStartedBefore('');
    setFinishedAfter('');
    setFinishedBefore('');
    setFilteredProjects([]);
    setHasSearched(false);
  };

  const getItemPath = (project) => `/projects/${id}/${project.id}`;

  useEffect(() => {
    const getProjectData = async () => {
      try {
        setIsLoading(true);
        const projects = await projectService.getProjects(id);
        setAllProjects(projects);
        setFilteredProjects([]);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };
    getProjectData();
  }, [id, navigate]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const result = await projectService.searchProjects({
        q: searchQuery,
        startedAfter,
        startedBefore,
        finishedAfter,
        finishedBefore,
      });
      setFilteredProjects(result);
      setHasSearched(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSearchActive = hasSearched;
  const projectsToShow = isSearchActive ? filteredProjects : allProjects;
  const inProgressProjects = projectsToShow.filter(
    (p) => p.finishedAt === null,
  );
  const finishedProjects = projectsToShow.filter((p) => p.finishedAt !== null);

  return (
    <SidebarLayout userId={id}>
      <Flex direction="column" p={6}>
        <HStack mb={4} justify="space-between" align="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            data-testid="projects-title"
          >
            My Projects
          </Text>
          <Spacer />
          <Button
            variant="secondary"
            onClick={() => navigate(`/projects/${id}/create`)}
          >
            Create New
          </Button>
        </HStack>
        <ProjectsSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          startedAfter={startedAfter}
          setStartedAfter={setStartedAfter}
          startedBefore={startedBefore}
          setStartedBefore={setStartedBefore}
          finishedAfter={finishedAfter}
          setFinishedAfter={setFinishedAfter}
          finishedBefore={finishedBefore}
          setFinishedBefore={setFinishedBefore}
          status={status}
          handleClearSearch={handleClearSearch}
        />
        <Tabs.Root defaultValue="all" onValueChange={setStatus}>
          <Tabs.List mb={4}>
            <Tabs.Trigger value="all" asChild>
              <Link unstyled href="#all">
                All
              </Link>
            </Tabs.Trigger>
            <Tabs.Trigger value="inprogress" asChild>
              <Link unstyled href="#inprogress">
                In progress
              </Link>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="finished"
              data-testid="projects-finished-tab"
              asChild
            >
              <Link unstyled href="#finished">
                Finished
              </Link>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="all" data-testid="projects-all-panel">
            <Stack spacing={4}>
              {isLoading ? (
                <Text>Loading...</Text>
              ) : projectsToShow.length === 0 ? (
                isSearchActive ? (
                  <Text>No results found</Text>
                ) : (
                  <Text>No projects yet</Text>
                )
              ) : (
                projectsToShow.map((project) => (
                  <ListItem
                    item={project}
                    key={project.id}
                    getItemPath={getItemPath}
                    finished={!!project.finishedAt}
                  />
                ))
              )}
            </Stack>
          </Tabs.Content>
          <Tabs.Content
            value="inprogress"
            data-testid="projects-inprogress-panel"
          >
            <Stack spacing={4}>
              {isLoading ? (
                <Text>Loading...</Text>
              ) : inProgressProjects.length === 0 ? (
                isSearchActive ? (
                  <Text>No results found</Text>
                ) : (
                  <Text>No in progress projects</Text>
                )
              ) : (
                inProgressProjects.map((project) => (
                  <ListItem
                    item={project}
                    key={project.id}
                    getItemPath={getItemPath}
                  />
                ))
              )}
            </Stack>
          </Tabs.Content>
          <Tabs.Content value="finished" data-testid="projects-finished-panel">
            <Stack spacing={4}>
              {isLoading ? (
                <Text>Loading...</Text>
              ) : finishedProjects.length === 0 ? (
                isSearchActive ? (
                  <Text>No results found</Text>
                ) : (
                  <Text>No finished projects</Text>
                )
              ) : (
                finishedProjects.map((project) => (
                  <ListItem
                    item={project}
                    key={project.id}
                    getItemPath={getItemPath}
                  />
                ))
              )}
            </Stack>
          </Tabs.Content>
        </Tabs.Root>
      </Flex>
    </SidebarLayout>
  );
};

export default ProjectsList;
