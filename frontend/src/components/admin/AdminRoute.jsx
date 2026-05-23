import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './AdminRoute.css';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="admin-route-loading">Loading...</div>;

  return user && user.isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;
