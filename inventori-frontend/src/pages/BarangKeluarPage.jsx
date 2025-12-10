// src/pages/BarangKeluarPage.jsx
import { useEffect, useState } from "react";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function BarangKeluarPage() {
  const { user } = useAuth();

  const [barangList, setBarangList] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);

  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    barangId: "",
    jumlah: 1,
    jenis: "dipinjam", // dipinjam / dipindah / rusak / lainnya
    keterangan: "",
  });

  const [selectedBarang, setSelectedBarang] = useState(null);

  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [lowStockWarning, setLowStockWarning] = useState("");

  /* ===================== LOAD DATA ===================== */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [barangRes, transaksiRes] = await Promise.all([
        api.get("/products"),
        api.get("/outgoing-items"),
      ]);

      const products = barangRes.data.data || barangRes.data;
      const outgoing = transaksiRes.data.data || transaksiRes.data;

      setBarangList(products);
      setTransaksiList(outgoing);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data barang keluar.");
    } finally {
      setLoadingData(false);
    }
  };

  /* ===================== HANDLER FORM ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "jumlah" ? Number(value) : value,
    }));

    if (name === "barangId") {
      const found = barangList.find((b) => String(b.id) === value);
      setSelectedBarang(found || null);
      setLowStockWarning("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.barangId) {
      alert("Silakan pilih barang / peralatan terlebih dahulu.");
      return;
    }
    if (!form.jumlah || form.jumlah <= 0) {
      alert("Jumlah keluar harus lebih dari 0.");
      return;
    }

    try {
      setLoadingSave(true);
      setError("");
      setLowStockWarning("");

      const payload = {
        product_id: form.barangId,
        date: form.tanggal,
        quantity: form.jumlah,
        recipient: form.jenis,
        notes: form.keterangan,
      };

      await api.post("/outgoing-items", payload);
      alert("Transaksi barang keluar berhasil disimpan");

      // Refresh data
      loadData();

      // Check low stock
      if (selectedBarang && selectedBarang.stock - form.jumlah < 10) {
        setLowStockWarning(
          `Stok "${selectedBarang.name}" sudah berada di batas minimum (${selectedBarang.stock - form.jumlah} ${selectedBarang.unit}).`
        );
      }

      // Reset form
      setForm((prev) => ({
        ...prev,
        jumlah: 1,
        keterangan: "",
      }));
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Gagal menyimpan transaksi barang keluar.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoadingSave(false);
    }
  };

  /* ===================== RENDER ===================== */

  return (
    <div className="page">
      {/* Judul halaman */}
      <div className="page-section-header">
        <h1 className="page-section-title">Barang / Peralatan Keluar</h1>
        <p className="page-section-subtitle">
          Catat barang yang keluar untuk dipinjam karyawan, dipindahkan, atau
          karena rusak. Stok akan berkurang secara otomatis.
        </p>
      </div>

      <div className="page-grid-2">
        {/* ---------- FORM INPUT ---------- */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Input Barang Keluar</h2>
            <p className="form-card-subtitle">
              Isi data barang keluar dengan lengkap agar riwayat inventori
              rapi.
            </p>
          </div>

          {error && (
            <div className="login-error" style={{ marginBottom: 12 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            {/* Tanggal */}
            <div className="form-group">
              <label>Tanggal Keluar</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                required
              />
            </div>

            {/* Barang */}
            <div className="form-group">
              <label>Barang / Peralatan</label>
              <select
                name="barangId"
                value={form.barangId}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Barang --</option>
                {barangList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code}) - Stok: {b.stock} {b.unit}
                  </option>
                ))}
              </select>
              {selectedBarang && (
                <small style={{ fontSize: 11, color: "#6b7280" }}>
                  Stok saat ini:{" "}
                  <strong>
                    {selectedBarang.stock} {selectedBarang.unit}
                  </strong>
                </small>
              )}
            </div>

            {/* Jumlah */}
            <div className="form-group">
              <label>Jumlah Keluar</label>
              <input
                type="number"
                name="jumlah"
                min={1}
                value={form.jumlah}
                onChange={handleChange}
                required
              />
            </div>

            {/* Jenis / keterangan singkat */}
            <div className="form-group">
              <label>Keterangan (Dipinjam / Dipindah / Rusak)</label>
              <div className="form-group-inline">
                <select
                  name="jenis"
                  value={form.jenis}
                  onChange={handleChange}
                >
                  <option value="dipinjam">Dipinjam</option>
                  <option value="dipindah">Dipindah</option>
                  <option value="rusak">Rusak</option>
                  <option value="lainnya">Lainnya</option>
                </select>
                <input
                  type="text"
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  placeholder="Contoh: Dipinjam Bagian IT / Pindah ke ruang rapat"
                />
              </div>
              <small style={{ fontSize: 11, color: "#6b7280" }}>
                Isi keterangan tambahan seperti nama peminjam, tujuan, atau
                lokasi.
              </small>
            </div>

            {lowStockWarning && (
              <div
                style={{
                  backgroundColor: "#fef3c7",
                  border: "1px solid #facc15",
                  color: "#92400e",
                  borderRadius: 6,
                  padding: "6px 8px",
                  fontSize: 12,
                }}
              >
                {lowStockWarning}
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loadingSave}
              >
                {loadingSave ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </div>
          </form>
        </div>

        {/* ---------- RIWAYAT TRANSAKSI ---------- */}
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <div className="table-card-title">Riwayat Barang Keluar</div>
              <div className="table-card-title-count">
                Total: {transaksiList.length} transaksi
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "90px" }}>Tanggal</th>
                  <th>Nama Barang</th>
                  <th style={{ width: "70px" }}>Jumlah</th>
                  <th style={{ width: "90px" }}>Jenis</th>
                  <th>Keterangan</th>
                  <th style={{ width: "90px" }}>Petugas</th>
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Memuat data…
                    </td>
                  </tr>
                ) : transaksiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Belum ada transaksi barang keluar yang tercatat.
                    </td>
                  </tr>
                ) : (
                  transaksiList.map((tx) => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.date).toLocaleDateString('id-ID')}</td>
                      <td>{tx.product?.name || "-"}</td>
                      <td>{tx.quantity}</td>
                      <td
                        style={{
                          textTransform: "capitalize",
                          fontSize: 12,
                        }}
                      >
                        {tx.recipient || "-"}
                      </td>
                      <td>{tx.notes || "-"}</td>
                      <td>{user?.name || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Riwayat transaksi semua peralatan yang keluar dari gudang.
          </div>
        </div>
      </div>
    </div>
  );
}
