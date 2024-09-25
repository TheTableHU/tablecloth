import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApi } from '../api'; // Adjust the path as needed

const ProtectedRoute = ({ children, allowedRoles }) => {
  const api = useApi();

  if (!api.loggedIn || !allowedRoles.includes(api.role)) {
    return <Navigate to="/" replace />;
  }

  return children; 
};

export default ProtectedRoute;
