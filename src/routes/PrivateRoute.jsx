import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
// import { Spinner } from '../components/common/Spinner';
import Spinner from '../hooks/Spinner';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
}
