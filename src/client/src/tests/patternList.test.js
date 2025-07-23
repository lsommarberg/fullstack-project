import { render, screen, waitFor } from './test-utils';
import PatternList from '../components/PatternsList';
import patternService from '../services/pattern';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('../services/pattern');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('PatternList', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: '1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<PatternList />);
    expect(screen.getByText('My Patterns:')).toBeInTheDocument();
  });

  test('fetches and displays patterns', async () => {
    const mockPatterns = [
      { id: 1, name: 'Pattern 1', tags: ['tag1', 'tag2'] },
      { id: 2, name: 'Pattern 2', tags: ['tag3', 'tag4'] },
    ];
    patternService.getPatterns.mockResolvedValue(mockPatterns);

    render(<PatternList />);

    await waitFor(() => {
      expect(screen.getByText('Pattern 1')).toBeInTheDocument();
      expect(screen.getByText('Pattern 2')).toBeInTheDocument();
    });
  });

  test('redirects to home on 401 error', async () => {
    patternService.getPatterns.mockRejectedValue({ response: { status: 401 } });

    render(<PatternList />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
