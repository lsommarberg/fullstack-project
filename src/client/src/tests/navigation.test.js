import { render, screen, fireEvent } from './test-utils';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe('Navigation', () => {
  const mockNavigate = jest.fn();
  const mockSetUser = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when user is not logged in', () => {
    test('renders navigation with login and signup buttons', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /sign up/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /logout/i }),
      ).not.toBeInTheDocument();
    });

    test('displays color mode button', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      expect(
        screen.getByRole('button', { name: /toggle color mode/i }),
      ).toBeInTheDocument();
    });

    test('renders outlet for child routes', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      expect(screen.getByTestId('outlet')).toBeInTheDocument();
      expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    });

    test('login button has correct href', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      const loginButton = screen.getByRole('link', { name: /login/i });
      expect(loginButton).toHaveAttribute('href', '/login');
    });

    test('signup button has correct href and test id', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      const signupButton = screen.getByRole('link', { name: /sign up/i });
      expect(signupButton).toHaveAttribute('href', '/signup');
      expect(signupButton).toHaveAttribute('data-testid', 'nav-signup');
    });
  });

  describe('when user is logged in', () => {
    const mockUser = {
      id: '123',
      username: 'testuser',
      name: 'Test User',
    };

    test('renders navigation with logout button', () => {
      render(<Navigation user={mockUser} setUser={mockSetUser} />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /login/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /sign up/i }),
      ).not.toBeInTheDocument();
    });

    test('logout button clears user state and localStorage', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'test-token');

      render(<Navigation user={mockUser} setUser={mockSetUser} />);

      const logoutButton = screen.getByRole('link', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });

    test('home button has correct href when user is logged in', () => {
      render(<Navigation user={mockUser} setUser={mockSetUser} />);

      const homeButton = screen.getByRole('link', { name: /home/i });
      expect(homeButton).toHaveAttribute('href', '/');
    });
  });

  describe('navigation structure', () => {
    test('has proper ARIA labels for accessibility', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
        'aria-label',
        'Home',
      );
      expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute(
        'aria-label',
        'Login',
      );
      expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
        'aria-label',
        'Sign Up',
      );
    });

    test('navigation has correct styling attributes', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    test('home button has correct href', () => {
      render(<Navigation user={null} setUser={mockSetUser} />);

      const homeButton = screen.getByRole('link', { name: /home/i });
      expect(homeButton).toHaveAttribute('href', '/');
    });
  });

  describe('component props', () => {
    test('handles missing user prop gracefully', () => {
      render(<Navigation setUser={mockSetUser} />);

      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /sign up/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /logout/i }),
      ).not.toBeInTheDocument();
    });

    test('setUser function is called with correct parameters on logout', () => {
      const mockUser = { id: '123', username: 'testuser' };
      render(<Navigation user={mockUser} setUser={mockSetUser} />);

      const logoutButton = screen.getByRole('link', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(mockSetUser).toHaveBeenCalledTimes(1);
      expect(mockSetUser).toHaveBeenCalledWith(null);
    });
  });

  describe('responsive behavior', () => {
    test('maintains layout structure across different states', () => {
      const { rerender } = render(
        <Navigation user={null} setUser={mockSetUser} />,
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();

      const mockUser = { id: '123', username: 'testuser' };
      rerender(<Navigation user={mockUser} setUser={mockSetUser} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
  });
});
