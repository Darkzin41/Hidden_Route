import { Outlet } from "react-router-dom";
import { Footer } from "./Footer.jsx";
import { Navbar } from "./Navbar.jsx";
import { ScrollToTop } from "./ScrollToTop.jsx";

export function PublicLayout() {
  return (
    <div className="public-shell">
      <ScrollToTop />
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
