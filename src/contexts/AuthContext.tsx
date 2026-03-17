import React, { createContext, useContext, useState, useCallback } from "react";
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "contractor" | "freelancer";
  phone?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  joinedDate: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const MOCK_USER: User = {
  id: "1",
  name: "Nguyễn Văn An",
  email: "an.nguyen@example.com",
  role: "contractor",
  phone: "0912 345 678",
  bio: "Nhà phát triển Full-stack với hơn 5 năm kinh nghiệm. Chuyên về React, Node.js và hệ thống thanh toán.",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Figma"],
  location: "TP. Hồ Chí Minh",
  joinedDate: "2024-01-15",
};
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fv_user");
    return saved ? JSON.parse(saved) : null;
  });
  const login = useCallback(async (email: string, _password: string) => {
    // Mock login
    await new Promise((r) => setTimeout(r, 800));
    const loggedUser = { ...MOCK_USER, email };
    setUser(loggedUser);
    localStorage.setItem("fv_user", JSON.stringify(loggedUser));
  }, []);
  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 800));
      const newUser: User = {
        ...MOCK_USER,
        name,
        email,
        id: Date.now().toString(),
      };
      setUser(newUser);
      localStorage.setItem("fv_user", JSON.stringify(newUser));
    },
    [],
  );
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("fv_user");
  }, []);
  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem("fv_user", JSON.stringify(updated));
      return updated;
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
