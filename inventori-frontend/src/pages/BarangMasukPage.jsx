// src/pages/BarangMasukPage.jsx
import { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function BarangMasukPage() {
  const { user } = useAuth();
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    tanggal: today,
    barang: "",
    jumlah: 1,
    supplier: "",
    catatan: "",
  });

  const [transaksiList, setTransaksiList] = useState([]);
  const [barangOptions, setBarangOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, incomingRes] = await Promise.all([
        api.get("/products"),
        api.get("/incoming-items")
      ]);

      const products = productsRes.data.data || productsRes.data;
      setBarangOptions(products);

      const incoming = incomingRes.data.data || incomingRes.data;
      setTransaksiList(incoming);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "jumlah" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.barang) {
      alert("Barang wajib dipilih.");
      return;
    }

    try {
      setLoadingSave(true);
      const payload = {
        product_id: form.barang,
        date: form.tanggal,
        quantity: form.jumlah,
        supplier: form.supplier,
        notes: form.catatan,
      };

      const response = await api.post("/incoming-items", payload);
      alert("Transaksi barang masuk berhasil disimpan");

      // Refresh data
      fetchData();

      // Reset form
      setForm((prev) => ({
        ...prev,
        jumlah: 1,
        supplier: "",
        catatan: "",
      }));
    } catch (error) {
      console.error("Error saving:", error);
      alert(error.response?.data?.message || "Gagal menyimpan transaksi");
    } finally {
      setLoadingSave(false);
    }
  };

  const totalTransaksi = transaksiList.length;

  return (
    <div className="page">
      {/* Header section */}
      <div className="page-section-header">
        <h1 className="page-section-title">Barang Masuk</h1>
        <p className="page-section-subtitle">
          Catat setiap barang yang diterima dari supplier.
        </p>
      </div>

      <div className="page-grid-2">
        {/* KIRI: INPUT BARANG MASUK */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Input Barang Masuk</h2>
            <p className="form-card-subtitle">
              Isi detail barang masuk kemudian klik <b>Simpan Transaksi</b>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>Tanggal Masuk</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Barang</label>
              <select
                name="barang"
                value={form.barang}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Barang --</option>
                {barangOptions.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code}) - Stok: {b.stock}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-inline">
              <div className="form-group">
                <label>Jumlah</label>
                <input
                  type="number"
                  name="jumlah"
                  min="1"
                  value={form.jumlah}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  placeholder="Nama supplier"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Catatan (opsional)</label>
              <input
                type="text"
                name="catatan"
                value={form.catatan}
                onChange={handleChange}
                placeholder="Contoh: Untuk persediaan bulan Desember"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loadingSave}>
                {loadingSave ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </div>
          </form>
        </div>

        {/* KANAN: RIWAYAT BARANG MASUK */}
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">
              Riwayat Barang Masuk{" "}
              <span className="table-card-title-count">
                (Total: {totalTransaksi} transaksi)
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Tanggal</th>
                  <th>Barang</th>
                  <th>Jumlah</th>
                  <th>Supplier</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      Memuat data...
                    </td>
                  </tr>
                ) : transaksiList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      Belum ada transaksi barang masuk. Tambahkan transaksi
                      melalui form di sebelah kiri.
                    </td>
                  </tr>
                ) : (
                  transaksiList.map((trx, index) => (
                    <tr key={trx.id}>
                      <td>{index + 1}</td>
                      <td>{new Date(trx.date).toLocaleDateString('id-ID')}</td>
                      <td>{trx.product?.name || "-"}</td>
                      <td>
                        <span className="badge-stock">{trx.quantity}</span>
                      </td>
                      <td>{trx.supplier || "-"}</td>
                      <td>{trx.notes || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            {transaksiList.length === 0
              ? "Belum ada data ditampilkan."
              : `Menampilkan 1 sampai ${transaksiList.length} dari ${transaksiList.length} transaksi`}
          </div>
        </div>
      </div>
    </div>
  );
}
