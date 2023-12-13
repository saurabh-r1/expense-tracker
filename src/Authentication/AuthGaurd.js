import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

function AuthGuard({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default AuthGuard;