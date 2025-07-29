import { useEffect, useState } from 'react';
import { Text, Flex } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../../services/project';
import ListPage from '../layout/ListPage';

const FinishedProjectsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProjectData = async () => {
      try {
        setIsLoading(true);
        const projects = await projectService.getProjects(id);
        const finishedProjects = projects.filter(
          (project) => project.finishedAt !== null,
        );

        setProjects(finishedProjects);
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

  const renderProjectItem = (project) => (
    <Flex justify="space-between" align="center">
      <Text fontSize="lg" fontWeight="bold">
        {project.name}
      </Text>
    </Flex>
  );

  return (
    <ListPage
      userId={id}
      title="Finished Projects"
      items={projects}
      searchPlaceholder="Search finished projects..."
      createButtonText="Start New"
      createPath={`/projects/${id}/create`}
      renderItem={renderProjectItem}
      getItemPath={(project) => `/projects/${id}/${project.id}`}
      isLoading={isLoading}
      emptyStateText="No finished projects yet"
    />
  );
};

export default FinishedProjectsList;
