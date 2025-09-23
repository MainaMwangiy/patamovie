"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface AuthContextType {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null } | null;
  login: typeof signIn; 
  logout: typeof signOut; 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: signIn,
  logout: signOut,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user || null;

  return (
    <AuthContext.Provider value={{ user, login: signIn, logout: signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);