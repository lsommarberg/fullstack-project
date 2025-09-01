import { render, screen, fireEvent, waitFor } from './test-utils';
import ProjectForm from '../components/project/StartProjectForm';
import projectService from '../services/project';
import { useNavigate, useParams } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';

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

describe('ProjectForm', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: '1' });
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<ProjectForm />);
    expect(screen.getByText(/Create a New Project/i)).toBeInTheDocument();
    expect(screen.getByText(/Project Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Started At/i)).toBeInTheDocument();
    expect(screen.getByText(/Notes/i)).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    projectService.createProject.mockResolvedValue({});

    render(<ProjectForm />);

    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'Test Project' },
    });
    fireEvent.change(screen.getByLabelText(/Started At/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: 'This is a test project.' },
    });

    fireEvent.click(screen.getByTestId('create-project-button'));

    await waitFor(() => {
      expect(projectService.createProject).toHaveBeenCalledWith({
        name: 'Test Project',
        startedAt: '2024-01-01',
        notes: 'This is a test project.',
        pattern: null,
        rowTrackers: [],
        files: [],
        tags: [],
      });
      expect(mockNavigate).toHaveBeenCalledWith('/projects/1');
      expect(toaster.success).toHaveBeenCalledWith({
        description: 'Project created successfully',
        duration: 5000,
      });
    });
  });

  test('handles form submission error', async () => {
    projectService.createProject.mockRejectedValue(new Error('Network Error'));

    render(<ProjectForm />);

    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: 'Test Project' },
    });
    fireEvent.change(screen.getByLabelText(/Started At/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: 'This is a test project.' },
    });

    fireEvent.click(screen.getByTestId('create-project-button'));

    await waitFor(() => {
      expect(toaster.error).toHaveBeenCalledWith({
        description: 'Error creating project',
        duration: 5000,
      });
    });
  });

  test('validates required fields', async () => {
    render(<ProjectForm />);

    fireEvent.click(screen.getByTestId('create-project-button'));

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Project Name/i);
      expect(nameInput).toBeInvalid();
      expect(nameInput.validationMessage).toBe('Constraints not satisfied');
    });
  });

  test('navigates back on cancel', () => {
    render(<ProjectForm />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
