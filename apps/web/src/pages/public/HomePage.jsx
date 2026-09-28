import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Leaf,
  MapPinned,
  Waves,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BeachCard } from "../../features/catalog/BeachCard.jsx";
import { useBeaches } from "../../features/catalog/catalog-api.js";
import { CardSkeleton, ErrorState } from "../../shared/ui/Feedback.jsx";
import { ParallaxHero } from "../../shared/ui/ParallaxHero.jsx";
import { SectionHeading } from "../../shared/ui/SectionHeading.jsx";

const principles = [
  {
    icon: Compass,
    title: "Descoberta local",
    text: "Lugares próximos que ainda ficam fora dos roteiros mais conhecidos.",
  },
  {
    icon: HeartHandshake,
    title: "Economia da região",
    text: "Visibilidade para quem acolhe, cozinha e movimenta cada comunidade.",
  },
  {
    icon: Leaf,
    title: "Turismo consciente",
    text: "Informação para visitar com respeito ao ambiente e às pessoas do lugar.",
  },
];

export default function HomePage() {
  const beaches = useBeaches();
  const featured =
    beaches.data?.filter((beach) => beach.featured).slice(0, 3) || [];

  return (
    <>
      <ParallaxHero
        image="/images/home-hero-1600.webp"
        mobileImage="/images/home-hero-640.webp"
        eyebrow="Um outro olhar para a nossa ilha"
        title={
          <>
            Há caminhos que o mapa <em>quase esqueceu.</em>
          </>
        }
        description="Descubra praias pouco conhecidas de São Luís e arredores, com histórias locais e serviços que fazem parte de cada rota."
        actions={
          <>
            <Link className="button button--coral" to="/praias">
              Explorar praias <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link className="button button--glass" to="/sobre">
              Conhecer o projeto
            </Link>
          </>
        }
      >
        <div className="hero-note">
          <Waves aria-hidden="true" />
          <span>
            <strong>Feito em São Luís</strong> por jovens que acreditam no
            território
          </span>
        </div>
      </ParallaxHero>

      <section className="section section--sand">
        <div className="container">
          <SectionHeading
            eyebrow="Rotas em destaque"
            title="Comece por onde o mar chama"
            description="Cada praia reúne o essencial para você planejar uma visita mais consciente."
          />
          {beaches.isLoading && <CardSkeleton />}
          {beaches.isError && (
            <ErrorState
              message={beaches.error.message}
              onRetry={beaches.refetch}
            />
          )}
          {featured.length > 0 && (
            <div className="card-grid">
              {featured.map((beach, index) => (
                <BeachCard
                  key={beach.id}
                  beach={beach}
                  priority={index === 0}
                />
              ))}
            </div>
          )}
          {!beaches.isLoading && !beaches.isError && (
            <div className="section-action">
              <Link className="button button--secondary" to="/praias">
                Ver todo o catálogo <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section purpose-section">
        <div className="container split-feature">
          <div className="split-feature__image organic-image">
            <img
              src="/images/ponta-verde-detail.webp"
              alt="Vista tranquila do litoral maranhense"
              loading="lazy"
            />
            <span className="floating-stamp">
              <MapPinned aria-hidden="true" /> Maranhão
              <br />
              por perto
            </span>
          </div>
          <div className="split-feature__content">
            <span className="eyebrow">Por que existimos</span>
            <h2>Visibilidade também é uma forma de cuidado.</h2>
            <p className="lead">
              O Hidden Route nasceu em um projeto escolar para aproximar pessoas
              de paisagens e pequenos negócios que raramente aparecem nos
              roteiros convencionais.
            </p>
            <p>
              Reunimos informações verificadas, mantemos lacunas visíveis quando
              um dado ainda não foi confirmado e damos espaço para que a
              comunidade contribua.
            </p>
            <Link className="text-link text-link--large" to="/sobre">
              Nossa história <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--ocean">
        <div className="container">
          <SectionHeading
            eyebrow="Nosso jeito de navegar"
            title="Descobrir sem passar por cima"
            description="O melhor roteiro é aquele que valoriza quem já está no caminho."
            align="center"
          />
          <div className="principles-grid">
            {principles.map(({ icon: Icon, title, text }, index) => (
              <article className="principle-card" key={title}>
                <span className="principle-card__index">0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-panel">
          <div>
            <span className="eyebrow">Conhece uma rota escondida?</span>
            <h2>Ajude o catálogo a crescer com responsabilidade.</h2>
          </div>
          <Link className="button button--primary" to="/contato">
            Conversar com a equipe <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
