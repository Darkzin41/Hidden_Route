import { AlertCircle, Compass, RefreshCw } from "lucide-react";

export function ErrorState({
  message = "Não foi possível carregar este conteúdo.",
  onRetry,
}) {
  return (
    <div className="feedback-state" role="alert">
      <AlertCircle aria-hidden="true" />
      <h2>Algo saiu da rota</h2>
      <p>{message}</p>
      {onRetry && (
        <button
          className="button button--secondary"
          type="button"
          onClick={onRetry}
        >
          <RefreshCw size={18} aria-hidden="true" /> Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "Nenhum resultado encontrado", message }) {
  return (
    <div className="feedback-state">
      <Compass aria-hidden="true" />
      <h2>{title}</h2>
      <p>{message || "Tente outro termo ou volte mais tarde."}</p>
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div
      className="card-grid"
      aria-label="Carregando conteúdo"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <span className="skeleton skeleton--image" />
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line skeleton--short" />
        </div>
      ))}
    </div>
  );
}
