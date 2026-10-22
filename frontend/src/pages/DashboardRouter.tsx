import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { LibrarianDashboard } from './LibrarianDashboard';
import { StudentDashboard } from './StudentDashboard';

export const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <AdminDashboard />;
  if (user.role === 'LIBRARIAN') return <LibrarianDashboard />;
  return <StudentDashboard />;
};
