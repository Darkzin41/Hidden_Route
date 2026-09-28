import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";

export function ReviewForm({ onSubmit }) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [requestError, setRequestError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (authorName.trim().length < 2)
      nextErrors.authorName = "Informe seu nome.";
    if (rating < 1) nextErrors.rating = "Escolha uma nota.";
    if (comment.trim().length < 15)
      nextErrors.comment = "Conte um pouco mais sobre sua visita.";
    setErrors(nextErrors);
    setRequestError("");
    if (Object.keys(nextErrors).length) return;

    setStatus("submitting");
    try {
      await onSubmit({
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
      });
      setStatus("success");
      setAuthorName("");
      setRating(0);
      setComment("");
    } catch (error) {
      setStatus("error");
      setRequestError(error.message || "Não foi possível enviar a avaliação.");
      if (error.fields) setErrors(error.fields);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <span className="eyebrow">Sua experiência</span>
        <h2>Avalie esta praia</h2>
        <p>As avaliações são revisadas antes de aparecer no catálogo.</p>
      </div>

      <label className="field">
        <span>Seu nome</span>
        <input
          type="text"
          autoComplete="name"
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          aria-invalid={Boolean(errors.authorName)}
        />
        {errors.authorName && (
          <small className="field-error">{errors.authorName}</small>
        )}
      </label>

      <fieldset className="rating-field">
        <legend>Nota</legend>
        <div className="rating-input">
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className="rating-choice"
              data-selected={value <= rating}
            >
              <input
                className="rating-radio"
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => setRating(value)}
                aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`}
              />
              <Star
                aria-hidden="true"
                fill={value <= rating ? "currentColor" : "none"}
              />
            </label>
          ))}
        </div>
        {errors.rating && (
          <small className="field-error">{errors.rating}</small>
        )}
      </fieldset>

      <label className="field">
        <span>Sua avaliação</span>
        <textarea
          rows="5"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          aria-invalid={Boolean(errors.comment)}
        />
        {errors.comment && (
          <small className="field-error">{errors.comment}</small>
        )}
      </label>

      {requestError && (
        <p className="form-alert form-alert--error" role="alert">
          {requestError}
        </p>
      )}
      {status === "success" && (
        <p className="form-alert form-alert--success" role="status">
          <CheckCircle2 size={18} aria-hidden="true" />
          Avaliação enviada para moderação.
        </p>
      )}

      <button
        className="button button--primary"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Enviando…" : "Enviar avaliação"}
      </button>
    </form>
  );
}
