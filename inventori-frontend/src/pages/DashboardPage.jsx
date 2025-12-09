// src/pages/DashboardPage.jsx
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import api from "../api";

export default function DashboardPage() {
  const { user } = useAuth();
  const isStaff = user?.role === "staff";

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalBarang: 0,
    totalBarangMasuk: 0,
    totalBarangKeluar: 0,
    totalUser: 0,
    totalTransaksiSaya: 0,
  });
  const [minStock, setMinStock] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard");
      const data = response.data;

      setSummary({
        totalBarang: data.summary?.total_products || 0,
        totalBarangMasuk: data.summary?.monthly_incoming || 0,
        totalBarangKeluar: data.summary?.monthly_outgoing || 0,
        totalUser: 0, // Nanti bisa tambahkan endpoint untuk user count
        totalTransaksiSaya: data.summary?.today_incoming + data.summary?.today_outgoing || 0,
      });

      // Products with low stock (< 10)
      const lowStockProducts = (data.top_products || [])
        .filter(p => p.stock < 10)
        .map(p => ({
          id: p.id,
          kode: p.code,
          nama: p.name,
          jenis: p.category,
          stok: p.stock,
          satuan: p.unit
        }));
      setMinStock(lowStockProducts);

      // Recent transactions
      const incoming = (data.recent_incoming || []).map(item => ({
        id: `in-${item.id}`,
        tanggal: new Date(item.date).toLocaleDateString('id-ID'),
        jenis: 'Masuk',
        barang: item.product?.name || '-',
        jumlah: item.quantity,
        keterangan: item.notes || item.supplier || '-'
      }));

      const outgoing = (data.recent_outgoing || []).map(item => ({
        id: `out-${item.id}`,
        tanggal: new Date(item.date).toLocaleDateString('id-ID'),
        jenis: 'Keluar',
        barang: item.product?.name || '-',
        jumlah: item.quantity,
        keterangan: item.notes || item.recipient || '-'
      }));

      setRecentTransactions([...incoming, ...outgoing].sort((a, b) => 
        new Date(b.tanggal) - new Date(a.tanggal)
      ).slice(0, 10));

    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading dashboard data...
        </div>
      </div>
    );
  }

  /* =================== DASHBOARD STAFF =================== */
  if (isStaff) {
    return (
      <div className="page">
        <div className="page-header-bar">
          <div className="page-header-icon">📊</div>
          <div>
            <h2 className="page-header-title">Dashboard</h2>
            <p className="page-header-subtitle">
              Selamat datang, <strong>{user?.name || "Staff"}</strong>. Berikut
              ringkasan aktivitas inventori Anda.
            </p>
          </div>
        </div>

        {/* Kartu ringkasan staff */}
        <div className="stats-row">
          <div className="stat-card small">
            <div className="stat-icon green">📥</div>
            <div className="stat-info">
              <span className="stat-label">Data Barang Masuk</span>
              <span className="stat-value">
                {summary.totalBarangMasuk ?? 0}
              </span>
            </div>
          </div>

          <div className="stat-card small">
            <div className="stat-icon orange">📤</div>
            <div className="stat-info">
              <span className="stat-label">Data Barang Keluar</span>
              <span className="stat-value">
                {summary.totalBarangKeluar ?? 0}
              </span>
            </div>
          </div>

          <div className="stat-card small">
            <div className="stat-icon blue">🧾</div>
            <div className="stat-info">
              <span className="stat-label">Transaksi yang Anda catat</span>
              <span className="stat-value">
                {summary.totalTransaksiSaya ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Aksi cepat */}
        <div className="table-card" style={{ marginTop: 12, paddingTop: 12 }}>
          <div className="table-card-header">
            <div>
              <div className="table-card-title">Aksi Cepat</div>
              <div className="table-card-title-count">
                Catat transaksi barang lebih cepat.
              </div>
            </div>
            <div className="table-card-tools">
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => (window.location.href = "/barang-masuk")}
              >
                + Barang Masuk
              </button>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => (window.location.href = "/barang-keluar")}
              >
                + Barang Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Riwayat transaksi staff */}
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-card-title">Riwayat Transaksi Terbaru</div>
              <div className="table-card-title-count">
                Menampilkan beberapa transaksi barang masuk & keluar terakhir
                yang Anda catat.
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "70px" }}>Tanggal</th>
                  <th style={{ width: "80px" }}>Jenis</th>
                  <th>Nama Barang</th>
                  <th style={{ width: "80px" }}>Jumlah</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      Belum ada transaksi yang dicatat. Silakan mulai dari menu{" "}
                      <strong>Barang Masuk</strong> atau{" "}
                      <strong>Barang Keluar</strong>.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.tanggal}</td>
                      <td>{tx.jenis}</td>
                      <td>{tx.barang}</td>
                      <td>{tx.jumlah}</td>
                      <td>{tx.keterangan || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            {recentTransactions.length === 0
              ? "Menunggu transaksi pertama Anda."
              : `Menampilkan ${recentTransactions.length} transaksi terbaru.`}
          </div>
        </div>
      </div>
    );
  }

  /* =================== DASHBOARD ADMIN =================== */
  return (
    <div className="page">
      <div className="page-header-bar">
        <div className="page-header-icon">📊</div>
        <div>
          <h2 className="page-header-title">Dashboard</h2>
          <p className="page-header-subtitle">
            Hai, <strong>{user?.name || "Admin"}</strong>. Pantau ringkasan
            inventori gudang di sini.
          </p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card small">
          <div className="stat-icon purple">📦</div>
          <div className="stat-info">
            <span className="stat-label">Data Barang</span>
            <span className="stat-value">{summary.totalBarang ?? 0}</span>
          </div>
        </div>

        <div className="stat-card small">
          <div className="stat-icon green">📥</div>
          <div className="stat-info">
            <span className="stat-label">Data Barang Masuk</span>
            <span className="stat-value">
              {summary.totalBarangMasuk ?? 0}
            </span>
          </div>
        </div>

        <div className="stat-card small">
          <div className="stat-icon orange">📤</div>
          <div className="stat-info">
            <span className="stat-label">Data Barang Keluar</span>
            <span className="stat-value">
              {summary.totalBarangKeluar ?? 0}
            </span>
          </div>
        </div>

        <div className="stat-card small">
          <div className="stat-icon blue">👤</div>
          <div className="stat-info">
            <span className="stat-label">Data User</span>
            <span className="stat-value">{summary.totalUser ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div>
            <div className="table-card-title">
              Stok barang telah mencapai batas minimum
            </div>
            <div className="table-card-title-count">
              Daftar barang yang perlu segera dicek stoknya.
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>No.</th>
                <th>ID Barang</th>
                <th>Nama Barang</th>
                <th style={{ width: "120px" }}>Jenis Barang</th>
                <th style={{ width: "80px" }}>Stok</th>
                <th style={{ width: "80px" }}>Satuan</th>
              </tr>
            </thead>
            <tbody>
              {minStock.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Belum ada data stok minimum. Data akan muncul setelah Anda
                    menambahkan barang dan mengatur stoknya.
                  </td>
                </tr>
              ) : (
                minStock.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{item.kode || item.idBarang}</td>
                    <td>{item.nama || item.namaBarang}</td>
                    <td>{item.jenis || item.jenisBarang}</td>
                    <td>
                      <span className="badge-stock">
                        {item.stok ?? item.stock ?? 0}
                      </span>
                    </td>
                    <td>{item.satuan || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          {minStock.length === 0
            ? "Semua stok dalam kondisi aman. 🎉"
            : `Menampilkan ${minStock.length} barang dengan stok minimum.`}
        </div>
      </div>
    </div>
  );
}
