import { Star } from "lucide-react";

export function Rating({ average = 0, count = 0, compact = false }) {
  const label = count
    ? `${Number(average).toFixed(1)} de 5, ${count} ${count === 1 ? "avaliação" : "avaliações"}`
    : "Ainda sem avaliações";

  return (
    <div className="rating" aria-label={label}>
      <Star size={compact ? 16 : 18} fill="currentColor" aria-hidden="true" />
      {count ? (
        <>
          <strong>{Number(average).toFixed(1)}</strong>
          <span>({count})</span>
        </>
      ) : (
        <span>Sem avaliações</span>
      )}
    </div>
  );
}
