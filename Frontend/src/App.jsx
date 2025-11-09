import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LiveAuctionsPage from './pages/LiveAuctionsPage';
import CarDetail from './pages/CarDetail';
import ProfilePage from './pages/profile/ProfilePage';
import HowItWorksPage from './pages/HowItWorksPage';
import SellCarPage from './pages/SellCarPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Routes
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes - No Layout wrapper (has its own header/sidebar) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Auth Routes - No Layout wrapper (no navbar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* All other routes with Layout wrapper (Navbar + Footer) */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auctions" element={<LiveAuctionsPage />} />
                <Route path="/auctions/:id" element={<CarDetail />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/sell" element={<SellCarPage />} />

                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
