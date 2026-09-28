export function Loader({ label = "Carregando…", fullPage = false }) {
  return (
    <div
      className={fullPage ? "loader loader--page" : "loader"}
      role="status"
      aria-live="polite"
    >
      <span className="loader__ring" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
