import { render, screen, waitFor } from './test-utils';
import UserAnalytics from '../components/analytics/UserAnalytics';
import analyticsService from '../services/analytics';

jest.mock('../services/analytics');

const getMockAnalyticsData = () => ({
  userId: 'user123',
  completionRate: {
    percentage: 67,
    completed: 2,
    total: 3,
  },
  activityByMonth: [
    {
      _id: { year: 2024, month: 1 },
      started: 2,
      finished: 1,
    },
    {
      _id: { year: 2024, month: 2 },
      started: 1,
      finished: 2,
    },
  ],
  mostUsedPatterns: [
    {
      patternId: 'pattern1',
      patternName: 'Basic Scarf Pattern',
      projectCount: 3,
    },
    {
      patternId: 'pattern2',
      patternName: 'Hat Pattern',
      projectCount: 1,
    },
  ],
  averageDuration: {
    avgDuration: 15.5,
    minDuration: 7,
    maxDuration: 30,
    count: 2,
  },
  recentActivity: {
    projectsStarted: 2,
    projectsCompleted: 1,
    patternsCreated: 1,
  },
  currentProjects: {
    inProgress: 1,
    completed: 2,
    total: 3,
  },
});

describe('UserAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', async () => {
    analyticsService.getAnalytics.mockImplementation(
      () => new Promise(() => {}),
    ); // Never resolves

    render(<UserAnalytics userId="user123" />);

    expect(screen.getByText('Loading analytics...')).toBeInTheDocument();
    // Check for spinner by CSS class instead of role
    expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
  });

  test('fetches and displays analytics data', async () => {
    analyticsService.getAnalytics.mockResolvedValue(getMockAnalyticsData());

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(screen.getByText('Analytics & Statistics')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1 in progress')).toBeInTheDocument();

    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();
    expect(screen.getByText('2 completed')).toBeInTheDocument();

    expect(screen.getByText('Recent Activity (30d)')).toBeInTheDocument();

    const twoElements = screen.getAllByText('2');
    expect(twoElements.length).toBeGreaterThan(0);
    expect(screen.getByText('projects started')).toBeInTheDocument();

    const averageDurationElements = screen.getAllByText('Average Duration');
    expect(averageDurationElements.length).toBeGreaterThan(0);

    const weeksElements = screen.getAllByText('2 weeks');
    expect(weeksElements.length).toBeGreaterThan(0);

    expect(screen.getByText('2 completed projects')).toBeInTheDocument();
  });

  test('displays activity chart when data is available', async () => {
    analyticsService.getAnalytics.mockResolvedValue(getMockAnalyticsData());

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(
        screen.getByText('Activity Over Time (Last 12 Months)'),
      ).toBeInTheDocument();
      expect(screen.getByText('Jan 2024')).toBeInTheDocument();
      expect(screen.getByText('Feb 2024')).toBeInTheDocument();
    });
  });

  test('displays most used patterns when data is available', async () => {
    analyticsService.getAnalytics.mockResolvedValue(getMockAnalyticsData());

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(screen.getByText('Most Used Patterns')).toBeInTheDocument();
      expect(screen.getByText('Basic Scarf Pattern')).toBeInTheDocument();
      expect(screen.getByText('Hat Pattern')).toBeInTheDocument();
      expect(screen.getByText('3 projects')).toBeInTheDocument();
      expect(screen.getByText('1 project')).toBeInTheDocument();
    });
  });

  test('displays recent activity details', async () => {
    analyticsService.getAnalytics.mockResolvedValue(getMockAnalyticsData());

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(
        screen.getByText('Recent Activity (Last 30 Days)'),
      ).toBeInTheDocument();
      expect(screen.getByText('Projects Started')).toBeInTheDocument();
      expect(screen.getByText('Projects Completed')).toBeInTheDocument();
      expect(screen.getByText('Patterns Created')).toBeInTheDocument();
    });
  });

  test('displays duration statistics when available', async () => {
    analyticsService.getAnalytics.mockResolvedValue(getMockAnalyticsData());

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(
        screen.getByText('Project Duration Statistics'),
      ).toBeInTheDocument();

      const averageDurationElements = screen.getAllByText('Average Duration');
      expect(averageDurationElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Fastest Completion')).toBeInTheDocument();
      expect(screen.getByText('Longest Duration')).toBeInTheDocument();
      expect(screen.getByText('1 week')).toBeInTheDocument();
      expect(screen.getByText('1 month')).toBeInTheDocument();
    });
  });

  test('handles error state', async () => {
    analyticsService.getAnalytics.mockRejectedValue(new Error('API Error'));

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load analytics data'),
      ).toBeInTheDocument();
    });
  });

  test('displays info message when no analytics data', async () => {
    analyticsService.getAnalytics.mockResolvedValue(null);

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(
        screen.getByText('No analytics data available'),
      ).toBeInTheDocument();
    });
  });

  test('does not fetch data when userId is not provided', () => {
    render(<UserAnalytics userId="" />);

    expect(analyticsService.getAnalytics).not.toHaveBeenCalled();
  });

  test('refetches data when userId changes', async () => {
    analyticsService.getAnalytics.mockResolvedValue(getMockAnalyticsData());

    const { rerender } = render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(analyticsService.getAnalytics).toHaveBeenCalledWith('user123');
    });

    jest.clearAllMocks();
    analyticsService.getAnalytics.mockResolvedValue(getMockAnalyticsData());

    rerender(<UserAnalytics userId="user456" />);

    await waitFor(() => {
      expect(analyticsService.getAnalytics).toHaveBeenCalledWith('user456');
    });

    expect(analyticsService.getAnalytics).toHaveBeenCalledTimes(1);
  });

  test('hides activity chart when no monthly data', async () => {
    const dataWithoutActivity = {
      ...getMockAnalyticsData(),
      activityByMonth: [],
    };
    analyticsService.getAnalytics.mockResolvedValue(dataWithoutActivity);

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(screen.getByText('Analytics & Statistics')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('Activity Over Time (Last 12 Months)'),
    ).not.toBeInTheDocument();
  });

  test('hides most used patterns when no pattern data', async () => {
    const dataWithoutPatterns = {
      ...getMockAnalyticsData(),
      mostUsedPatterns: [],
    };
    analyticsService.getAnalytics.mockResolvedValue(dataWithoutPatterns);

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(screen.getByText('Analytics & Statistics')).toBeInTheDocument();
    });

    expect(screen.queryByText('Most Used Patterns')).not.toBeInTheDocument();
  });

  test('hides duration statistics when no completed projects', async () => {
    const dataWithoutDuration = {
      ...getMockAnalyticsData(),
      averageDuration: {
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        count: 0,
      },
    };
    analyticsService.getAnalytics.mockResolvedValue(dataWithoutDuration);

    render(<UserAnalytics userId="user123" />);

    await waitFor(() => {
      expect(screen.getByText('Analytics & Statistics')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('Project Duration Statistics'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(screen.getByText('No completed projects')).toBeInTheDocument();
  });
});

describe('formatDuration', () => {
  test('formats duration correctly through component', async () => {
    const testCases = [
      { duration: 0.5, expected: '< 1 day' },
      { duration: 3, expected: '3 days' },
      { duration: 10, expected: '1 week' },
      { duration: 21, expected: '3 weeks' },
      { duration: 45, expected: '2 months' },
    ];

    for (const { duration, expected } of testCases) {
      const dataWithDuration = {
        ...getMockAnalyticsData(),
        averageDuration: {
          avgDuration: duration,
          minDuration: duration,
          maxDuration: duration,
          count: 1,
        },
      };

      analyticsService.getAnalytics.mockResolvedValue(dataWithDuration);

      const { unmount } = render(<UserAnalytics userId="user123" />);

      await waitFor(() => {
        const durationElements = screen.getAllByText(expected);
        expect(durationElements.length).toBeGreaterThan(0);
      });

      unmount();
    }
  });
});
