import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/auth'; // API calls

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd validate the token with your backend
      // For simplicity, we'll assume a token means authenticated
      // You might also fetch user details here
      setIsAuthenticated(true);
      // Example: setUser({ username: 'testuser' });
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    console.log('credentials',credentials);
    try {
      setIsLoading(true);
      const data = await authService.login(credentials); // Call your backend API
        console.log('credentials data',data?.responseData?.accessToken,data);
      localStorage.setItem('authToken', data?.responseData?.accessToken);
      setIsAuthenticated(true);
      setUser(data.user); // Store user data
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      setIsLoading(true);
      const data = await authService.signup(userData); // Call your backend API
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      setUser(data.user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(email); // Call your backend API
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Forgot password request failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
