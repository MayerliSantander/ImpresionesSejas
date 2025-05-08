import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles, children }) {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
