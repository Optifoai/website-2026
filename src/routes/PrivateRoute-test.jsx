import { Navigate } from 'react-router-dom';
import Spinner from '../hooks/Spinner';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function PrivateRoute({ children, isAuthenticated, isLoading }) {
  const accessToken = localStorage.getItem('authToken');
  if (isLoading) {
    return <Spinner />;
  }

  // Use isAuthenticated from Redux props, with accessToken as a fallback
  return isAuthenticated || accessToken ? children : <Navigate to="/login" replace />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const mapStateToProps = ({ login }) => {
  return {
    isAuthenticated: login.isAuthenticated,
    isLoading: login.loader,
  };
}

export default connect(mapStateToProps)(PrivateRoute);
