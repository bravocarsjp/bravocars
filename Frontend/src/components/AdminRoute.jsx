import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();

  // Derive isAuthenticated from user state
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has Admin role
  const isAdmin = user?.roles?.includes('Admin');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
