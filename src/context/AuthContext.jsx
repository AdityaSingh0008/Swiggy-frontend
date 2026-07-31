import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import client from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem('sp_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await client.get('/auth/me');
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('sp_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('sp_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const { data } = await client.post('/auth/signup', { name, email, password });
    localStorage.setItem('sp_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('sp_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await client.get('/auth/me');
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
