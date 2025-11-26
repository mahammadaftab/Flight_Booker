import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth as authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage or API)
    const token = localStorage.getItem('accessToken');
    if (token) {
      // In a real app, you would validate the token and fetch user data
      // For now, we'll decode the token to get user info
      try {
        // This is a simplified approach - in production, you would decode the JWT properly
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: userData.userId || userData.id,
          firstName: userData.firstName || userData.name || 'User',
          lastName: userData.lastName || '',
          email: userData.email,
          role: userData.role || 'user'
        });
      } catch (error) {
        console.error('Failed to parse token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Set user data from response
      const userData = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role
      };
      
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    authService.logout()
      .catch(error => console.error('Logout error:', error))
      .finally(() => {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const response = await authService.register(firstName, lastName, email, password);
      
      // Return user data from response
      return {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        role: response.user.role
      };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};