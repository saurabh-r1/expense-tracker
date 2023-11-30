// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login/Login';
import WelcomePage from './components/WelcomePage'; 
import CompleteProfile from './components/CompleteProfile';
import { AuthContextProvider,useAuth } from './Authentication/AuthContext';
import EditProfile from './components/EditProfile';
import AuthGuard from './Authentication/AuthGaurd';
import ExpenseTracker from './components/ExpenseTracker';


function App() {
  const auth = useAuth();
  
  return (
    <>
    <AuthContextProvider>
    <Router>
      <Header />
      <Routes>
      {auth.isLoggedIn && (
        <Route path="/" element={<ExpenseTracker />} />
      )}
        <Route path="/" element={<Login />} />
        <Route path="/welcome" element={<AuthGuard><ExpenseTracker /></AuthGuard>} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
    </AuthContextProvider>
    </>
  );
}

export default App;
