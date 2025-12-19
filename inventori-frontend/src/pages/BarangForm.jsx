// src/pages/BarangForm.jsx
import { useEffect, useState } from "react";
import api from "../api";

export default function BarangForm({ onSaved, editing }) {
  const [form, setForm] = useState({
    nama_barang: "",
    kode_barang: "",
    kategori_id: "",
    stok: 0,
    satuan: "pcs",
    harga_beli: "",
    harga_jual: "",
  });
  const [kategoris, setKategoris] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/kategoris").then((res) => setKategoris(res.data));
  }, []);

  useEffect(() => {
    if (editing) {
      setForm({
        nama_barang: editing.nama_barang || "",
        kode_barang: editing.kode_barang || "",
        kategori_id: editing.kategori_id || "",
        stok: editing.stok || 0,
        satuan: editing.satuan || "pcs",
        harga_beli: editing.harga_beli || "",
        harga_jual: editing.harga_jual || "",
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/barangs/${editing.id}`, form);
      } else {
        await api.post("/barangs", form);
      }
      onSaved();
      if (!editing) {
        setForm({
          nama_barang: "",
          kode_barang: "",
          kategori_id: "",
          stok: 0,
          satuan: "pcs",
          harga_beli: "",
          harga_jual: "",
        });
      }
    } catch (err) {
      setError("Gagal menyimpan data. Cek kembali input kamu.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 mb-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-800 text-sm">
          {editing ? "Edit Barang" : "Tambah Barang"}
        </h2>
        {editing && (
          <button
            type="button"
            onClick={() => onSaved()}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Batal edit
          </button>
        )}
      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-3 text-sm">
        <div className="space-y-1">
          <label className="block text-xs text-slate-600">Nama Barang</label>
          <input
            name="nama_barang"
            value={form.nama_barang}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg w-full px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-slate-600">Kode Barang</label>
          <input
            name="kode_barang"
            value={form.kode_barang}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg w-full px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-slate-600">Kategori</label>
          <select
            name="kategori_id"
            value={form.kategori_id}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg w-full px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoris.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama_kategori}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs text-slate-600">Stok Awal</label>
          <input
            type="number"
            name="stok"
            value={form.stok}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg w-full px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
            min="0"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-slate-600">Satuan</label>
          <input
            name="satuan"
            value={form.satuan}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg w-full px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-slate-600">Harga Beli</label>
          <input
            type="number"
            name="harga_beli"
            value={form.harga_beli}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg w-full px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs text-slate-600">Harga Jual</label>
          <input
            type="number"
            name="harga_jual"
            value={form.harga_jual}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg w-full px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
      >
        {editing ? "Simpan Perubahan" : "Tambah Barang"}
      </button>
    </form>
  );
}