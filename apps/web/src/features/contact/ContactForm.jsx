import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const initialValues = { name: "", email: "", message: "" };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
    errors.email = "Informe um e-mail válido.";
  if (values.message.trim().length < 15)
    errors.message = "Escreva uma mensagem com pelo menos 15 caracteres.";
  return errors;
}

export function ContactForm({ onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [requestError, setRequestError] = useState("");

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field])
      setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setRequestError("");
    if (Object.keys(nextErrors).length) return;

    setStatus("submitting");
    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      });
      setStatus("success");
      setValues(initialValues);
    } catch (error) {
      setStatus("error");
      setRequestError(error.message || "Não foi possível enviar a mensagem.");
      if (error.fields) setErrors(error.fields);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <span className="eyebrow">Fale com a equipe</span>
        <h2>Entre em contato</h2>
        <p>
          Envie dúvidas, sugestões ou novas rotas que merecem ser conhecidas.
        </p>
      </div>

      <label className="field">
        <span>Nome</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name && (
          <small id="contact-name-error" className="field-error">
            {errors.name}
          </small>
        )}
      </label>

      <label className="field">
        <span>E-mail</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <small id="contact-email-error" className="field-error">
            {errors.email}
          </small>
        )}
      </label>

      <label className="field">
        <span>Mensagem</span>
        <textarea
          name="message"
          rows="5"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
        />
        {errors.message && (
          <small id="contact-message-error" className="field-error">
            {errors.message}
          </small>
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
          Mensagem recebida. Obrigado por conversar com a gente.
        </p>
      )}

      <button
        className="button button--primary"
        type="submit"
        disabled={status === "submitting"}
      >
        <Send size={18} aria-hidden="true" />
        {status === "submitting" ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
