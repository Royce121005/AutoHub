import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

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
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const toast = useToast();

  // Load User Favorites
  const fetchFavorites = useCallback(async () => {
    try {
      const data = await api.get('/favorites');
      setFavorites(data.favorites);
      setFavoriteIds(new Set(data.favorites.map(fav => fav.carId?._id || fav.carId)));
    } catch (err) {
      console.error('Error fetching favorites:', err.message);
    }
  }, []);

  // Check if token exists and fetch profile
  const checkUserSession = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const data = await api.get('/auth/profile', { signal: controller.signal });
      clearTimeout(timeoutId);
      setUser(data.user);
      await fetchFavorites();
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('Session validation notice:', err.message);
      // Only clear credentials on actual unauthorized (401) error, not on cold-start timeout
      if (err.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFavorites]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  // Register
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setFavorites([]);
      setFavoriteIds(new Set());
      toast.success(`Welcome to AutoHub, ${data.user.name}!`);
      return data;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      await fetchFavorites();
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setFavorites([]);
    setFavoriteIds(new Set());
    toast.info('You have logged out.');
  }, [toast]);

  // Update Profile
  const updateProfile = async (profileData) => {
    try {
      const data = await api.put('/auth/profile', profileData);
      setUser(data.user);
      toast.success('Profile updated successfully.');
      return data;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  // Change Password
  const changePassword = async (passwords) => {
    try {
      const data = await api.put('/auth/change-password', passwords);
      toast.success('Password updated successfully.');
      return data;
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
      throw err;
    }
  };

  // Delete Account
  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete-account');
      logout();
      toast.warning('Your account has been deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete account');
      throw err;
    }
  };

  // Toggle Favorite logic
  const toggleFavorite = async (carId) => {
    if (!user) {
      toast.info('Please log in to add listings to favorites.');
      return false;
    }

    const isFav = favoriteIds.has(carId);
    
    // Optimistic UI updates
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(carId);
      else next.add(carId);
      return next;
    });

    try {
      if (isFav) {
        await api.delete(`/favorites/${carId}`);
        toast.info('Removed from favorites');
      } else {
        await api.post(`/favorites/${carId}`);
        toast.success('Added to favorites');
      }
      // Re-fetch full favorites list in the background
      await fetchFavorites();
      return true;
    } catch (err) {
      // Revert optimistic UI if api fails
      setFavoriteIds(prev => {
        const next = new Set(prev);
        if (isFav) next.add(carId);
        else next.delete(carId);
        return next;
      });
      toast.error(err.message || 'Failed to update favorite status');
      return false;
    }
  };

  const isFavorite = useCallback((carId) => {
    return favoriteIds.has(carId);
  }, [favoriteIds]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favorites,
        favoriteIds,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
        toggleFavorite,
        isFavorite,
        refreshFavorites: fetchFavorites
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
