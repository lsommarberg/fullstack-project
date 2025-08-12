import { render, screen, fireEvent, waitFor } from './test-utils';
import PatternForm from '../components/pattern/CreatePattern';
import patternService from '../services/pattern';
import { useNavigate, useParams } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';

jest.mock('../services/pattern');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../services/pattern');
jest.mock('@/components/ui/toaster', () => ({
  toaster: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('PatternForm', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: '1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<PatternForm />);
    expect(screen.getByText(/Create a New Pattern/i)).toBeInTheDocument();
    expect(screen.getByText(/Pattern Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Pattern Instructions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pattern Link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByText(/Additional Notes/i)).toBeInTheDocument();
  });

  test('submits the form successfully', async () => {
    patternService.createPattern.mockResolvedValue({});

    render(<PatternForm />);

    fireEvent.change(screen.getByLabelText(/Pattern Name/i), {
      target: { value: 'Test Pattern' },
    });
    fireEvent.change(screen.getByLabelText(/Pattern Instructions/i), {
      target: { value: 'This is a test pattern.' },
    });
    fireEvent.change(screen.getByLabelText(/Pattern Link/i), {
      target: { value: 'http://example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Tags/i), {
      target: { value: 'tag1, tag2' },
    });
    fireEvent.change(screen.getByLabelText(/Additional Notes/i), {
      target: { value: 'Some notes' },
    });

    fireEvent.click(screen.getByTestId('create-pattern-button'));

    await waitFor(() => {
      expect(patternService.createPattern).toHaveBeenCalledWith({
        name: 'Test Pattern',
        text: 'This is a test pattern.',
        link: 'http://example.com',
        tags: ['tag1', 'tag2'],
        notes: 'Some notes',
        files: [],
      });
      expect(toaster.success).toHaveBeenCalledWith({
        description: 'Pattern created successfully',
        duration: 5000,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/users/1');
    });
  });

  test('shows error message on form submission failure', async () => {
    patternService.createPattern.mockRejectedValue(
      new Error('Failed to create pattern'),
    );

    render(<PatternForm />);

    fireEvent.change(screen.getByLabelText(/Pattern Name/i), {
      target: { value: 'Test Pattern' },
    });
    fireEvent.change(screen.getByLabelText(/Pattern Instructions/i), {
      target: { value: 'This is a test pattern.' },
    });

    fireEvent.click(screen.getByTestId('create-pattern-button'));

    await waitFor(() => {
      expect(toaster.error).toHaveBeenCalledWith({
        description: 'Error creating pattern',
        duration: 5000,
      });
    });
  });

  test('navigates to the correct page on cancel', () => {
    render(<PatternForm />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('displays helper text correctly', () => {
    render(<PatternForm />);
    expect(
      screen.getByText(
        /Separate tags with commas \(e\.g\., knitting, scarf, beginner\)/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Upload reference images, charts, or visual guides for your pattern/i,
      ),
    ).toBeInTheDocument();
  });

  test('shows validation errors for required fields', async () => {
    render(<PatternForm />);
    fireEvent.click(screen.getByTestId('create-pattern-button'));

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Pattern Name/i);
      expect(nameInput).toBeInvalid();
      expect(nameInput.validationMessage).toBe('Constraints not satisfied');

      const textInput = screen.getByLabelText(/Pattern Instructions/i);
      expect(textInput).toBeInvalid();
      expect(textInput.validationMessage).toBe('Constraints not satisfied');
    });
  });
});
