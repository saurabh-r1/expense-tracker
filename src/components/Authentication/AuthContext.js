import React, { useState, useContext } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  userEmail: '',
  login: (token, userEmail) => {},
  logout: () => {},
  getToken: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const initialUserEmail = localStorage.getItem('userEmail');
  const [token, setToken] = useState(initialToken);
  const [userEmail, setUserEmail] = useState(initialUserEmail);

  const loginHandler = (token, userEmail) => {
    setToken(token);
    setUserEmail(userEmail);
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', userEmail);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  const userIsLoggedIn = !!token;

  const getToken = () => {
    return token;
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    userEmail: userEmail,
    login: loginHandler,
    logout: logoutHandler,
    getToken: getToken,
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