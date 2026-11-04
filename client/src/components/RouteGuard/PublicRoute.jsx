import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  // If already authenticated, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Never block guest pages (like Login / Register) with a full-screen loading spinner
  return children;
};

export default PublicRoute;
