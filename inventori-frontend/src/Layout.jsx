// src/Layout.jsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Layout() {
  const { user } = useAuth();
  const role = user?.role || "admin";
  const isAdmin = role === "admin";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    "side-link" + (isActive ? " side-link-active" : "");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-root">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="app-shell">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar}></div>
        )}

        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          {/* Close button for mobile */}
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            ✕
          </button>

          {/* Profile section - shown on both desktop and mobile */}
          <div className="sidebar-profile">
            <div className="sidebar-profile-avatar">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">{user?.name || "User"}</div>
              <div className="sidebar-profile-role">
                {user?.role === "admin" ? "ADMIN" : "STAFF"}
              </div>
            </div>
          </div>

          {/* Navigation - same structure for both desktop and mobile */}
          <nav className="sidebar-nav">
            {/* MASTER – khusus admin */}
            {isAdmin && (
              <div className="sidebar-section">
                <div className="sidebar-section-title">MASTER</div>
                <NavLink to="/barang" className={linkClass} onClick={closeSidebar}>
                  Barang
                </NavLink>
              </div>
            )}

            {/* TRANSAKSI */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">TRANSAKSI</div>
              <NavLink to="/barang-masuk" className={linkClass} onClick={closeSidebar}>
                Barang Masuk
              </NavLink>
              <NavLink to="/barang-keluar" className={linkClass} onClick={closeSidebar}>
                Barang Keluar
              </NavLink>
            </div>

            {/* LAPORAN */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">LAPORAN</div>
              <NavLink to="/laporan" className={linkClass} onClick={closeSidebar}>
                Laporan
              </NavLink>
            </div>

            {/* PENGATURAN */}
            <div className="sidebar-section">
              <div className="sidebar-section-title">PENGATURAN</div>
              <NavLink to="/profil" className={linkClass} onClick={closeSidebar}>
                Profil Saya
              </NavLink>
              {isAdmin && (
                <NavLink to="/users" className={linkClass} onClick={closeSidebar}>
                  Manajemen Staff
                </NavLink>
              )}
            </div>
          </nav>
        </aside>

        {/* KONTEN HALAMAN */}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
