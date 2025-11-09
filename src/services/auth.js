// src/services/auth.js
import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/user/login', credentials);
  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// You might also have a function to verify the token or fetch user details
export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};
