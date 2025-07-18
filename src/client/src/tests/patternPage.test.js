import React from 'react';
import { render, screen, waitFor, fireEvent } from './test-utils';
import PatternPage from '../components/pattern/PatternPage';
import patternService from '../services/pattern';
import { useNavigate, useParams } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';
import { expect } from '@playwright/test';

jest.mock('../services/pattern');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('react-markdown', () => (props) => <div {...props} />);

jest.mock('@/components/ui/toaster', () => ({
  toaster: {
    create: jest.fn(),
    error: jest.fn(),
  },
}));

const getMockPattern = () => ({
  name: 'Test Pattern',
  text: 'This is a test pattern.',
  link: 'http://example.com',
  notes: 'Note',
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
      expect(screen.getByText('Note')).toBeInTheDocument();
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });
  });

  test('handles delete pattern', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());
    patternService.deletePattern.mockResolvedValue({});

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Pattern'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      expect(
        screen.getByText('Are you sure you want to delete this pattern?'),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(patternService.deletePattern).toHaveBeenCalledWith('1', '1');
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

  test('handles edit pattern', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());
    patternService.updatePattern.mockResolvedValue(getMockPattern());

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Pattern'));

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Updated Pattern' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Updated Pattern')).toBeInTheDocument();
    });
  });

  test('handles cancel edit pattern', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Pattern'));

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });
  });

  test('displays error toast on save failure', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());
    patternService.updatePattern.mockRejectedValue(new Error('Save Error'));

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Pattern'));

    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(toaster.error).toHaveBeenCalledWith({
        description: 'An error occurred while updating the pattern.',
        duration: 5000,
      });
    });
  });

  test('displays error toast on delete failure', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());
    patternService.deletePattern.mockRejectedValue(new Error('Delete Error'));

    window.confirm = jest.fn().mockImplementation(() => true);

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete Pattern'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      expect(
        screen.getByText('Are you sure you want to delete this pattern?'),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(toaster.error).toHaveBeenCalledWith({
        description: 'An error occurred while deleting the pattern.',
        duration: 5000,
      });
    });
  });

  test('handles show more/less functionality in pattern text', async () => {
    patternService.getPatternById.mockResolvedValue(getMockPattern());

    render(<PatternPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Pattern')).toBeInTheDocument();
    });

    expect(screen.getByText('Show Less')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Show Less'));

    await waitFor(() => {
      expect(screen.getByText('Show More')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Show More'));

    await waitFor(() => {
      expect(screen.getByText('Show Less')).toBeInTheDocument();
    });
  });
});
