// Header.js

import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  console.log(auth.isLoggedIn);

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand><h1>Expense Tracker</h1></Navbar.Brand>
        <Nav className="ms-auto">
          {auth.isLoggedIn && (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
