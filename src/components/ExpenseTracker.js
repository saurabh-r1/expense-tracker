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
  const [editingExpense, setEditingExpense] = useState(null);

  const userEmailFromStorage = localStorage.getItem('userEmail');
  const userEmail = userEmailFromStorage ? userEmailFromStorage.replace(/[@.]/g, '') : '';

  useEffect(() => {
    if (auth.isLoggedIn) {
      fetchExpenses();
    }
  }, [auth.isLoggedIn]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `https://expense-tracker-aa503-default-rtdb.firebaseio.com/expenses/${userEmail}.json`
      );

      if (!response.data) {
        throw new Error("Failed to fetch expenses");
      }

      const expensesWithIds = Object.keys(response.data).map((id) => ({
        id,
        ...response.data[id],
      }));

      setExpenseList(expensesWithIds);
    } catch (error) {
      console.error("Error fetching expenses:", error.message);
    }
  };

  const calculateTotalAmount = () => {
    return expenseList.reduce((total, expense) => total + parseFloat(expense.moneySpent), 0);
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

      const response = await axios.post(
        `https://expense-tracker-aa503-default-rtdb.firebaseio.com/expenses/${userEmail}.json`,
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

  const deleteExpense = async (expenseId) => {
    try {
      setExpenseList((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );

      const response = await axios.delete(
        `https://expense-tracker-aa503-default-rtdb.firebaseio.com/expenses/${userEmail}/${expenseId}.json`
      );

      if (!response.data) {
        throw new Error("Failed to delete expense");
      }

      console.log("Expense deleted successfully:", expenseId);
    } catch (error) {
      console.error("Error deleting expense:", error.message);

      // Revert the state in case of an error
      fetchExpenses();
    }
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
    setMoneySpent(expense.moneySpent);
    setDescription(expense.description);
    setSelectedCategory(expense.category);
  };

  const updateExpense = async () => {
    try {
      if (!moneySpent || isNaN(parseFloat(moneySpent)) || description.trim() === "") {
        throw new Error("Please enter valid values for Money Spent and Description.");
      }

      const updatedExpense = {
        moneySpent,
        description,
        category: selectedCategory,
      };

      const response = await axios.put(
        `https://expense-tracker-aa503-default-rtdb.firebaseio.com/expenses/${userEmail}/${editingExpense.id}.json`,
        updatedExpense
      );

      if (!response.data) {
        throw new Error("Failed to update expense");
      }

      // Update only the specific expense in the state
      setExpenseList((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === editingExpense.id ? { id: editingExpense.id, ...updatedExpense } : expense
        )
      );

      setMoneySpent("");
      setDescription("");
      setSelectedCategory(categories[0]);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error updating expense:", error.message);
    }
  };

  if (!auth.isLoggedIn) {
    return null;
  }

  const totalAmount = calculateTotalAmount();

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
                  {editingExpense ? (
                    <Button
                      className="px-5"
                      variant="warning"
                      onClick={updateExpense}
                    >
                      Update Expense
                    </Button>
                  ) : (
                    <Button
                      className="px-5"
                      variant="primary"
                      onClick={addExpense}
                    >
                      Add Expense
                    </Button>
                  )}
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
                  <Row>
                    <div className="col-8">
                      <strong> Money Spent: ₹ {expense.moneySpent}</strong><br/>
                      Description- {expense.description}<br/>
                      Category- ({expense.category})
                    </div>
                    <div className="expense-actions col-4">
                      <Button className="m-3 px-3" variant="danger" size="sm" onClick={() => deleteExpense(expense.id)} >
                        Delete
                      </Button>
                      <Button variant="info" size="sm" onClick={() => editExpense(expense)}>
                        Edit
                      </Button>
                    </div>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="total-amount mt-3">
              <strong>Total Amount: ₹ {totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ExpenseTracker;
