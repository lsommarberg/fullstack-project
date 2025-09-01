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

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      <Toaster />
      <Navigation user={user} setUser={setUser} />
      <Routes>
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
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route path="/signup" element={<SignUp />} />

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
