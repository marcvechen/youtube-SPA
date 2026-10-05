import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}
export default ProtectedRoute;
