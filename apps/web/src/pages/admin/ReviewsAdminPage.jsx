import { Check, Star, X } from "lucide-react";
import { useState } from "react";
import {
  useAdminMutation,
  useAdminQuery,
} from "../../features/admin/admin-api.js";
import {
  AdminEmpty,
  AdminFeedback,
  AdminPageHeader,
  StatusBadge,
} from "../../features/admin/AdminUi.jsx";
import { ErrorState } from "../../shared/ui/Feedback.jsx";
import { Loader } from "../../shared/ui/Loader.jsx";

export default function ReviewsAdminPage() {
  const [status, setStatus] = useState("pending");
  const reviews = useAdminQuery(
    `reviews-${status}`,
    `/api/admin/reviews?limit=100&status=${status}`,
  );
  const update = useAdminMutation({
    invalidate: [
      "reviews-pending",
      "reviews-approved",
      "reviews-rejected",
      "summary",
    ],
  });
  if (reviews.isLoading)
    return <Loader fullPage label="Carregando avaliações…" />;
  if (reviews.isError)
    return (
      <ErrorState message={reviews.error.message} onRetry={reviews.refetch} />
    );
  return (
    <>
      <AdminPageHeader
        eyebrow="Moderação"
        title="Avaliações"
        description="Aprove somente relatos adequados e relacionados à experiência na praia."
      />
      <div
        className="admin-filters"
        role="group"
        aria-label="Filtrar por status"
      >
        {["pending", "approved", "rejected"].map((value) => (
          <button
            type="button"
            data-active={status === value}
            key={value}
            onClick={() => setStatus(value)}
          >
            {
              {
                pending: "Pendentes",
                approved: "Aprovadas",
                rejected: "Rejeitadas",
              }[value]
            }
          </button>
        ))}
      </div>
      <AdminFeedback error={update.error} />
      {reviews.data.items.length ? (
        <div className="moderation-list">
          {reviews.data.items.map((review) => (
            <article className="moderation-card" key={review.id}>
              <header>
                <div>
                  <strong>{review.authorName}</strong>
                  <span>em {review.beachName}</span>
                </div>
                <StatusBadge status={review.status} />
              </header>
              <div
                className="moderation-rating"
                aria-label={`${review.rating} estrelas`}
              >
                {Array.from({ length: review.rating }, (_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <p>{review.comment}</p>
              <time>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(review.createdAt))}
              </time>
              {review.status === "pending" && (
                <footer>
                  <button
                    className="button approve-button"
                    type="button"
                    onClick={() =>
                      update.mutate({
                        path: `/api/admin/reviews/${review.id}/status`,
                        body: { status: "approved" },
                      })
                    }
                  >
                    <Check size={17} />
                    Aprovar
                  </button>
                  <button
                    className="button reject-button"
                    type="button"
                    onClick={() =>
                      update.mutate({
                        path: `/api/admin/reviews/${review.id}/status`,
                        body: { status: "rejected" },
                      })
                    }
                  >
                    <X size={17} />
                    Rejeitar
                  </button>
                </footer>
              )}
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty>Nenhuma avaliação com este status.</AdminEmpty>
      )}
    </>
  );
}
