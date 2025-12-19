// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Saat masih cek token/user
  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        Memuat data pengguna...
      </div>
    );
  }

  // Jika belum login → redirect ke login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based protection
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Jika `children` ada → render children
  // (dipakai untuk route khusus role admin)
  if (children) {
    return children;
  }

  // Jika tidak ada children → berarti dipakai sebagai wrapper nested route
  return <Outlet />;
}
