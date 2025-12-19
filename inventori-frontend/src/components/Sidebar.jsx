import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      {/* User info */}
      <div className="sidebar-top">
        <div className="sidebar-user-avatar">
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || "User"}</div>
          <div className="sidebar-user-role">
            {user?.role === "admin" ? "ADMIN" : "STAFF"}
          </div>
        </div>
      </div>

      {/* MASTER: khusus admin */}
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
