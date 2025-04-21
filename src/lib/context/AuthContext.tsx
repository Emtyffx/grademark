"use client";
import React, { createContext, useContext } from "react";
import { ClientUser } from "../models/User";

export const AuthContext = createContext<ClientUser | null>(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  return auth;
}

export function AuthProvider({
  children,
  user,
}: React.PropsWithChildren & { user: ClientUser | null }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
