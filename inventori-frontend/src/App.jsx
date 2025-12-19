// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BarangPage from "./pages/BarangPage.jsx";
import BarangMasukPage from "./pages/BarangMasukPage.jsx";
import BarangKeluarPage from "./pages/BarangKeluarPage.jsx";
import LaporanPage from "./pages/LaporanPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* SEMUA HALAMAN YANG BUTUH LOGIN */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/barang" element={<BarangPage />} />
          <Route path="/barang-masuk" element={<BarangMasukPage />} />
          <Route path="/barang-keluar" element={<BarangKeluarPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/profil" element={<ProfilePage />} />

          {/* 🔐 HANYA ADMIN YANG BOLEH AKSES HALAMAN INI */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
