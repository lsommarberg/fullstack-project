import { render, screen, fireEvent, waitFor } from './test-utils';
import { useParams, useNavigate } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';
import ProjectPage from '../components/project/ProjectPage';
import projectService from '../services/project';

jest.mock('../services/project');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('@/components/ui/toaster', () => ({
  toaster: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const getMockProject = () => ({
  name: 'Test Project',
  startedAt: '2023-10-01T00:00:00.000Z',
  pattern: {
    id: '1',
    name: 'Test Pattern',
  },
  notes: 'This is a test project.',
  rowTrackers: [
    { section: 'Body', currentRow: 10, totalRows: 50 },
    { section: 'Sleeve', currentRow: 5, totalRows: 20 },
  ],
});

jest.mock('react-markdown', () => (props) => <div {...props} />);

describe('ProjectPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: 'user123', projectId: 'project456' });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockProjectData = {
    name: 'Test Scarf Project',
    startedAt: '2024-01-15T00:00:00.000Z',
    pattern: {
      id: 'pattern123',
      name: 'Basic Scarf Pattern',
    },
    notes: 'This is a test project',
    rowTrackers: [{ section: 'Body', currentRow: 25, totalRows: 100 }],
  };

  test('renders project data correctly', async () => {
    projectService.getProjectById.mockResolvedValue(mockProjectData);

    render(<ProjectPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Scarf Project')).toBeInTheDocument();
    });

    expect(screen.getByText('Basic Scarf Pattern')).toBeInTheDocument();
    expect(screen.getByText(/This is a test project/)).toBeInTheDocument();
  });

  test('handles project deletion', async () => {
    projectService.getProjectById.mockResolvedValue(getMockProject());
    projectService.deleteProject.mockResolvedValue({});

    render(<ProjectPage />);

    await waitFor(() => {
      expect(screen.getByText('Delete Project')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Project'));

    await waitFor(() => {
      expect(
        screen.getByText('Are you sure you want to delete this project?'),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(projectService.deleteProject).toHaveBeenCalledWith(
        'user123',
        'project456',
      );
      expect(toaster.success).toHaveBeenCalledWith({
        description: 'Project deleted successfully',
      });
    });
  });

  test('updates row tracker values', async () => {
    projectService.getProjectById.mockResolvedValue(mockProjectData);
    projectService.updateProject.mockResolvedValue({});

    render(<ProjectPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    });

    const currentRowInput = screen.getByDisplayValue('25');
    fireEvent.change(currentRowInput, { target: { value: '30' } });

    await waitFor(() => {
      expect(projectService.updateProject).toHaveBeenCalled();
    });
  });

  test('handles API error on project load', async () => {
    projectService.getProjectById.mockRejectedValue(new Error('API Error'));

    render(<ProjectPage />);

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Project')).not.toBeInTheDocument();
    });
  });

  test('handles edit project', async () => {
    projectService.getProjectById.mockResolvedValue(getMockProject());
    projectService.updateProject.mockResolvedValue(getMockProject());

    render(<ProjectPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Project'));

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Project Name'), {
      target: { value: 'Updated Project' },
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.getByText('Updated Project')).toBeInTheDocument();
    });
  });
});
