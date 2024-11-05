// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh-token'); // Adjust endpoint as necessary
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      setUser({ token: accessToken });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout(); // If refresh fails, logout the user
    }
  };

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = jwtDecode(token); // Use jwtDecode here
    return decodedToken.exp * 1000 < Date.now();
  };

  // Intercept API calls and check for token validity
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (user && isTokenExpired(token)) {
        await refreshToken();
      }
    };

    checkToken();
  }, [user]); // Run the effect when the user state changes

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
