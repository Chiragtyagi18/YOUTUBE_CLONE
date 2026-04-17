import { createContext, useCallback, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (fullName, username, email, password, files = {}) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      
      if (files.avatar) formData.append('avatar', files.avatar);
      if (files.coverImage) formData.append('coverImage', files.coverImage);

      const response = await api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const userData = response.data.data?.user;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/users/login', { email, password });
      
      const token = response.data.data?.accessToken;
      const userData = response.data.data?.user;
      
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/users/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Logout failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      return response.data.data;
    } catch (err) {
      return null;
    }
  }, []);

  const updateProfile = useCallback(async ({ fullName, username }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/users/update-account', { fullName, username });
      const userData = response.data.data;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Update failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvatar = useCallback(async (avatarFile) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await api.put('/users/update-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const userData = response.data.data;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Avatar update failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoverImage = useCallback(async (coverFile) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('coverImage', coverFile);
      
      const response = await api.put('/users/update-cover-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const userData = response.data.data;
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Cover update failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    updateAvatar,
    updateCoverImage,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
