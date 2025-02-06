import React from 'react';
import { render, screen, waitFor, fireEvent } from './test-utils';
import PatternPage from '../components/pattern/PatternPage';
import patternService from '../services/pattern';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('../services/pattern');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('react-markdown', () => (props) => <div {...props} />);

const getMockPattern = () => ({
  name: 'Test Pattern',
  text: 'This is a test pattern.',
  link: 'http://example.com',
  notes: ['Note 1', 'Note 2'],
  tags: ['Tag 1', 'Tag 2'],
});

describe('PatternPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ id: '1', patternId: '1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays pattern data', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
      expect(
        screen.getByText((content, element) =>
          content.includes('This is a test pattern.'),
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Link to pattern')).toBeInTheDocument();
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });
  });

  test('handles add note', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());
    patternService.updatePattern.mockResolvedValue({
      ...getMockPattern(),
      notes: ['Note 1', 'Note 2', 'New Note'],
    });

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Note'));
    fireEvent.change(screen.getByPlaceholderText('Add a new note'), {
      target: { value: 'New Note' },
    });

    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('New Note')).toBeInTheDocument();
    });
  });

  test('handles delete pattern', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());
    patternService.deletePattern.mockResolvedValue({});

    window.confirm = jest.fn().mockImplementation(() => true);

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Pattern'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/patterns/1');
    });
  });

  test('handles remove note', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());
    patternService.updatePattern.mockResolvedValue({
      ...getMockPattern(),
      notes: ['Note 1'],
    });

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    // Get all delete buttons and click the one for 'Note 2'
    const deleteButtons = screen.getAllByLabelText('Delete note');
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText('Note 2')).not.toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    patternService.getPatternById.mockRejectedValue(new Error('API Error'));

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Pattern')).not.toBeInTheDocument();
    });
  });
});
