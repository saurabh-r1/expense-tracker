// AuthContext.js
import React, { useState, useContext } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  userEmail: '',
  isEmailVerified: false,
  login: (token, userEmail, isEmailVerified) => {},
  logout: () => {},
  getToken: () => {},
  sendVerificationEmail: () => {},
  setIsEmailVerified: (isEmailVerified) => {},
  confirmEmailVerification: (oobCode) => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const initialUserEmail = localStorage.getItem('userEmail');
  const initialIsEmailVerified = localStorage.getItem('isEmailVerified') === 'true';

  const [token, setToken] = useState(initialToken);
  const [userEmail, setUserEmail] = useState(initialUserEmail);
  const [isEmailVerified, setIsEmailVerified] = useState(initialIsEmailVerified);

  const loginHandler = (token, userEmail, isEmailVerified) => {
    setToken(token);
    setUserEmail(userEmail);
    setIsEmailVerified((prevIsEmailVerified) => prevIsEmailVerified || isEmailVerified);
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('isEmailVerified', isEmailVerified);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserEmail(null);
    setIsEmailVerified(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isEmailVerified');
    console.log('loggedOut');
  };

  const getToken = () => {
    return token;
  };

  const sendVerificationEmail = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBLKAbRXVsMIF8DYwJjnSGwYrzgHYy3jiU`,
        {
          method: 'POST',
          body: JSON.stringify({
            requestType: 'VERIFY_EMAIL',
            idToken: token,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || 'Email verification failed!');
      }

      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };


  const confirmEmailVerification = async (oobCode) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBLKAbRXVsMIF8DYwJjnSGwYrzgHYy3jiU`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oobCode: oobCode,
            emailVerified: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || 'Email verification confirmation failed!');
      }

      console.log('Email verification confirmed successfully:', data);
      setIsEmailVerified(true);
    } catch (error) {
      console.error('Error confirming email verification:', error);
    }
  };

  const contextValue = {
    token: token,
    isLoggedIn: !!token,
    userEmail: userEmail,
    isEmailVerified: isEmailVerified,
    login: loginHandler,
    logout: logoutHandler,
    getToken: getToken,
    sendVerificationEmail: sendVerificationEmail,
    confirmEmailVerification: confirmEmailVerification,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
