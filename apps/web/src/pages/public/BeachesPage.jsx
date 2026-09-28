import { Search, Waves } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { BeachCard } from "../../features/catalog/BeachCard.jsx";
import { useBeaches } from "../../features/catalog/catalog-api.js";
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
} from "../../shared/ui/Feedback.jsx";
import { ParallaxHero } from "../../shared/ui/ParallaxHero.jsx";

export default function BeachesPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const beaches = useBeaches(deferredSearch);

  return (
    <>
      <ParallaxHero
        compact
        image="/images/catalog-hero-1920.webp"
        mobileImage="/images/catalog-hero-640.webp"
        eyebrow="Catálogo local"
        title="Praias para olhar com mais calma"
        description="Pesquise pelo nome ou localidade e encontre informações confirmadas para sua próxima rota."
      />
      <section className="section section--sand catalog-section">
        <div className="container">
          <div className="catalog-toolbar">
            <div>
              <span className="eyebrow">Explore o território</span>
              <h2>Rotas publicadas</h2>
            </div>
            <label className="search-field">
              <span className="sr-only">Buscar praia ou localidade</span>
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar praia ou localidade"
              />
            </label>
          </div>
          {beaches.isLoading && <CardSkeleton />}
          {beaches.isError && (
            <ErrorState
              message={beaches.error.message}
              onRetry={beaches.refetch}
            />
          )}
          {beaches.data?.length > 0 && (
            <div className="card-grid">
              {beaches.data.map((beach, index) => (
                <BeachCard key={beach.id} beach={beach} priority={index < 2} />
              ))}
            </div>
          )}
          {beaches.data?.length === 0 && (
            <EmptyState
              title="Nenhuma praia nesta busca"
              message="Tente buscar por outro nome ou localidade."
            />
          )}
          <div className="catalog-footnote">
            <Waves aria-hidden="true" />
            <p>
              O catálogo exibe apenas praias publicadas após revisão. Novas
              rotas continuam sendo pesquisadas pela equipe.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
