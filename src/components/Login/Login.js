// Login.js
import React, { useContext, useRef, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../Authentication/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const toggle = () => {
    setIsLogin(!isLogin);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);

    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBLKAbRXVsMIF8DYwJjnSGwYrzgHYy3jiU`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBLKAbRXVsMIF8DYwJjnSGwYrzgHYy3jiU`;
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication failed!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken, data.email);
        navigate('/welcome'); // Redirect to the welcome page
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const forgotPasswordHandler = () => {
    const enteredEmail = emailInputRef.current.value;

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBLKAbRXVsMIF8DYwJjnSGwYrzgHYy3jiU`, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        requestType: 'PASSWORD_RESET',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Password reset failed!';
            if(data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        alert('Password reset email sent successfully. Check your email for instructions.');
        toggleForgotPassword(); // Switch back to the login screen after sending the reset email
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <Container className="mt-5">
      <div className="login-container">
        <h2 className="login-header">{isForgotPassword ? 'Forgot Password' : isLogin ? 'Login' : 'Sign Up'}</h2>
        <Form onSubmit={isForgotPassword ? forgotPasswordHandler : submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" required ref={emailInputRef} />
          </Form.Group>

          {!isForgotPassword && (
            <Form.Group controlId="password">
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" required ref={passwordInputRef} />
            </Form.Group>
          )}

          {!isForgotPassword && (
            <div className="mb-3">
              <Button variant="link" onClick={toggleForgotPassword}>
                Forgot Password?
              </Button>
            </div>
          )}

          <div>
            {!isLoading && !isForgotPassword && <Button type="submit">{isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}</Button>}
            {!isLoading && isForgotPassword && <Button type="submit">Reset Password</Button>}
            {isLoading && <p className='loading'>Sending request....</p>}
          </div>
        </Form>

        {!isForgotPassword && (
          <div className="button2">
            <Button className='bg-white' onClick={toggle}>
              {isLogin ? 'Create New Account' : 'Login with Existing Account'}
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Login;

