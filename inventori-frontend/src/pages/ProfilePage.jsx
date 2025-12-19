// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, updateProfile, updatePassword } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [pwdForm, setPwdForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleProfileChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePwdChange = (e) => {
    setPwdForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      await updateProfile({ name: form.name, email: form.email });
      setMessage("Profil berhasil diperbarui.");
    } catch (err) {
      setMessage("Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!pwdForm.newPassword) {
      setMessage("Password baru tidak boleh kosong.");
      return;
    }
    setPwdSaving(true);
    try {
      await updatePassword({
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword,
      });
      setMessage("Password (dummy) berhasil diubah.");
      setPwdForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setMessage("Gagal mengubah password.");
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="page">
      {/* Judul halaman */}
      <div className="page-section-header">
        <h1 className="page-section-title">Profil Saya</h1>
        <p className="page-section-subtitle">
          Lihat dan perbarui informasi akun Anda.
        </p>
      </div>

      <div className="page-grid-2">
        {/* Card profil */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Informasi Akun</h2>
            <p className="form-card-subtitle">
              Data dasar akun yang digunakan untuk login.
            </p>
          </div>

          {message && (
            <div
              style={{
                marginBottom: 12,
                fontSize: 12,
                color: "#047857",
                backgroundColor: "#ecfdf5",
                border: "1px solid #bbf7d0",
                borderRadius: 6,
                padding: "6px 8px",
              }}
            >
              {message}
            </div>
          )}

          <form className="form-grid" onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user?.role === "admin" ? "Admin" : "Staff"}
                disabled
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
                style={{ width: "auto", minWidth: 120 }}
              >
                {saving ? "Menyimpan..." : "Simpan Profil"}
              </button>
            </div>
          </form>
        </div>

        {/* Card password */}
        <div className="form-card">
          <div className="form-card-header">
            <h2 className="form-card-title">Ubah Password</h2>
            <p className="form-card-subtitle">
              Untuk demo ini, perubahan password hanya disimpan secara dummy.
            </p>
          </div>

          <form className="form-grid" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Password Lama</label>
              <input
                type="password"
                name="oldPassword"
                value={pwdForm.oldPassword}
                onChange={handlePwdChange}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label>Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={pwdForm.newPassword}
                onChange={handlePwdChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-secondary btn-sm"
                disabled={pwdSaving}
              >
                {pwdSaving ? "Memproses..." : "Ubah Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
