import { useEffect, useState } from 'react';
import { Text, Flex, Stack, Spacer, Button, HStack } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../../services/project';
import SidebarLayout from '../layout/SidebarLayout';
import { ListItem } from '../pattern/PatternsList';
import { ProjectsSearch } from './ProjectsList';

const FinishedProjectsList = () => {
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
        const finishedProjects = projects.filter((p) => p.finishedAt !== null);
        setAllProjects(finishedProjects);
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
      setFilteredProjects(result.filter((p) => p.finishedAt !== null));
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

  return (
    <SidebarLayout userId={id}>
      <Flex direction="column" p={6}>
        <HStack mb={4} justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Finished Projects
          </Text>
          <Spacer />
          <Button onClick={() => navigate(`/projects/${id}/create`)}>
            Start New
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
          status={{ value: 'finished' }}
          handleClearSearch={handleClearSearch}
        />
        <Stack spacing={4}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : projectsToShow.length === 0 ? (
            isSearchActive ? (
              <Text>No results found</Text>
            ) : (
              <Text>No finished projects yet</Text>
            )
          ) : (
            projectsToShow.map((project) => (
              <ListItem
                item={project}
                key={project.id}
                getItemPath={getItemPath}
                status={{ value: 'finished' }}
              />
            ))
          )}
        </Stack>
      </Flex>
    </SidebarLayout>
  );
};

export default FinishedProjectsList;
