"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./auth/auth-provider";
import { ReactNode } from "react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}