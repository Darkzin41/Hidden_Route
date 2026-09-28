import {
  ArrowLeft,
  ExternalLink,
  Globe2,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ReviewForm } from "../../features/reviews/ReviewForm.jsx";
import { useBeach } from "../../features/catalog/catalog-api.js";
import { api } from "../../shared/api/api-client.js";
import { ErrorState } from "../../shared/ui/Feedback.jsx";
import { Loader } from "../../shared/ui/Loader.jsx";
import { ParallaxHero } from "../../shared/ui/ParallaxHero.jsx";
import { Rating } from "../../shared/ui/Rating.jsx";
import { SectionHeading } from "../../shared/ui/SectionHeading.jsx";

const partnerLabels = {
  restaurant: "Restaurante",
  inn: "Hospedagem",
  kiosk: "Quiosque",
  tour: "Passeio",
  other: "Serviço local",
};

function PartnerLinks({ partner }) {
  const links = [
    [partner.mapUrl, MapPin, "Abrir mapa"],
    [partner.whatsappUrl, MessageCircle, "WhatsApp"],
    [partner.instagramUrl, Instagram, "Instagram"],
    [partner.websiteUrl, Globe2, "Site"],
  ].filter(([url]) => Boolean(url));
  return (
    <div className="partner-links">
      {partner.phone && (
        <a href={`tel:${partner.phone.replace(/[^\d+]/g, "")}`}>
          <Phone size={17} aria-hidden="true" />
          {partner.phone}
        </a>
      )}
      {links.map(([url, Icon, label]) => (
        <a key={label} href={url} target="_blank" rel="noreferrer">
          <Icon size={17} aria-hidden="true" />
          {label}
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

export default function BeachDetailPage() {
  const { slug } = useParams();
  const beach = useBeach(slug);
  if (beach.isLoading) return <Loader fullPage label="Carregando a rota…" />;
  if (beach.isError)
    return (
      <main className="page-state">
        <ErrorState message={beach.error.message} onRetry={beach.refetch} />
        <Link className="text-link" to="/praias">
          <ArrowLeft size={17} /> Voltar ao catálogo
        </Link>
      </main>
    );
  const item = beach.data;

  return (
    <>
      <ParallaxHero
        compact
        image={item.heroImage || "/images/catalog-hero.webp"}
        eyebrow={item.location}
        title={item.name}
        description={item.summary}
      >
        <div className="detail-hero-meta">
          <Rating average={item.ratingAverage} count={item.reviewCount} />
          {item.mapUrl && (
            <a
              className="button button--glass"
              href={item.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={18} /> Abrir no mapa
            </a>
          )}
        </div>
      </ParallaxHero>

      <section className="section beach-intro">
        <div className="container detail-grid">
          <article className="prose-panel">
            <span className="eyebrow">Conheça a rota</span>
            <h2>Um lugar para desacelerar</h2>
            <p className="lead">{item.description}</p>
            <div className="info-note">
              <strong>Antes de ir</strong>
              <p>
                Confirme acesso, maré e funcionamento dos estabelecimentos.
                Preserve a praia e leve seus resíduos de volta.
              </p>
            </div>
          </article>
          <div className="gallery-grid">
            {(item.images?.length
              ? item.images
              : [
                  {
                    id: "hero",
                    imagePath: item.heroImage,
                    altText: `Vista de ${item.name}`,
                  },
                ]
            ).map((image, index) => (
              <figure
                className={`gallery-image${index === 0 ? " gallery-image--main" : ""}`}
                key={image.id}
              >
                <img
                  src={image.imagePath}
                  alt={image.altText}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHeading
            eyebrow="Por perto"
            title="Quem faz parte desta rota"
            description="Estabelecimentos locais associados à praia. Links só aparecem quando foram confirmados."
          />
          {item.partners?.length ? (
            <div className="partner-grid">
              {item.partners.map((partner) => (
                <article className="partner-card" key={partner.id}>
                  {partner.image && (
                    <img
                      src={partner.image}
                      alt={`Fachada ou ambiente de ${partner.name}`}
                      loading="lazy"
                    />
                  )}
                  <div className="partner-card__body">
                    <span className="eyebrow">
                      {partnerLabels[partner.category] || "Parceiro local"}
                    </span>
                    <h3>{partner.name}</h3>
                    <p>{partner.description}</p>
                    {partner.address && (
                      <span className="location-label">
                        <MapPin size={16} />
                        {partner.address}
                      </span>
                    )}
                    <PartnerLinks partner={partner} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted-copy">
              Ainda não há parceiros publicados para esta praia.
            </p>
          )}
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container reviews-layout">
          <div>
            <SectionHeading
              eyebrow="Relatos da comunidade"
              title="Experiências que ajudam a orientar"
              description="Somente avaliações aprovadas pela moderação são exibidas."
            />
            {item.reviews?.length ? (
              <div className="review-list">
                {item.reviews.map((review) => (
                  <article className="review-card" key={review.id}>
                    <div className="review-card__head">
                      <strong>{review.authorName}</strong>
                      <span aria-label={`${review.rating} de 5 estrelas`}>
                        {Array.from({ length: review.rating }, (_, index) => (
                          <Star
                            key={index}
                            size={15}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        ))}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                    <time dateTime={review.createdAt}>
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "medium",
                      }).format(new Date(review.createdAt))}
                    </time>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted-copy">
                Esta rota ainda não recebeu avaliações aprovadas. Você pode
                enviar a primeira.
              </p>
            )}
          </div>
          <ReviewForm
            onSubmit={(values) =>
              api.post(`/api/beaches/${item.id}/reviews`, values)
            }
          />
        </div>
      </section>
    </>
  );
}
