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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-root">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-shell">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar}></div>
        )}

        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          {/* user box */}
          <div className="sidebar-top">
            <div className="sidebar-user-avatar">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || "Admin"}</div>
              <div className="sidebar-user-role">
                {(user?.role || "admin").toUpperCase()}
              </div>
            </div>
          </div>

          {/* MASTER – khusus admin */}
          {isAdmin && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">MASTER</div>
              <NavLink to="/barang" className={linkClass} onClick={closeSidebar}>
                Barang
              </NavLink>
            </div>
          )}

          {/* TRANSAKSI – admin & staff */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">TRANSAKSI</div>
            <NavLink to="/barang-masuk" className={linkClass} onClick={closeSidebar}>
              Barang Masuk
            </NavLink>
            <NavLink to="/barang-keluar" className={linkClass} onClick={closeSidebar}>
              Barang Keluar
            </NavLink>
          </div>

          {/* LAPORAN – kalau mau hanya admin, pakai {isAdmin && (...)} */}
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

            {/* 🌟 MENU BARU: hanya muncul kalau role = admin */}
            {isAdmin && (
              <NavLink to="/users" className={linkClass} onClick={closeSidebar}>
                Manajemen Staff
              </NavLink>
            )}
          </div>
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
