// ExpenseTracker.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, ListGroup, Dropdown } from 'react-bootstrap';
import { useAuth } from '../Authentication/AuthContext';
import './ExpenseTracker.css'; // Import your custom CSS for additional styling

const categories = ['Food', 'Petrol', 'Salary', 'Other'];

const ExpenseTracker = () => {
  const auth = useAuth();
  const [expenseList, setExpenseList] = useState([]);
  const [moneySpent, setMoneySpent] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    setExpenseList(storedExpenses);
  }, []);

  const addExpense = () => {
    const newExpense = {
      id: new Date().toISOString(),
      moneySpent,
      description,
      category: selectedCategory,
    };

    setExpenseList((prevExpenses) => [...prevExpenses, newExpense]);
    localStorage.setItem('expenses', JSON.stringify([...expenseList, newExpense]));

    setMoneySpent('');
    setDescription('');
    setSelectedCategory(categories[0]);
  };

  if (!auth.isLoggedIn) {
    return null;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <div className="expense-form">
            <h2>Expense Tracker</h2>
            <Form>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Money Spent:</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    type="number"
                    value={moneySpent}
                    onChange={(e) => setMoneySpent(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Description:</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Category:</Form.Label>
                </Col>
                <Col md={8}>
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-category">
                      {selectedCategory}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categories.map((category) => (
                        <Dropdown.Item
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={{ offset: 4, span: 8 }}>
                  <Button variant="primary" onClick={addExpense}>
                    Add Expense
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <div className="expense-list">
            <h3>Expense List</h3>
            <ListGroup>
              {expenseList.map((expense) => (
                <ListGroup.Item key={expense.id}>
                  <strong>{expense.moneySpent}</strong> - {expense.description} ({expense.category})
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpenseTracker;
