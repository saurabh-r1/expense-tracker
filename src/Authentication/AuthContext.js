// AuthContext.js
import React, { useState, useContext } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  userEmail: '',
  emailVerified: false,
  login: (token, userEmail, emailVerified) => {},
  logout: () => {},
  getToken: () => {},
  sendVerificationEmail: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const initialUserEmail = localStorage.getItem('userEmail');
  const initialEmailVerified = localStorage.getItem('emailVerified') === 'true';

  const [token, setToken] = useState(initialToken);
  const [userEmail, setUserEmail] = useState(initialUserEmail);
  const [emailVerified, setEmailVerified] = useState(initialEmailVerified);

  const loginHandler = (token, userEmail, emailVerified) => {
    setToken(token);
    setUserEmail(userEmail);
    setEmailVerified(emailVerified);
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('emailVerified', emailVerified);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserEmail(null);
    setEmailVerified(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('emailVerified');
    console.log('loggedOut');
  };

  const userIsLoggedIn = !!token;

  const getToken = () => {
    return token;
  };

  const sendVerificationEmail = async () => {
    try {
      await fetch(
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
      // Handle success (optional)
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Handle error
    }
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    userEmail: userEmail,
    emailVerified: emailVerified,
    login: loginHandler,
    logout: logoutHandler,
    getToken: getToken,
    sendVerificationEmail: sendVerificationEmail,
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
