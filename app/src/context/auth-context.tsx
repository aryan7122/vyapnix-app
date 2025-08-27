import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

interface User {
  mobile: string;
  role: 'customer' | 'delivery-boy' | 'delivery-partner';
}

interface AuthContextType {
  user: User | null;
  login: (mobile: string, role: User['role']) => void;
  register: (mobile: string, role: User['role']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // Navigate only after mount
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments]);

  const login = (mobile: string, role: User['role']) => {
    setUser({ mobile, role });
    router.replace("/(tabs)");
  };

  const register = (mobile: string, role: User['role']) => {
    setUser({ mobile, role });
    router.replace("/(tabs)");
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;
