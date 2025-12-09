// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("inventori_user");
    
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("inventori_user");
      }
    }
    setLoading(false);
  }, []);

  // Login with backend API
  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const { token, user: userData } = response.data;

      // Save token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("inventori_user", JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("INVALID_CREDENTIAL");
      }
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("inventori_user");
      setUser(null);
    }
  };

  // Update profile
  const updateProfile = async (partial) => {
    try {
      const response = await api.put("/profile", partial);
      const updatedUser = response.data.user;
      
      setUser(updatedUser);
      localStorage.setItem("inventori_user", JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Update profile failed");
    }
  };

  // Update password
  const updatePassword = async ({ oldPassword, newPassword }) => {
    try {
      await api.post("/change-password", { 
        current_password: oldPassword, 
        new_password: newPassword 
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Change password failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateProfile, updatePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}