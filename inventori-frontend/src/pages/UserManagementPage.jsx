// src/pages/UserManagementPage.jsx
import { useEffect, useState } from "react";
import api from "../api.js";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data staff.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      await api.post("/users", form); // sesuaikan kalau endpoint beda
      setForm({ name: "", email: "", password: "", role: "staff" });
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data staff.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus staff ini?")) return;
    try {
      setSaving(true);
      setError("");
      await api.delete(`/users/${id}`); // sesuaikan dengan backend
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus staff.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-section-header">
        <h1 className="page-section-title">Manajemen Staff</h1>
        <p className="page-section-subtitle">
          Tambah dan kelola akun staff yang dapat mengakses sistem inventori.
        </p>
      </div>

      <div className="page-grid-2">
        {/* FORM TAMBAH STAFF */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Tambah Staff</h2>
            <p className="form-card-subtitle">
              Isi data lengkap untuk membuat akun staff baru.
            </p>
          </div>

          {error && (
            <div className="login-error" style={{ marginBottom: 12 }}>
              {error}
            </div>
          )}

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nama staff"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="staff@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan Staff"}
              </button>
            </div>
          </form>
        </div>

        {/* TABEL LIST STAFF */}
        <div className="table-card">
          <div className="table-card-header" style={{ padding: 0 }}>
            <div className="table-card-title">
              Daftar Staff
              <span className="table-card-title-count">
                {" "}
                • {users.length} user
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>No.</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th style={{ width: 90 }}>Role</th>
                  <th style={{ width: 90 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      Memuat data...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      Belum ada data staff.
                    </td>
                  </tr>
                ) : (
                  users.map((u, idx) => (
                    <tr key={u.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => handleDelete(u.id)}
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
            Hanya admin yang dapat menambah atau menghapus akun staff.
          </div>
        </div>
      </div>
    </div>
  );
}
