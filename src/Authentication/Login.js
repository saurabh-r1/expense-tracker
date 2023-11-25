import React, { useContext, useRef, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../Authentication/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate(); // Initialize navigate
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = () => {
    setIsLogin(!isLogin);
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
        navigate('/dummy-screen'); 
      })
      .catch((err) => {
        alert(err.message);
      });
  };
   
  return (
    <Container className="container1">
      <div className="login-container">
        <h2 className="login-header">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              required
              ref={emailInputRef}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              required
              ref={passwordInputRef}
            />
          </Form.Group>

          <div>
          {!isLoading && <Button type="submit">{isLogin ? 'LOGIN': 'CREATE ACCOUNT'}</Button>}
          {isLoading && <p className='loading'>Sending request....</p>}
          </div>
        </Form>
        <div className="button2">
        <Button className='bg-white' onClick={toggle}>
          { isLogin? 'Create New Account':'Login with Existing Account'}
        </Button>
        </div>
      </div>
    </Container>
  );
};

export default Login;