import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mctitoe_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('mctitoe_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('mctitoe_admin_token');
      if (!savedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const res = await adminApi.getMe();
        if (res.data) {
          setUser(res.data);
          localStorage.setItem('mctitoe_admin_user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        localStorage.removeItem('mctitoe_admin_token');
        localStorage.removeItem('mctitoe_admin_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();

    // Listen for unauthorized 401 events dispatched by apiClient
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('mctitoe_admin_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('mctitoe_admin_unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await adminApi.login(email, password);
    const { user: userData, token: tokenData } = res.data;

    localStorage.setItem('mctitoe_admin_token', tokenData);
    localStorage.setItem('mctitoe_admin_user', JSON.stringify(userData));

    setUser(userData);
    setToken(tokenData);
    return userData;
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('mctitoe_admin_token');
      localStorage.removeItem('mctitoe_admin_user');
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        logout,
      }}
    >
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

export default AuthContext;
