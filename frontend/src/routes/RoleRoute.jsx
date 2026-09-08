import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, getBasePath } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={`${getBasePath()}/dashboard`} replace />;
  }

  return children;
};

export default RoleRoute;
