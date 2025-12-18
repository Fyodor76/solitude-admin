import { Navigate } from 'react-router-dom';

interface ProtectedRouterProps {
  children: React.ReactNode;
}
const ProtectedRouter = ({ children }: ProtectedRouterProps) => {
  const isAuth = localStorage.getItem('isAuth');
  if (!isAuth) {
    return <Navigate to="/authorisation" replace />;
  }
  return <div>{children}</div>;
};

export default ProtectedRouter;
