import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole, isAuthenticated } from '../services/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(Number(getRole()))) {
    return <div className="access-denied"><h2>Nemate pristup ovoj stranici</h2><p>Vaša korisnička uloga nema potrebnu dozvolu.</p></div>;
  }
  return children;
}
