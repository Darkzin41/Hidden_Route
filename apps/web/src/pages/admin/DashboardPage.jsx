import { ClipboardCheck, Mail, Map, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminQuery } from "../../features/admin/admin-api.js";
import { AdminPageHeader } from "../../features/admin/AdminUi.jsx";
import { ErrorState } from "../../shared/ui/Feedback.jsx";
import { Loader } from "../../shared/ui/Loader.jsx";

export default function DashboardPage() {
  const summary = useAdminQuery("summary", "/api/admin/summary");
  if (summary.isLoading) return <Loader fullPage label="Carregando painel…" />;
  if (summary.isError)
    return (
      <ErrorState message={summary.error.message} onRetry={summary.refetch} />
    );
  const cards = [
    {
      label: "Praias ativas",
      value: summary.data.beaches,
      icon: Map,
      to: "/admin/praias",
      tone: "teal",
    },
    {
      label: "Parceiros ativos",
      value: summary.data.partners,
      icon: Store,
      to: "/admin/parceiros",
      tone: "sand",
    },
    {
      label: "Avaliações pendentes",
      value: summary.data.pendingReviews,
      icon: ClipboardCheck,
      to: "/admin/avaliacoes",
      tone: "coral",
    },
    {
      label: "Mensagens novas",
      value: summary.data.newMessages,
      icon: Mail,
      to: "/admin/mensagens",
      tone: "ocean",
    },
  ];
  return (
    <>
      <AdminPageHeader
        eyebrow="Painel editorial"
        title="Visão geral"
        description="Acompanhe o que precisa de atenção no catálogo."
      />
      <div className="summary-grid">
        {cards.map(({ label, value, icon: Icon, to, tone }) => (
          <Link className="summary-card" data-tone={tone} to={to} key={label}>
            <span>
              <Icon />
            </span>
            <strong>{value}</strong>
            <p>{label}</p>
          </Link>
        ))}
      </div>
      <section className="admin-callout">
        <div>
          <span className="eyebrow">Próximos passos</span>
          <h2>Conteúdo bom começa com informação confirmada.</h2>
          <p>
            Mantenha rascunhos sem dados inventados, revise as contribuições e
            publique somente quando a rota estiver pronta.
          </p>
        </div>
        <Link className="button button--primary" to="/admin/praias">
          Gerenciar catálogo
        </Link>
      </section>
    </>
  );
}
