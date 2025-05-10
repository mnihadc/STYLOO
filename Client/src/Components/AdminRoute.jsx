// src/Components/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Only allow access if the role is 'admin' or 'super admin'
  if (currentUser.role === "admin") {
    return <Outlet />;
  }

  // Redirect unauthorized users
  return <Navigate to="/" replace />;
};

export default AdminRoute;
