import { BookOpen, Eye, HandHeart, ShieldCheck } from "lucide-react";
import { ParallaxHero } from "../../shared/ui/ParallaxHero.jsx";
import { SectionHeading } from "../../shared/ui/SectionHeading.jsx";

const values = [
  {
    icon: Eye,
    title: "Visibilidade",
    text: "Dar espaço a lugares e serviços que ainda aparecem pouco nos roteiros da ilha.",
  },
  {
    icon: ShieldCheck,
    title: "Responsabilidade",
    text: "Publicar apenas o que foi revisado e assumir com clareza o que ainda precisa ser confirmado.",
  },
  {
    icon: HandHeart,
    title: "Pertencimento",
    text: "Olhar para o território a partir de quem vive, estuda e trabalha nele.",
  },
];
const team = [
  "Ariel",
  "Bruno",
  "Daniel",
  "Marcos",
  "Samuel",
  "Thiago",
  "Weblly",
];

export default function AboutPage() {
  return (
    <>
      <ParallaxHero
        compact
        image="/images/about-hero-1600.webp"
        mobileImage="/images/about-hero-640.webp"
        eyebrow="Nossa história"
        title="Rotas que começam com curiosidade"
        description="Um projeto escolar que virou convite para enxergar São Luís e seus arredores com mais atenção."
      />
      <section className="section">
        <div className="container story-grid">
          <div className="story-number" aria-hidden="true">
            01
          </div>
          <article className="prose-panel">
            <span className="eyebrow">Como começou</span>
            <h2>Da sala de aula para a beira do mar</h2>
            <p className="lead">
              O Hidden Route nasceu de uma pergunta simples: quantas paisagens
              próximas continuam invisíveis para boa parte da cidade?
            </p>
            <p>
              Durante o ensino médio, nossa equipe reuniu tecnologia, pesquisa e
              identidade local para apresentar praias menos conhecidas e criar
              pontes com pequenos estabelecimentos próximos. Esta nova versão
              organiza o conteúdo em um catálogo vivo, conectado a um banco de
              dados real e preparado para crescer sem esconder as informações
              que ainda precisam de apuração.
            </p>
          </article>
          <div className="story-image organic-image">
            <img
              src="/images/team.webp"
              alt="Integrantes do projeto Hidden Route reunidos"
              loading="lazy"
            />
            <span className="image-caption">
              <BookOpen size={18} /> Tecnologia com propósito local
            </span>
          </div>
        </div>
      </section>
      <section className="section section--ocean">
        <div className="container">
          <SectionHeading
            eyebrow="O que orienta a rota"
            title="Missão, cuidado e verdade"
            description="Não precisamos inventar para valorizar: o território já tem muito a contar."
            align="center"
          />
          <div className="principles-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <article className="principle-card" key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--sand">
        <div className="container">
          <SectionHeading
            eyebrow="Quem construiu"
            title="Uma equipe, muitos olhares"
            description="Os estudantes que deram forma ao projeto original."
          />
          <div className="team-grid">
            {team.map((name) => (
              <article className="team-card" key={name}>
                <img
                  src={`/images/team-${name.toLowerCase()}-480.webp`}
                  alt={`Integrante ${name}`}
                  loading="lazy"
                />
                <div>
                  <h3>{name}</h3>
                  <span>Equipe Hidden Route</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
