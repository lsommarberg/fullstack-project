import { useEffect, useState } from 'react';
import {
  Text,
  Flex,
  Tabs,
  Link,
  Stack,
  HStack,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../../services/project';
import SidebarLayout from '../layout/SidebarLayout';
import SearchBar from '../SearchBar';
import ListItem from '../ListItem';

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
        <SearchBar
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
          placeHolderText="Search projects..."
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
