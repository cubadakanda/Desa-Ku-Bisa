import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("desa-ku-bisa-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("desa-ku-bisa-token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("desa-ku-bisa-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("desa-ku-bisa-user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("desa-ku-bisa-token", token);
    } else {
      localStorage.removeItem("desa-ku-bisa-token");
    }
  }, [token]);

  const login = async (nik, password) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nik, password }),
      });

      if (!response.ok) {
        throw new Error("Login gagal");
      }

      const data = await response.json();
      const nextUser = data.user || {
        id: data.id,
        nik: data.nik,
        name: data.name,
        role: data.role,
      };

      setUser(nextUser);
      setToken(data.token);
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
