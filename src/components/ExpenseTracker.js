import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ListGroup,
  Dropdown,
} from "react-bootstrap";
import { useAuth } from "../Authentication/AuthContext";
import axios from "axios";
import "./ExpenseTracker.css";

const categories = ["Food", "Petrol", "Salary", "Other"];

const ExpenseTracker = () => {
  const auth = useAuth();
  const [expenseList, setExpenseList] = useState([]);
  const [moneySpent, setMoneySpent] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchExpenses();
    }
  }, [auth.isLoggedIn]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "https://expense-tracker-aa503-default-rtdb.firebaseio.com/expenses.json"
      );

      if (!response.data) {
        throw new Error("Failed to fetch expenses");
      }

      setExpenseList(Object.values(response.data));
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };

  const addExpense = async () => {
    try {
      if (
        !moneySpent ||
        isNaN(parseFloat(moneySpent)) ||
        description.trim() === ""
      ) {
        throw new Error(
          "Please enter valid values for Money Spent and Description."
        );
      }

      const newExpense = {
        moneySpent,
        description,
        category: selectedCategory,
      };

      console.log("Request body for addExpense:", newExpense);

      const response = await axios.post(
        "https://expense-tracker-aa503-default-rtdb.firebaseio.com/expenses.json",
        newExpense
      );

      if (!response.data) {
        throw new Error("Failed to add expense");
      }

      const newExpenseId = response.data.name;

      setExpenseList([...expenseList, { id: newExpenseId, ...newExpense }]);

      setMoneySpent("");
      setDescription("");
      setSelectedCategory(categories[0]);
    } catch (error) {
      console.error("Error adding expense:", error.message);
    }
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
                <Col md={3}>
                  <Form.Label>Money Spent:</Form.Label>
                  <br />
                  <Form.Control
                    type="number"
                    value={moneySpent}
                    onChange={(e) => setMoneySpent(Math.max(0, e.target.value))}
                    min="0"
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Description:</Form.Label>
                  <br />
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Col>
                <Col md={2}>
                  <Form.Label>Category:</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-category">
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
                <Col md={3} className="mt-4">
                  <Button
                    className="px-5"
                    variant="primary"
                    onClick={addExpense}
                  >
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
                  <strong>{expense.moneySpent}</strong> - {expense.description}{" "}
                  ({expense.category})
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
