import { Archive, CheckCheck, MailOpen } from "lucide-react";
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

export default function MessagesAdminPage() {
  const [status, setStatus] = useState("new");
  const messages = useAdminQuery(
    `messages-${status}`,
    `/api/admin/messages?limit=100&status=${status}`,
  );
  const update = useAdminMutation({
    invalidate: [
      "messages-new",
      "messages-read",
      "messages-archived",
      "summary",
    ],
  });
  if (messages.isLoading)
    return <Loader fullPage label="Carregando mensagens…" />;
  if (messages.isError)
    return (
      <ErrorState message={messages.error.message} onRetry={messages.refetch} />
    );
  return (
    <>
      <AdminPageHeader
        eyebrow="Caixa de entrada"
        title="Mensagens"
        description="Contribuições e contatos enviados pelo site."
      />
      <div
        className="admin-filters"
        role="group"
        aria-label="Filtrar mensagens"
      >
        {["new", "read", "archived"].map((value) => (
          <button
            type="button"
            data-active={status === value}
            key={value}
            onClick={() => setStatus(value)}
          >
            {{ new: "Novas", read: "Lidas", archived: "Arquivadas" }[value]}
          </button>
        ))}
      </div>
      <AdminFeedback error={update.error} />
      {messages.data.items.length ? (
        <div className="moderation-list">
          {messages.data.items.map((message) => (
            <article className="moderation-card message-card" key={message.id}>
              <header>
                <div>
                  <strong>{message.name}</strong>
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                </div>
                <StatusBadge status={message.status} />
              </header>
              <p>{message.message}</p>
              <time>
                {new Intl.DateTimeFormat("pt-BR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(message.createdAt))}
              </time>
              <footer>
                {message.status === "new" && (
                  <button
                    className="button approve-button"
                    type="button"
                    onClick={() =>
                      update.mutate({
                        path: `/api/admin/messages/${message.id}/status`,
                        body: { status: "read" },
                      })
                    }
                  >
                    <MailOpen size={17} />
                    Marcar como lida
                  </button>
                )}
                {message.status === "read" && (
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() =>
                      update.mutate({
                        path: `/api/admin/messages/${message.id}/status`,
                        body: { status: "new" },
                      })
                    }
                  >
                    <CheckCheck size={17} />
                    Marcar como nova
                  </button>
                )}
                {message.status !== "archived" && (
                  <button
                    className="button reject-button"
                    type="button"
                    onClick={() =>
                      update.mutate({
                        path: `/api/admin/messages/${message.id}/status`,
                        body: { status: "archived" },
                      })
                    }
                  >
                    <Archive size={17} />
                    Arquivar
                  </button>
                )}
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty>Nenhuma mensagem com este status.</AdminEmpty>
      )}
    </>
  );
}
