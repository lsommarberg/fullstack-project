import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navigation from './components/Navigation';
import UserPage from './components/user/UserPage';
import PatternList from './components/pattern/PatternsList';
import PatternPage from './components/pattern/PatternPage';
import PatternForm from './components/pattern/CreatePattern';
import ProjectsList from './components/project/ProjectsList';
import ProjectPage from './components/project/ProjectPage';
import ProjectForm from './components/project/StartProjectForm';
import FinishedProjectsList from './components/project/FinishedProjectsList';
import SidebarLayout from './components/layout/SidebarLayout';
import { Toaster } from './components/ui/toaster';

/**
 * Main application component that handles routing, authentication, and user session management.
 *
 * This component:
 * - Manages user authentication state
 * - Handles automatic session expiration and logout
 * - Provides persistent navigation and routing
 * - Redirects users based on authentication status
 *
 * @component
 * @returns {JSX.Element} The main application with navigation and routing
 */
const App = () => {
  /**
   * User authentication state
   * @type {Object|null} Current authenticated user object or null if not logged in
   */
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Effect hook that manages automatic session expiration and authentication state.
   *
   * This effect:
   * - Checks localStorage for stored user session on component mount
   * - Validates session expiration time
   * - Automatically logs out expired sessions
   * - Redirects to login page when session expires (except from signup page)
   * - Removes invalid or expired session data from localStorage
   *
   * @dependency {function} navigate - React Router navigation function
   * @dependency {Object} location.pathname - Current route pathname
   */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user');
    if (loggedUserJSON) {
      try {
        const { user, expirationTime } = JSON.parse(loggedUserJSON);
        if (new Date().getTime() > expirationTime) {
          window.localStorage.removeItem('user');
          setUser(null);
          if (location.pathname !== '/signup') {
            navigate('/login');
          }
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        window.localStorage.removeItem('user');
        setUser(null);
        if (location.pathname !== '/signup') {
          navigate('/login');
        }
      }
    } else {
      setUser(null);
      if (location.pathname !== '/signup') {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div>
      {/* Global toast notifications */}
      <Toaster />

      {/* Main navigation bar - persists across all routes */}
      <Navigation user={user} setUser={setUser} />

      <Routes>
        {/* Home route - redirects based on authentication status */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/users/${user.id}`} />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        {/* Authentication routes */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes with sidebar layout */}
        <Route element={<SidebarLayout userId={user?.id} />}>
          <Route path="/users/:id" element={<UserPage user={user} />} />
          <Route path="/patterns/:id" element={<PatternList />} />
          <Route path="/patterns/:id/:patternId" element={<PatternPage />} />
          <Route path="/patterns/:id/create" element={<PatternForm />} />
          <Route path="/projects/:id" element={<ProjectsList />} />
          <Route path="/projects/:id/:projectId" element={<ProjectPage />} />
          <Route path="/projects/:id/create" element={<ProjectForm />} />
          <Route
            path="/projects/:id/finished"
            element={<FinishedProjectsList />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
