import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { API_BASE_URL, getErrorMessage } from "../api";
import type { AuthResponse } from "../types";
import { AuthContext } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("blog-token"),
  );

  const saveToken = (nextToken: string) => {
    localStorage.setItem("blog-token", nextToken);
    setToken(nextToken);
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    const data: AuthResponse = await response.json();
    saveToken(data.token);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    const data: AuthResponse = await response.json();
    saveToken(data.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("blog-token");
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout,
    }),
    [token, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
