import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../shared/api/api-client.js";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children, client = api }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState("checking");

  const refresh = useCallback(async () => {
    setStatus("checking");
    try {
      const session = await client.get("/api/auth/me");
      setAdmin(session);
      setStatus("authenticated");
      return session;
    } catch {
      setAdmin(null);
      setStatus("anonymous");
      return null;
    }
  }, [client]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      admin,
      status,
      async login(credentials) {
        const session = await client.post("/api/auth/login", credentials);
        setAdmin(session);
        setStatus("authenticated");
        return session;
      },
      async logout() {
        await client.post("/api/auth/logout");
        setAdmin(null);
        setStatus("anonymous");
      },
      refresh,
    }),
    [admin, client, refresh, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
