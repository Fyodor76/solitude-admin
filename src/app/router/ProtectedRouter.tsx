import { Navigate } from "react-router-dom";

interface ProtectedRouterProps {
  children: React.ReactNode;
}
const ProtectedRouter = ({ children }: ProtectedRouterProps) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/authorisation" replace />;
  }
  return <div>{children}</div>;
};

export default ProtectedRouter;
