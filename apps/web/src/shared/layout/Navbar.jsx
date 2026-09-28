import { useEffect, useRef, useState } from "react";
import { Menu, Shield, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useScrollDirection } from "../motion/motion.js";

const links = [
  { to: "/", label: "Início", end: true },
  { to: "/praias", label: "Praias" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

function NavigationLinks({ onNavigate, mobile = false }) {
  return links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `nav-link${isActive ? " nav-link--active" : ""}${mobile ? " nav-link--mobile" : ""}`
      }
    >
      {link.label}
    </NavLink>
  ));
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const location = useLocation();
  const containerRef = useRef(null);
  const visible = useScrollDirection({ locked: menuOpen || focused });

  useEffect(() => {
    setMenuOpen(false);
    setFocused(false);
  }, [location.pathname]);

  function handleBlur(event) {
    if (!containerRef.current?.contains(event.relatedTarget)) setFocused(false);
  }

  return (
    <header
      ref={containerRef}
      className="site-navbar"
      data-visible={visible}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={handleBlur}
    >
      <nav className="site-navbar__inner" aria-label="Navegação principal">
        <Link
          className="brand"
          to="/"
          aria-label="Hidden Route — página inicial"
        >
          <img src="/logo.svg" alt="" width="48" height="48" />
          <span>
            <strong>Hidden Route</strong>
            <small>São Luís · MA</small>
          </span>
        </Link>

        <div className="site-navbar__links">
          <NavigationLinks />
        </div>

        <NavLink
          className="admin-link"
          to="/admin/login"
          aria-label="Área administrativa"
        >
          <Shield size={18} aria-hidden="true" />
          <span>Admin</span>
        </NavLink>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className="mobile-navigation"
        data-testid="mobile-navigation"
        data-open={menuOpen}
        hidden={!menuOpen}
      >
        {menuOpen && (
          <>
            <NavigationLinks mobile onNavigate={() => setMenuOpen(false)} />
            <NavLink
              className="nav-link nav-link--mobile"
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
            >
              Área administrativa
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
