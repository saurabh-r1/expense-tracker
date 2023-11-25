// CompleteProfile.js
import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CompleteProfile = () => {
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const updateProfile = () => {
    // Implement your logic for updating the profile
    // For now, just log the values to the console
    console.log('Full Name:', fullName);
    console.log('Profile Photo URL:', photoUrl);
    // You can add additional logic here, like sending a request to update the user's profile
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col className='col-7' >
          <p className='mt-3 h5'>Winner never quit, quitter never wins.</p>
        </Col>
        <Col className="col-5" style={{ backgroundColor: '#C4A484', borderRadius: '5px' }}>
          <p className='m-0'>
            <em>
              Your profile is 64% complete. A complete profile has higher chances of getting a job.
              <Link to="/complete-profile">
                <Button variant="link" className="p-0 text-decoration-none ">
                  <em>Complete now</em>
                </Button>
              </Link>
            </em>
          </p>
        </Col>
      </Row>

      <hr />
      <Card className='mt-5'>
        <Card.Body>
          <h3>Complete Your Profile</h3>
          <Form>
            <Row>
              <Col className='col-6'>
            <Form.Group controlId="fullName" >
              <Form.Label>Full Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>
            </Col>
            <Col className='col-6'>
            <Form.Group controlId="photoUrl" >
              <Form.Label>Profile Photo URL:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your profile photo URL"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </Form.Group>
            </Col>
            </Row>
            <div className='text-end mt-3'>
            <Button variant="primary" onClick={updateProfile}>
              Update
            </Button>
            <Button variant="danger" className="ms-2">
              Cancel
            </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CompleteProfile;
