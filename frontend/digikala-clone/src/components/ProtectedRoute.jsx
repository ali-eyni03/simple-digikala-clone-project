import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const ProtectedRoute = () => {
  const { authTokens } = useContext(AuthContext);

  return authTokens ? <Outlet /> : <Navigate to="/users/login/" />;
};

export default ProtectedRoute;
