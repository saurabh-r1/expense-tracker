import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const postId = localStorage.getItem('postId');

  const editProfile = async (e) => {
    e.preventDefault();

    // Check if both full name and photo URL are filled
    if (!fullName || !photoUrl) {
      setError('Please fill both Full Name and Profile Photo URL.');
      return;
    }

    setLoading(true);

    // Create a data object with the user's input
    const userData = {
      fullName,
      photoUrl,
    };


    try {
      await axios.put(`https://expense-tracker-aa503-default-rtdb.firebaseio.com/users/${postId}/.json`, userData);
      console.log('Data updated successfully');

      // Clear the form fields after successful submission
      setFullName('');
      setPhotoUrl('');
      
      // Redirect to the WelcomePage after a successful update
      navigate('/welcome');
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Error updating data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear error when the component mounts
  useEffect(() => {
    setError('');
  }, []);

  return (
    <Container className="mt-3">
      <Row>
        <Col className='col-7'>
          <p className='mt-3 h5'>Winner never quit, quitter never wins.</p>
        </Col>
        <Col className="col-5" style={{ backgroundColor: '#C4A484', borderRadius: '5px' }}>
          <p className='m-0'>
            <em>Your profile is 64% complete. A complete profile has higher chances of getting a job.</em>
          </p>
        </Col>
      </Row>

      <hr />
      <Card className='mt-5'>
        <Card.Body>
          <h4>Complete Your Profile</h4>
          <Form>
            <Row>
              <Col className='col-6'>
                <Form.Group controlId="fullName">
                  <Form.Label>Full Name:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col className='col-6'>
                <Form.Group controlId="photoUrl">
                  <Form.Label>Profile Photo URL:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your profile photo URL"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            {error && <p className="text-danger">{error}</p>}
            <div className='text-end mt-3'>
              <Button variant="primary" onClick={editProfile} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Edit'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditProfile;
