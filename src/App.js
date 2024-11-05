// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Recipes from './components/dashboard/Recipe';
import MealPlan from './components/dashboard/MealPlan';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// ProtectedRoute component to restrict access based on authentication
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
            
                 {/* Navbar will be visible on all protected pages */}
                <Routes>
                  <Route path="/dashboard" element={<Navbar><Dashboard /></Navbar>} />
                  <Route path="/recipes" element={<Navbar><Recipes /></Navbar>} />
                  <Route path="/mealplan" element={<Navbar><MealPlan /></Navbar>} />
                  {/* Default route for authenticated users */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
