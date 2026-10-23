import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/common/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardRouter } from './pages/DashboardRouter';
import { BooksPage } from './pages/BooksPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { IssuesPage } from './pages/IssuesPage';
import { StudentsPage } from './pages/StudentsPage';
import { LibrariansPage } from './pages/LibrariansPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForbiddenPage } from './pages/ForbiddenPage';

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardRouter />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/categories" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']} />
              }>
                <Route index element={<CategoriesPage />} />
              </Route>
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/assistant" element={<AiAssistantPage />} />
              <Route path="/students" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']} />
              }>
                <Route index element={<StudentsPage />} />
              </Route>
              <Route path="/librarians" element={
                <ProtectedRoute allowedRoles={['ADMIN']} />
              }>
                <Route index element={<LibrariansPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
