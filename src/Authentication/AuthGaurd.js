import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
  const { isLoggedIn } = useAuth();

  console.log({isLoggedIn});

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default AuthGuard;