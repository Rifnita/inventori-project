// src/pages/BarangPage.jsx
import { useEffect, useState } from "react";
import api from "../api";

const DEFAULT_CATEGORIES = [
  "IT",
  "Elektronik",
  "Furniture",
  "Alat Tulis",
  "Kendaraan",
  "Lainnya",
];

export default function BarangPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    kode: "",
    kategori: "",
    satuan: "pcs",
    stokAwal: 0,
    hargaBeli: "",
    hargaJual: "",
    foto: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const products = response.data.data || response.data;
      
      // Map backend data to frontend format
      const mappedProducts = products.map(p => ({
        id: p.id,
        nama: p.name,
        kode: p.code,
        kategori: p.category,
        satuan: p.unit,
        stokAwal: p.stock,
        hargaBeli: p.purchase_price,
        hargaJual: p.selling_price,
        foto: p.photo || "",
        createdAt: p.created_at
      }));
      
      setItems(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Gagal memuat data barang");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nama: "",
      kode: "",
      kategori: "",
      satuan: "pcs",
      stokAwal: 0,
      hargaBeli: "",
      hargaJual: "",
      foto: "",
    });
    setEditingId(null);
    setPreviewPhoto(null);
  };

  // --- Handle input text/number/select ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "stokAwal" ? Number(value || 0) : value,
    }));
  };

  // --- Handle foto (hanya preview + simpan data URL lokal) ---
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewPhoto(null);
      setForm((prev) => ({ ...prev, foto: "" }));
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewPhoto(url);
    setForm((prev) => ({ ...prev, foto: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.kode) {
      alert("Nama dan Kode Barang wajib diisi.");
      return;
    }

    try {
      const payload = {
        name: form.nama,
        code: form.kode,
        category: form.kategori,
        unit: form.satuan,
        stock: form.stokAwal,
        purchase_price: form.hargaBeli || 0,
        selling_price: form.hargaJual || 0,
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        alert("Barang berhasil diupdate");
      } else {
        await api.post("/products", payload);
        alert("Barang berhasil ditambahkan");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Gagal menyimpan data barang");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nama: item.nama,
      kode: item.kode,
      kategori: item.kategori,
      satuan: item.satuan,
      stokAwal: item.stokAwal,
      hargaBeli: item.hargaBeli || "",
      hargaJual: item.hargaJual || "",
      foto: item.foto || "",
    });
    setPreviewPhoto(item.foto || null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus peralatan ini?")) return;
    
    try {
      await api.delete(`/products/${id}`);
      alert("Barang berhasil dihapus");
      fetchProducts();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Gagal menghapus barang");
    }
  };

  const sortedItems = [...items].sort((a, b) =>
    a.nama.localeCompare(b.nama, "id")
  );

  if (loading) {
    return (
      <div className="page">
        <div className="loading-text">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-section-header">
        <h1 className="page-section-title">Data Peralatan Kantor</h1>
        <p className="page-section-subtitle">
          Kelola seluruh inventaris kantor: tambah, ubah, dan hapus data alat.
        </p>
      </div>

      <div className="page-grid-2">
        {/* ====================== FORM PERALATAN ====================== */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">
              {editingId ? "Edit Peralatan" : "Tambah Peralatan"}
            </h2>
            <p className="form-card-subtitle">
              Isi informasi peralatan kantor, termasuk kategori dan stok awal.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nama & Kode */}
            <div className="form-group">
              <label>Nama Peralatan</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Contoh: Kursi Kerja Hitam"
                required
              />
            </div>

            <div className="form-group">
              <label>Kode Peralatan</label>
              <input
                type="text"
                name="kode"
                value={form.kode}
                onChange={handleChange}
                placeholder="Contoh: BRG-001"
                required
              />
            </div>

            {/* Kategori & Satuan */}
            <div className="form-group-inline">
              <div className="form-group">
                <label>Kategori</label>
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                >
                  <option value="">-- Pilih Kategori --</option>
                  {DEFAULT_CATEGORIES.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Satuan</label>
                <input
                  type="text"
                  name="satuan"
                  value={form.satuan}
                  onChange={handleChange}
                  placeholder="pcs, unit, set, dll"
                />
              </div>
            </div>

            {/* Stok Awal & Harga */}
            <div className="form-group-inline">
              <div className="form-group">
                <label>Stok Awal</label>
                <input
                  type="number"
                  name="stokAwal"
                  min="0"
                  value={form.stokAwal}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Harga Beli (opsional)</label>
                <input
                  type="number"
                  name="hargaBeli"
                  min="0"
                  value={form.hargaBeli}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Harga Jual (opsional)</label>
              <input
                type="number"
                name="hargaJual"
                min="0"
                value={form.hargaJual}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            {/* Foto (opsional) */}
            <div className="form-group">
              <label>Foto Peralatan (opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {previewPhoto && (
                <div className="item-photo-preview">
                  <img
                    src={previewPhoto}
                    alt="Preview"
                    className="item-photo-thumb"
                  />
                </div>
              )}
            </div>

            {/* Tombol */}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? "Simpan Perubahan" : "Tambah Peralatan"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={resetForm}
                  style={{ marginLeft: 8 }}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ====================== TABEL PERALATAN ====================== */}
        <div className="table-card">
          <div className="table-card-header">
            <div>
              <span className="table-card-title">Daftar Peralatan</span>
              <span className="table-card-title-count">
                ({items.length} data)
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Kode</th>
                  <th>Nama Peralatan</th>
                  <th>Kategori</th>
                  <th>Satuan</th>
                  <th>Stok Awal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      Belum ada peralatan yang terdaftar. Tambahkan data dari form di atas.
                    </td>
                  </tr>
                ) : (
                  sortedItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.foto ? (
                          <img
                            src={item.foto}
                            alt={item.nama}
                            className="item-photo-thumb"
                          />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td>{item.kode}</td>
                      <td>{item.nama}</td>
                      <td>{item.kategori || "-"}</td>
                      <td>{item.satuan || "-"}</td>
                      <td>{item.stokAwal}</td>
                      <td>
                        <button
                          type="button"
                          className="table-action-link"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="table-action-link danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Stok awal akan digunakan sebagai dasar perhitungan ketika transaksi
            barang masuk dan keluar berjalan.
          </div>
        </div>
      </div>
    </div>
  );
}