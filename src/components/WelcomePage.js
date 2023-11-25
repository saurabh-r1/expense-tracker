// WelcomePage.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <Container className="p-0 mt-3">
      <Row>
        <Col >
          <p className='m-0 h3'>Welcome to Expense Tracker!!!</p>
        </Col>
        <Col xs="auto" className="text-end" style={{backgroundColor:'#C4A484', borderRadius:'5px'}}>
          <p className='m-0'><em>
            Your profile is incomplete.
            <Link to="/complete-profile">
            <Button variant="link" className="p-0 text-decoration-none" ><em>Complete now</em></Button>
            </Link>
          </em></p>
        </Col>
      </Row>
      <hr />
    </Container>
  );
};

export default WelcomePage;
