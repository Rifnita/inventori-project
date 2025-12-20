import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar({ isOpen, onClose, user: propUser }) {
  const { user: contextUser } = useAuth();
  const user = propUser || contextUser;

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      {/* Close button for mobile */}
      <button className="sidebar-close-btn" onClick={onClose}>
        ✕
      </button>

      {/* Profile section - mobile only */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-greeting">Hello,</div>
          <div className="sidebar-profile-name">{user?.name || "User"}</div>
          <div className="sidebar-profile-role">
            {user?.role === "admin" ? "Admin" : "Staff"}
          </div>
        </div>
      </div>

      {/* MASTER: khusus admin */
      {user?.role === "admin" && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">MASTER</div>

          <NavLink
            to="/barang"
            className={({ isActive }) =>
              "side-link" + (isActive ? " side-link-active" : "")
            }
          >
            📦 Barang / Peralatan
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              "side-link" + (isActive ? " side-link-active" : "")
            }
          >
            👥 Manajemen Staff
          </NavLink>
        </div>
      )}

      {/* TRANSAKSI: admin + staff */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">TRANSAKSI</div>

        <NavLink
          to="/barang-masuk"
          className={({ isActive }) =>
            "side-link" + (isActive ? " side-link-active" : "")
          }
        >
          📥 Barang Masuk
        </NavLink>

        <NavLink
          to="/barang-keluar"
          className={({ isActive }) =>
            "side-link" + (isActive ? " side-link-active" : "")
          }
        >
          📤 Barang Keluar
        </NavLink>
      </div>

      {/* LAPORAN: admin only */}
      {user?.role === "admin" && (
        <div className="sidebar-section">
          <div className="sidebar-section-title">LAPORAN</div>

          <NavLink
            to="/laporan"
            className={({ isActive }) =>
              "side-link" + (isActive ? " side-link-active" : "")
            }
          >
            📊 Laporan Inventori
          </NavLink>
        </div>
      )}

      {/* PENGATURAN */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">PENGATURAN</div>

        <NavLink
          to="/profil"
          className={({ isActive }) =>
            "side-link" + (isActive ? " side-link-active" : "")
          }
        >
          ⚙️ Profil Akun
        </NavLink>
      </div>
    </aside>
  );
}
