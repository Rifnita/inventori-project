// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // kembali ke halaman sebelumnya
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">

          {/* === TOMBOL BACK === */}
          <button
            type="button"
            className="topbar-back-btn"
            onClick={handleBack}
            aria-label="Kembali"
          >
            ←
          </button>

          {/* === LOGO & BRAND === */}
          <div className="topbar-logo">INV</div>
          <div className="topbar-brand">
            <div className="topbar-title">Gudang Kantor</div>
            <div className="topbar-subtitle">Dashboard Inventori</div>
          </div>
        </div>

        {/* === USER & LOGOUT === */}
        <div className="topbar-right">
          <span className="topbar-user-name">{user?.name || "Admin"}</span>

          <button
            type="button"
            className="topbar-logout"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
