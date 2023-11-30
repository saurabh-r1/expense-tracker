// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login/Login';
import WelcomePage from './components/WelcomePage'; 
import CompleteProfile from './components/CompleteProfile';
import { AuthContextProvider, useAuth } from './Authentication/AuthContext';
import EditProfile from './components/EditProfile';
import AuthGuard from './Authentication/AuthGaurd';

function App() {
  const auth = useAuth();

  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Routes>
          {auth.isLoggedIn ? (
            <Route path="/" element={<WelcomePage />} />
          ) : (
            <Route path="/" element={<Login />} />
          )}
          <Route
            path="/welcome"
            element={<AuthGuard>{<WelcomePage />}</AuthGuard>}
          />
          <Route
            path="/complete-profile"
            element={<AuthGuard>{<CompleteProfile />}</AuthGuard>}
          />
          <Route
            path="/edit-profile"
            element={<AuthGuard>{<EditProfile />}</AuthGuard>}
          />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
