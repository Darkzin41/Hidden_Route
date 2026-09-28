import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../shared/ui/Loader.jsx";
import { useAuth } from "./use-auth.js";

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "checking")
    return <Loader label="Verificando sessão…" fullPage />;
  if (status !== "authenticated") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname, reason: "session" }}
      />
    );
  }
  return <Outlet />;
}
