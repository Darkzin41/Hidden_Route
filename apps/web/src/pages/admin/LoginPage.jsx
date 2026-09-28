import { ArrowLeft, Compass, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/use-auth.js";
import { useParallax } from "../../shared/motion/motion.js";

export default function LoginPage() {
  const { status, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const imageRef = useParallax(0.07);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requestStatus, setRequestStatus] = useState("idle");
  const [error, setError] = useState("");

  if (status === "authenticated") return <Navigate to="/admin" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setRequestStatus("submitting");
    setError("");
    try {
      await login({ email: email.trim().toLowerCase(), password });
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Não foi possível entrar.");
      setRequestStatus("error");
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__media" ref={imageRef}>
        <img src="/images/home-hero-1600.webp" alt="" />
      </div>
      <div className="login-page__veil" />
      <Link className="login-back" to="/">
        <ArrowLeft size={18} /> Voltar ao site
      </Link>
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <img src="/logo.svg" alt="" width="62" height="62" />
          <span>
            <strong>Hidden Route</strong>
            <small>Gestão do catálogo</small>
          </span>
        </div>
        <span className="login-icon">
          <LockKeyhole aria-hidden="true" />
        </span>
        <span className="eyebrow">Área restrita</span>
        <h1 id="login-title">Acesse o painel</h1>
        <p>
          Entre com as credenciais da equipe para atualizar rotas e moderar
          contribuições.
        </p>
        {location.state?.reason === "session" && (
          <p className="form-alert form-alert--error">
            Sua sessão terminou. Entre novamente.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              minLength="8"
              required
            />
          </label>
          {error && (
            <p className="form-alert form-alert--error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button button--primary login-submit"
            type="submit"
            disabled={requestStatus === "submitting"}
          >
            <Compass size={18} />
            {requestStatus === "submitting" ? "Entrando…" : "Entrar no painel"}
          </button>
        </form>
      </section>
    </main>
  );
}
