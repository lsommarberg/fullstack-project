import { useEffect, useState } from 'react';
import { Text, Flex } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../../services/project';
import ListPage from '../layout/ListPage';

const ProjectsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProjectData = async () => {
      try {
        setIsLoading(true);
        const projects = await projectService.getProjects(id);
        const ongoingProjects = projects.filter(
          (project) => project.finishedAt === null,
        );
        setProjects(ongoingProjects);
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
      title="My Projects"
      items={projects}
      searchPlaceholder="Search projects..."
      createButtonText="Start New"
      createPath={`/projects/${id}/create`}
      renderItem={renderProjectItem}
      getItemPath={(project) => `/projects/${id}/${project.id}`}
      isLoading={isLoading}
      emptyStateText="No projects yet"
    />
  );
};

export default ProjectsList;
