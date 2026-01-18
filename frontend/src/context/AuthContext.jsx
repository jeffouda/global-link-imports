import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize state synchronously from localStorage
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const userData = localStorage.getItem('user');
  const initialUser = accessToken && userData ? JSON.parse(userData) : null;
  const initialIsLoggedIn = !!initialUser;

  const [user, setUser] = useState(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  const login = (response) => {
    // response has access_token, refresh_token, user
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('role', response.user.role);
    localStorage.setItem('username', response.user.username);
    // Then set React state
    setUser(response.user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
  };

  const forgotPassword = async (email) => {
    const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  };

  const resetPassword = async (email, code, newPassword) => {
    const response = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, new_password: newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};