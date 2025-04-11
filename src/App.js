import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import { isAuthenticated } from './services/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/users"
          element={isAuthenticated() ? <Users /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/new"
          element={isAuthenticated() ? <UserForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/:id/edit"
          element={isAuthenticated() ? <UserForm /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/users" />} />
      </Routes>
    </Router>
  );
}

export default App;