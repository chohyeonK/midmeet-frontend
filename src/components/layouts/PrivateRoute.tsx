import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const PrivateRoute: React.FC = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();

  return isLoggedIn ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />;
};

export default PrivateRoute;
