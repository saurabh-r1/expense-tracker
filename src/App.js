
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Authentication/Login';
import DummyScreen from './components/DummyScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dummy-screen" element={<DummyScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
