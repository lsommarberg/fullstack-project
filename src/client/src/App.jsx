import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login';
import SignUp from './components/SignUp';
import Navigation from './components/Navigation';

const Home = () => <h2>Home</h2>;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user-token');
    if (loggedUserJSON) {
      try {
        const { user, expirationTime } = JSON.parse(loggedUserJSON);
        if (new Date().getTime() > expirationTime) {
          localStorage.removeItem('user-token');
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        localStorage.removeItem('user-token');
      }
    }
  }, []);

  return (
    <div>
      <Navigation user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
