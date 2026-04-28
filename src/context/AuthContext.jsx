import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/**
 * AuthProvider — manages mock authentication state.
 * Credentials are loaded from environment variables (VITE_ADMIN_EMAIL, VITE_ADMIN_PASSWORD).
 * Persists login state via localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("eduadmin_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("eduadmin_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (email === envEmail && password === envPassword) {
      const userData = { email, name: "Admin User", role: "admin" };
      setUser(userData);
      localStorage.setItem("eduadmin_user", JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduadmin_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
