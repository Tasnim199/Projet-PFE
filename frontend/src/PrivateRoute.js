import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si pas de token, rediriger vers la page de login
    return <Navigate to="/" />;
  }

  // Si un token est présent, autoriser l'accès à la page
  return <Outlet />;
};

export default PrivateRoute;
