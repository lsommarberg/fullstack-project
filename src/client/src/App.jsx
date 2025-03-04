import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Navigation from './components/Navigation';
import UserPage from './components/UserPage';
import PatternList from './components/PatternsList';
import PatternPage from './components/pattern/PatternPage';
import PatternForm from './components/CreatePattern';
import { Toaster } from './components/ui/toaster';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user');
    if (loggedUserJSON) {
      try {
        const { user, expirationTime } = JSON.parse(loggedUserJSON);
        if (new Date().getTime() > expirationTime) {
          window.localStorage.removeItem('user');
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        window.localStorage.removeItem('user');
      }
    }
  }, []);

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
        <Route path="/users/:id" element={<UserPage user={user} />} />
        <Route path="/patterns/:id" element={<PatternList />} />
        <Route path="/patterns/:id/:patternId" element={<PatternPage />} />
        <Route path="/patterns/:id/create" element={<PatternForm />} />
      </Routes>
    </div>
  );
};

export default App;
