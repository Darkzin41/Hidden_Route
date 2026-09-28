import { ArrowUpRight, Instagram, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="footer-brand">
          <img src="/logo.svg" alt="" width="58" height="58" />
          <div>
            <strong>Hidden Route</strong>
            <p>
              Rotas locais, histórias vivas e praias que merecem ser conhecidas
              com cuidado.
            </p>
          </div>
        </div>
        <div className="footer-links">
          <strong>Explore</strong>
          <Link to="/praias">Praias</Link>
          <Link to="/sobre">Sobre o projeto</Link>
          <Link to="/contato">Contato</Link>
        </div>
        <div className="footer-links">
          <strong>São Luís, Maranhão</strong>
          <span>
            <MapPin size={16} aria-hidden="true" /> Ilha do Amor
          </span>
          <span>
            <Mail size={16} aria-hidden="true" /> Canal pelo formulário
          </span>
          <span>
            <Instagram size={16} aria-hidden="true" /> Novidades em breve
          </span>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>
          © {new Date().getFullYear()} Hidden Route · Projeto educacional
        </span>
        <Link to="/admin/login">
          Acesso da equipe <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
