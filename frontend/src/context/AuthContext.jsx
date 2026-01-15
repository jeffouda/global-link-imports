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

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};