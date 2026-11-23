import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Core Layouts & Auth Guard
import AdminLayout from './components/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages (Streamlined to Products & Articles + Login per the 5-Step Algorithm)
import Login from './pages/Login';
import AdminProducts from './pages/admin/Products';
import AdminArticles from './pages/admin/Articles';

export default function AppRouter() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Authentication Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes (Products and Articles & Blog) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
