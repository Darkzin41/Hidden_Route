import {
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  Menu,
  Store,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/use-auth.js";

const links = [
  { to: "/admin", end: true, label: "Visão geral", icon: LayoutDashboard },
  { to: "/admin/praias", label: "Praias", icon: Map },
  { to: "/admin/parceiros", label: "Parceiros", icon: Store },
  { to: "/admin/avaliacoes", label: "Avaliações", icon: ClipboardCheck },
  { to: "/admin/mensagens", label: "Mensagens", icon: Mail },
];

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  async function signOut() {
    await logout();
    navigate("/admin/login", { replace: true });
  }
  return (
    <div className="admin-shell" data-menu-open={open}>
      <button
        className="admin-mobile-toggle"
        type="button"
        aria-label={open ? "Fechar navegação" : "Abrir navegação"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <aside className="admin-sidebar">
        <NavLink className="admin-brand" to="/">
          <img src="/logo.svg" alt="" />
          <span>
            <strong>Hidden Route</strong>
            <small>Painel editorial</small>
          </span>
        </NavLink>
        <nav aria-label="Navegação administrativa">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? " admin-nav-link--active" : ""}`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-profile">
          <span className="admin-avatar">{admin?.name?.charAt(0) || "A"}</span>
          <span>
            <strong>{admin?.name}</strong>
            <small>{admin?.email}</small>
          </span>
        </div>
        <button className="admin-logout" type="button" onClick={signOut}>
          <LogOut size={18} /> Sair do painel
        </button>
      </aside>
      {open && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Fechar navegação"
          onClick={() => setOpen(false)}
        />
      )}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
