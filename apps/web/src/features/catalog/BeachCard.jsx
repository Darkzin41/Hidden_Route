import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Rating } from "../../shared/ui/Rating.jsx";

export function BeachCard({ beach, priority = false }) {
  return (
    <article className="beach-card">
      <Link
        className="beach-card__media"
        to={`/praias/${beach.slug}`}
        aria-label={`Conhecer ${beach.name}`}
      >
        <img
          src={beach.heroImage || "/images/catalog-hero.webp"}
          alt={`Paisagem de ${beach.name}`}
          loading={priority ? "eager" : "lazy"}
        />
        {beach.featured && (
          <span className="image-badge">Rota em destaque</span>
        )}
      </Link>
      <div className="beach-card__body">
        <div>
          <span className="location-label">
            <MapPin size={16} aria-hidden="true" />
            {beach.location}
          </span>
          <h3>
            <Link to={`/praias/${beach.slug}`}>{beach.name}</Link>
          </h3>
        </div>
        <p>{beach.summary}</p>
        <div className="beach-card__footer">
          <Rating
            average={beach.ratingAverage}
            count={beach.reviewCount}
            compact
          />
          <Link className="text-link" to={`/praias/${beach.slug}`}>
            Explorar <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
