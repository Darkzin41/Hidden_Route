import { AlertCircle, CheckCircle2, Plus, X } from "lucide-react";

const labels = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Rejeitada",
  new: "Nova",
  read: "Lida",
};

export function StatusBadge({ status }) {
  return (
    <span className="status-badge" data-status={status}>
      {labels[status] || status}
    </span>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  onAction,
}) {
  return (
    <header className="admin-page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <button
          className="button button--primary"
          type="button"
          onClick={onAction}
        >
          <Plus size={18} />
          {action}
        </button>
      )}
    </header>
  );
}

export function AdminFeedback({ error, success }) {
  if (error)
    return (
      <p className="form-alert form-alert--error" role="alert">
        <AlertCircle size={17} />
        {error.message || error}
      </p>
    );
  if (success)
    return (
      <p className="form-alert form-alert--success" role="status">
        <CheckCircle2 size={17} />
        {success}
      </p>
    );
  return null;
}

export function Drawer({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="admin-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <header>
          <h2 id="drawer-title">{title}</h2>
          <button type="button" aria-label="Fechar" onClick={onClose}>
            <X />
          </button>
        </header>
        <div className="admin-drawer__content">{children}</div>
      </section>
    </div>
  );
}

export function AdminEmpty({ children }) {
  return (
    <div className="admin-empty">
      <p>{children}</p>
    </div>
  );
}
