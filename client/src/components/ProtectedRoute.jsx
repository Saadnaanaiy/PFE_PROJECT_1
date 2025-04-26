import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;