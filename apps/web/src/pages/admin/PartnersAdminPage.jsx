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

const emptyPartner = {
  beachId: "",
  name: "",
  category: "restaurant",
  description: "",
  image: "",
  address: "",
  phone: "",
  whatsappUrl: "",
  instagramUrl: "",
  websiteUrl: "",
  mapUrl: "",
  status: "draft",
};
const nullable = [
  "image",
  "address",
  "phone",
  "whatsappUrl",
  "instagramUrl",
  "websiteUrl",
  "mapUrl",
];

function PartnerForm({ item, beaches, onSaved, onCancel }) {
  const [values, setValues] = useState(
    item
      ? {
          ...item,
          ...Object.fromEntries(nullable.map((key) => [key, item[key] || ""])),
        }
      : emptyPartner,
  );
  const save = useAdminMutation({
    method: item ? "patch" : "post",
    invalidate: ["partners", "summary"],
  });
  const upload = useUpload();
  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }
  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await upload.mutateAsync(file);
    update("image", image.path);
  }
  async function submit(event) {
    event.preventDefault();
    const body = { ...values, beachId: Number(values.beachId) };
    for (const key of nullable) body[key] = body[key] || null;
    for (const key of ["id", "beachName", "createdAt", "updatedAt"])
      delete body[key];
    await save.mutateAsync({
      path: item ? `/api/admin/partners/${item.id}` : "/api/admin/partners",
      body,
    });
    onSaved();
  }
  return (
    <form className="admin-form" onSubmit={submit}>
      <AdminFeedback error={save.error || upload.error} />
      <label className="admin-field">
        <span>Praia</span>
        <select
          value={values.beachId}
          onChange={(event) => update("beachId", event.target.value)}
          required
        >
          <option value="">Selecione</option>
          {beaches.map((beach) => (
            <option key={beach.id} value={beach.id}>
              {beach.name}
            </option>
          ))}
        </select>
      </label>
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Nome</span>
          <input
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </label>
        <label className="admin-field">
          <span>Categoria</span>
          <select
            value={values.category}
            onChange={(event) => update("category", event.target.value)}
          >
            <option value="restaurant">Restaurante</option>
            <option value="inn">Hospedagem</option>
            <option value="kiosk">Quiosque</option>
            <option value="tour">Passeio</option>
            <option value="other">Outro</option>
          </select>
        </label>
      </div>
      <label className="admin-field">
        <span>Descrição</span>
        <textarea
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          minLength="15"
          required
        />
      </label>
      <label className="admin-field">
        <span>Imagem</span>
        <div className="upload-row">
          <input
            value={values.image}
            onChange={(event) => update("image", event.target.value)}
          />
          <label className="button button--secondary upload-button">
            <ImageUp size={17} />
            Enviar
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
        <span>Endereço</span>
        <input
          value={values.address}
          onChange={(event) => update("address", event.target.value)}
        />
      </label>
      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Telefone</span>
          <input
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </label>
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
      </div>
      {["whatsappUrl", "instagramUrl", "websiteUrl", "mapUrl"].map((key) => (
        <label className="admin-field" key={key}>
          <span>
            {
              {
                whatsappUrl: "WhatsApp",
                instagramUrl: "Instagram",
                websiteUrl: "Site",
                mapUrl: "Mapa",
              }[key]
            }
          </span>
          <input
            type="url"
            value={values[key]}
            onChange={(event) => update(key, event.target.value)}
            placeholder="https://"
          />
        </label>
      ))}
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
          disabled={save.isPending}
        >
          Salvar parceiro
        </button>
      </div>
    </form>
  );
}

export default function PartnersAdminPage() {
  const partners = useAdminQuery("partners", "/api/admin/partners?limit=100");
  const beaches = useAdminQuery(
    "beaches-options",
    "/api/admin/beaches?limit=100",
  );
  const archive = useAdminMutation({
    method: "delete",
    invalidate: ["partners", "summary"],
  });
  const [editing, setEditing] = useState();
  const [open, setOpen] = useState(false);
  function close() {
    setOpen(false);
    setEditing(undefined);
  }
  if (partners.isLoading || beaches.isLoading)
    return <Loader fullPage label="Carregando parceiros…" />;
  if (partners.isError || beaches.isError)
    return (
      <ErrorState
        message={(partners.error || beaches.error).message}
        onRetry={() => {
          partners.refetch();
          beaches.refetch();
        }}
      />
    );
  return (
    <>
      <AdminPageHeader
        eyebrow="Rede local"
        title="Parceiros"
        description={`${partners.data.pagination.total} registros encontrados.`}
        action="Novo parceiro"
        onAction={() => setOpen(true)}
      />
      <AdminFeedback error={archive.error} />
      {partners.data.items.length ? (
        <div className="admin-list">
          {partners.data.items.map((partner) => (
            <article className="admin-list-card" key={partner.id}>
              {partner.image ? (
                <img src={partner.image} alt="" />
              ) : (
                <span className="admin-image-placeholder">Sem imagem</span>
              )}
              <div className="admin-list-card__content">
                <StatusBadge status={partner.status} />
                <h2>{partner.name}</h2>
                <p>{partner.beachName}</p>
                <small>{partner.category}</small>
              </div>
              <div className="admin-row-actions">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(partner);
                    setOpen(true);
                  }}
                >
                  <Edit3 size={17} />
                  Editar
                </button>
                {partner.status !== "archived" && (
                  <button
                    className="danger-action"
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Arquivar ${partner.name}?`))
                        archive.mutate({
                          path: `/api/admin/partners/${partner.id}`,
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
        <AdminEmpty>Nenhum parceiro cadastrado.</AdminEmpty>
      )}
      <Drawer
        title={editing ? `Editar ${editing.name}` : "Cadastrar parceiro"}
        open={open}
        onClose={close}
      >
        <PartnerForm
          item={editing}
          beaches={beaches.data.items}
          onCancel={close}
          onSaved={close}
        />
      </Drawer>
    </>
  );
}
