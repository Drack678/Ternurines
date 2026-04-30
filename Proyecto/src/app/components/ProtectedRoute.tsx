import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { User, UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = JSON.parse(userStr) as User;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
