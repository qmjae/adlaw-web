import React, { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const session = await account.get();
      setUser(session);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailSession(email, password);
      await checkUser();
    } catch (error) {
      throw new Error('Failed to login. Please check your credentials.');
    }
  };

  const register = async (email, password, name) => {
    try {
      await account.create('unique()', email, password, name);
      await login(email, password);
    } catch (error) {
      throw new Error('Failed to create account. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      throw new Error('Failed to logout.');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};