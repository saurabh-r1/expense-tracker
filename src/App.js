// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login/Login';
import WelcomePage from './components/WelcomePage'; 
import CompleteProfile from './components/CompleteProfile';
import { AuthContextProvider } from './Authentication/AuthContext';
import EditProfile from './components/EditProfile';


function App() {
  return (
    <>
    <AuthContextProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
    </AuthContextProvider>
    </>
  );
}

export default App;
