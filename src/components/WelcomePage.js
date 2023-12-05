// WelcomePage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://expense-tracker-aa503-default-rtdb.firebaseio.com/users.json?auth=${auth.getToken()}`
        );

        const user = Object.values(response.data)[0];
        setUserData(user);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [auth]);

  const handleEdit = () => {
    navigate('/edit-profile');
  };

  const handleVerifyEmail = async () => {
    try {
      await auth.sendVerificationEmail();
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  return (
    <Container className="p-0 mt-3">
      <Row>
        <Col>
          <p className="m-0 h5">
            <em>Welcome to Expense Tracker!!!</em>
          </p>
        </Col>
        <Col
          xs="auto"
          className="text-end"
          style={{ backgroundColor: '#C4A484', borderRadius: '5px' }}
        >
          {isLoading ? (
            <p>Loading...</p>
          ) : userData ? (
            <div>
              <p className="m-0">
                <em>Welcome, {userData.fullName || 'User'}</em>
              </p>
              {!userData.emailVerified && (
                <Button variant="info" onClick={handleVerifyEmail}>
                  Verify Email
                </Button>
              )}
            </div>
          ) : (
            <p className="m-0">
              <em>
                Your profile is incomplete.
                <Link to="/complete-profile">
                  <Button variant="link" className="p-0 text-decoration-none">
                    <em>Complete now</em>
                  </Button>
                </Link>
              </em>
            </p>
          )}
        </Col>
      </Row>

      {!isLoading && userData && (
        <div>
          <hr />
          <Card className="mt-5">
            <Card.Body>
              <h3 className="mb-4">Your Details</h3>
              <Row className="mb-3">
                <Col className="col-4">
                  <strong>Full Name:</strong>
                </Col>
                <Col className="col-8">
                  <span>{userData.fullName || 'N/A'}</span>
                </Col>
              </Row>
             
              <Row>
                <Col className="col-4">
                  <strong>Profile Photo URL:</strong>
                </Col>
                <Col className="col-8">
                  <span>{userData.photoUrl || 'N/A'}</span>
                </Col>
              </Row>
              <div className="text-end mt-4">
                <Button variant="primary" onClick={handleEdit}>
                  Edit
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
};

export default WelcomePage;
