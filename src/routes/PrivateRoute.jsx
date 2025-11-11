import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
// import { Spinner } from '../components/common/Spinner';
import Spinner from '../hooks/Spinner';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const accessToken=localStorage.getItem('authToken')
  if (isLoading) {
    return <Spinner />;
  }
  return isAuthenticated || accessToken ? children : <Navigate to="/login" replace />;

}
