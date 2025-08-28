import { render, screen } from './test-utils';
import {
  SimpleBarChart,
  SimpleProgressChart,
  StatCard,
} from '../components/analytics/Charts';

describe('Charts Components', () => {
  describe('SimpleBarChart', () => {
    const mockData = [
      {
        _id: { year: 2024, month: 1 },
        started: 5,
        finished: 3,
      },
      {
        _id: { year: 2024, month: 2 },
        started: 2,
        finished: 4,
      },
    ];

    test('renders chart with data', () => {
      render(<SimpleBarChart data={mockData} title="Test Chart" />);

      expect(screen.getByText('Test Chart')).toBeInTheDocument();
      expect(screen.getByText('Jan 2024')).toBeInTheDocument();
      expect(screen.getByText('Feb 2024')).toBeInTheDocument();
      expect(screen.getAllByText('Started:')).toHaveLength(2);
      expect(screen.getAllByText('Finished:')).toHaveLength(2);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    test('renders empty state when no data', () => {
      render(<SimpleBarChart data={[]} title="Empty Chart" />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.queryByText('Empty Chart')).not.toBeInTheDocument();
    });

    test('renders empty state when data is null', () => {
      render(<SimpleBarChart data={null} title="Null Chart" />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    test('calculates bar widths correctly', () => {
      render(<SimpleBarChart data={mockData} title="Width Test" />);

      const startedLabels = screen.getAllByText('Started:');
      const finishedLabels = screen.getAllByText('Finished:');

      const startedContainer1 = startedLabels[0].nextElementSibling; // The gray container
      const startedBar1 = startedContainer1.firstElementChild; // The colored bar inside

      const startedContainer2 = startedLabels[1].nextElementSibling;
      const startedBar2 = startedContainer2.firstElementChild;

      const finishedContainer1 = finishedLabels[0].nextElementSibling;
      const finishedBar1 = finishedContainer1.firstElementChild;

      const finishedContainer2 = finishedLabels[1].nextElementSibling;
      const finishedBar2 = finishedContainer2.firstElementChild;

      expect(startedBar1).toHaveStyle('width: 100%');
      expect(startedBar2).toHaveStyle('width: 40%');
      expect(finishedBar1).toHaveStyle('width: 60%');
      expect(finishedBar2).toHaveStyle('width: 80%');
    });
  });

  describe('SimpleProgressChart', () => {
    test('renders progress chart with percentage', () => {
      render(
        <SimpleProgressChart value={7} total={10} label="Test Progress" />,
      );

      expect(screen.getByText('Test Progress')).toBeInTheDocument();
      expect(screen.getByText('7/10 (70%)')).toBeInTheDocument();
    });

    test('handles zero total', () => {
      render(<SimpleProgressChart value={5} total={0} label="Zero Total" />);

      expect(screen.getByText('Zero Total')).toBeInTheDocument();
      expect(screen.getByText('5/0 (0%)')).toBeInTheDocument();
    });

    test('calculates percentage correctly', () => {
      const testCases = [
        { value: 1, total: 3, expected: '33%' },
        { value: 2, total: 3, expected: '67%' },
        { value: 3, total: 3, expected: '100%' },
        { value: 0, total: 5, expected: '0%' },
      ];

      testCases.forEach(({ value, total, expected }) => {
        const { unmount } = render(
          <SimpleProgressChart
            value={value}
            total={total}
            label={`Test ${expected}`}
          />,
        );

        expect(
          screen.getByText(`${value}/${total} (${expected})`),
        ).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('StatCard', () => {
    test('renders stat card with all props', () => {
      const icon = <span data-testid="test-icon">📊</span>;

      render(
        <StatCard
          title="Test Stat"
          value="42"
          subtitle="test subtitle"
          icon={icon}
        />,
      );

      expect(screen.getByText('Test Stat')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('test subtitle')).toBeInTheDocument();
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('renders without subtitle', () => {
      render(<StatCard title="No Subtitle" value="123" />);

      expect(screen.getByText('No Subtitle')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    test('renders without icon', () => {
      render(<StatCard title="No Icon" value="456" subtitle="has subtitle" />);

      expect(screen.getByText('No Icon')).toBeInTheDocument();
      expect(screen.getByText('456')).toBeInTheDocument();
      expect(screen.getByText('has subtitle')).toBeInTheDocument();
    });

    test('handles numeric values', () => {
      render(<StatCard title="Numeric" value={789} subtitle="number type" />);

      expect(screen.getByText('Numeric')).toBeInTheDocument();
      expect(screen.getByText('789')).toBeInTheDocument();
      expect(screen.getByText('number type')).toBeInTheDocument();
    });
  });
});
