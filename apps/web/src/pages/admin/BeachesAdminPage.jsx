import { Archive, Edit3, ImageUp } from "lucide-react";
import { useState } from "react";
import {
  useAdminMutation,
  useAdminQuery,
  useUpload,
} from "../../features/admin/admin-api.js";
import {
  AdminEmpty,
  AdminFeedback,
  AdminPageHeader,
  Drawer,
  StatusBadge,
} from "../../features/admin/AdminUi.jsx";
import { ErrorState } from "../../shared/ui/Feedback.jsx";
import { Loader } from "../../shared/ui/Loader.jsx";

const emptyBeach = {
  name: "",
  slug: "",
  location: "",
  summary: "",
  description: "",
  heroImage: "",
  mapUrl: "",
  status: "draft",
  featured: false,
};

function BeachForm({ item, onSaved, onCancel }) {
  const [values, setValues] = useState(
    item
      ? { ...item, heroImage: item.heroImage || "", mapUrl: item.mapUrl || "" }
      : emptyBeach,
  );
  const save = useAdminMutation({
    method: item ? "patch" : "post",
    invalidate: ["beaches", "summary"],
  });
  const upload = useUpload();
  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await upload.mutateAsync(file);
    update("heroImage", image.path);
  }
  async function submit(event) {
    event.preventDefault();
    const body = {
      ...values,
      heroImage: values.heroImage || null,
      mapUrl: values.mapUrl || null,
    };
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.ratingAverage;
    delete body.reviewCount;
    await save.mutateAsync({
      path: item ? `/api/admin/beaches/${item.id}` : "/api/admin/beaches",
      body,
    });
    onSaved();
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <AdminFeedback error={save.error || upload.error} />
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Nome</span>
          <input
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            required
            minLength="2"
          />
        </label>
        <label className="admin-field">
          <span>Slug</span>
          <input
            value={values.slug}
            onChange={(event) => update("slug", event.target.value)}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            required
          />
        </label>
      </div>
      <label className="admin-field">
        <span>Localidade</span>
        <input
          value={values.location}
          onChange={(event) => update("location", event.target.value)}
          required
        />
      </label>
      <label className="admin-field">
        <span>Resumo</span>
        <textarea
          value={values.summary}
          onChange={(event) => update("summary", event.target.value)}
          required
          minLength="15"
        />
      </label>
      <label className="admin-field">
        <span>Descrição</span>
        <textarea
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          required
          minLength="20"
          rows="7"
        />
      </label>
      <label className="admin-field">
        <span>Imagem principal</span>
        <div className="upload-row">
          <input
            value={values.heroImage}
            onChange={(event) => update("heroImage", event.target.value)}
            placeholder="/uploads/imagem.webp"
          />
          <label className="button button--secondary upload-button">
            <ImageUp size={17} />
            Enviar imagem
            <input
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
            />
          </label>
        </div>
      </label>
      <label className="admin-field">
        <span>Link do mapa</span>
        <input
          type="url"
          value={values.mapUrl}
          onChange={(event) => update("mapUrl", event.target.value)}
        />
      </label>
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Status</span>
          <select
            value={values.status}
            onChange={(event) => update("status", event.target.value)}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </label>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(event) => update("featured", event.target.checked)}
          />
          <span>Destacar na página inicial</span>
        </label>
      </div>
      <div className="admin-form-actions">
        <button
          className="button button--secondary"
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className="button button--primary"
          type="submit"
          disabled={save.isPending || upload.isPending}
        >
          {save.isPending ? "Salvando…" : "Salvar praia"}
        </button>
      </div>
    </form>
  );
}

export default function BeachesAdminPage() {
  const beaches = useAdminQuery("beaches", "/api/admin/beaches?limit=100");
  const archive = useAdminMutation({
    method: "delete",
    invalidate: ["beaches", "summary"],
  });
  const [editing, setEditing] = useState(undefined);
  const [open, setOpen] = useState(false);
  function close() {
    setOpen(false);
    setEditing(undefined);
  }
  if (beaches.isLoading) return <Loader fullPage label="Carregando praias…" />;
  if (beaches.isError)
    return (
      <ErrorState message={beaches.error.message} onRetry={beaches.refetch} />
    );
  return (
    <>
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Praias"
        description={`${beaches.data.pagination.total} registros encontrados.`}
        action="Nova praia"
        onAction={() => {
          setEditing(undefined);
          setOpen(true);
        }}
      />
      <AdminFeedback error={archive.error} />
      {beaches.data.items.length ? (
        <div className="admin-list">
          {beaches.data.items.map((beach) => (
            <article className="admin-list-card" key={beach.id}>
              {beach.heroImage ? (
                <img src={beach.heroImage} alt="" />
              ) : (
                <span className="admin-image-placeholder">Sem imagem</span>
              )}
              <div className="admin-list-card__content">
                <div>
                  <StatusBadge status={beach.status} />
                  {beach.featured && (
                    <span className="status-badge" data-status="featured">
                      Destaque
                    </span>
                  )}
                </div>
                <h2>{beach.name}</h2>
                <p>{beach.location}</p>
                <small>/{beach.slug}</small>
              </div>
              <div className="admin-row-actions">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(beach);
                    setOpen(true);
                  }}
                >
                  <Edit3 size={17} />
                  Editar
                </button>
                {beach.status !== "archived" && (
                  <button
                    className="danger-action"
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Arquivar ${beach.name}?`))
                        archive.mutate({
                          path: `/api/admin/beaches/${beach.id}`,
                        });
                    }}
                  >
                    <Archive size={17} />
                    Arquivar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty>Nenhuma praia cadastrada.</AdminEmpty>
      )}
      <Drawer
        title={editing ? `Editar ${editing.name}` : "Cadastrar praia"}
        open={open}
        onClose={close}
      >
        <BeachForm item={editing} onCancel={close} onSaved={close} />
      </Drawer>
    </>
  );
}
