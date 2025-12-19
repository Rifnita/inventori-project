// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // kembali ke halaman sebelumnya
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          {/* === HAMBURGER MENU (Mobile) === */}
          <button
            type="button"
            className="topbar-menu-btn"
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>

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
