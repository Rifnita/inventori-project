// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Logo + nama aplikasi */}
        <div className="login-brand">
          <div className="brand-icon">INV</div>
          <div className="brand-text">
            <div className="brand-title">INVENTORI KANTOR</div>
            <div className="brand-subtitle">Sistem Manajemen Stok Barang</div>
          </div>
        </div>

        {/* Card login */}
        <div className="login-card">
          <h1 className="login-title">Masuk ke akun anda</h1>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email / Username</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <button
            type="button"
            className="link-small"
            onClick={() => alert("Fitur lupa password belum tersedia")}
          >
            Lupa password?
          </button>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <button type="button" className="link-footer">
            Komputasi Awan 2025
          </button>
        </div>
      </div>
    </div>
  );
}
