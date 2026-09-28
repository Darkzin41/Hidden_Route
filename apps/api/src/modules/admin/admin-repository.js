import { AppError } from "../../lib/errors.js";
import {
  mapBeach,
  mapMessage,
  mapPartner,
  mapReview,
} from "../../lib/database-mappers.js";

function pagination(page, limit, total) {
  return {
    page,
    limit,
    total: Number(total),
    pages: Math.max(1, Math.ceil(Number(total) / limit)),
  };
}

function buildUpdates(data, columns) {
  const entries = Object.entries(columns).filter(
    ([key]) => data[key] !== undefined,
  );
  if (entries.length === 0)
    throw new AppError(422, "VALIDATION_ERROR", "Nenhuma alteração informada.");
  return {
    sql: entries.map(([, column]) => `${column} = ?`).join(", "),
    values: entries.map(([key]) => data[key]),
  };
}

async function findBeach(database, id) {
  const [rows] = await database.execute("SELECT * FROM beaches WHERE id = ?", [
    id,
  ]);
  if (!rows[0])
    throw new AppError(404, "BEACH_NOT_FOUND", "Praia não encontrada.");
  return mapBeach(rows[0]);
}

async function findPartner(database, id) {
  const [rows] = await database.execute(
    "SELECT p.*, b.name AS beach_name FROM partners p JOIN beaches b ON b.id = p.beach_id WHERE p.id = ?",
    [id],
  );
  if (!rows[0])
    throw new AppError(404, "PARTNER_NOT_FOUND", "Parceiro não encontrado.");
  return mapPartner(rows[0]);
}

export function createAdminRepository(database) {
  return {
    async getSummary() {
      const [[counts]] = await database.query(`
        SELECT
          (SELECT COUNT(*) FROM beaches WHERE status <> 'archived') AS beaches,
          (SELECT COUNT(*) FROM partners WHERE status <> 'archived') AS partners,
          (SELECT COUNT(*) FROM reviews WHERE status = 'pending') AS pending_reviews,
          (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') AS new_messages
      `);
      return {
        beaches: Number(counts.beaches),
        partners: Number(counts.partners),
        pendingReviews: Number(counts.pending_reviews),
        newMessages: Number(counts.new_messages),
      };
    },

    async listBeaches({ status, search = "", page = 1, limit = 20 }) {
      const conditions = [];
      const values = [];
      if (status) {
        conditions.push("b.status = ?");
        values.push(status);
      }
      if (search) {
        conditions.push("(b.name LIKE ? OR b.location LIKE ?)");
        values.push(`%${search}%`, `%${search}%`);
      }
      const where = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";
      const [[count]] = await database.execute(
        `SELECT COUNT(*) AS total FROM beaches b ${where}`,
        values,
      );
      const [rows] = await database.execute(
        `SELECT b.* FROM beaches b ${where} ORDER BY b.updated_at DESC, b.id DESC LIMIT ? OFFSET ?`,
        [...values, limit, (page - 1) * limit],
      );
      return {
        items: rows.map(mapBeach),
        pagination: pagination(page, limit, count.total),
      };
    },

    async createBeach(data) {
      const [result] = await database.execute(
        `INSERT INTO beaches (name, slug, location, summary, description, hero_image, map_url, status, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.slug,
          data.location,
          data.summary,
          data.description,
          data.heroImage || null,
          data.mapUrl || null,
          data.status,
          data.featured,
        ],
      );
      return findBeach(database, result.insertId);
    },

    async updateBeach(id, data) {
      const update = buildUpdates(data, {
        name: "name",
        slug: "slug",
        location: "location",
        summary: "summary",
        description: "description",
        heroImage: "hero_image",
        mapUrl: "map_url",
        status: "status",
        featured: "featured",
      });
      const [result] = await database.execute(
        `UPDATE beaches SET ${update.sql} WHERE id = ?`,
        [...update.values, id],
      );
      if (result.affectedRows === 0)
        throw new AppError(404, "BEACH_NOT_FOUND", "Praia não encontrada.");
      return findBeach(database, id);
    },

    async archiveBeach(id) {
      const [result] = await database.execute(
        "UPDATE beaches SET status = 'archived', featured = FALSE WHERE id = ?",
        [id],
      );
      if (result.affectedRows === 0)
        throw new AppError(404, "BEACH_NOT_FOUND", "Praia não encontrada.");
      return findBeach(database, id);
    },

    async listPartners({ status, search = "", page = 1, limit = 20 }) {
      const conditions = [];
      const values = [];
      if (status) {
        conditions.push("p.status = ?");
        values.push(status);
      }
      if (search) {
        conditions.push("(p.name LIKE ? OR b.name LIKE ?)");
        values.push(`%${search}%`, `%${search}%`);
      }
      const where = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";
      const [[count]] = await database.execute(
        `SELECT COUNT(*) AS total FROM partners p JOIN beaches b ON b.id = p.beach_id ${where}`,
        values,
      );
      const [rows] = await database.execute(
        `SELECT p.*, b.name AS beach_name FROM partners p JOIN beaches b ON b.id = p.beach_id
         ${where} ORDER BY p.updated_at DESC, p.id DESC LIMIT ? OFFSET ?`,
        [...values, limit, (page - 1) * limit],
      );
      return {
        items: rows.map(mapPartner),
        pagination: pagination(page, limit, count.total),
      };
    },

    async createPartner(data) {
      const [result] = await database.execute(
        `INSERT INTO partners
          (beach_id, name, category, description, image, address, phone, whatsapp_url, instagram_url, website_url, map_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.beachId,
          data.name,
          data.category,
          data.description,
          data.image || null,
          data.address || null,
          data.phone || null,
          data.whatsappUrl || null,
          data.instagramUrl || null,
          data.websiteUrl || null,
          data.mapUrl || null,
          data.status,
        ],
      );
      return findPartner(database, result.insertId);
    },

    async updatePartner(id, data) {
      const update = buildUpdates(data, {
        beachId: "beach_id",
        name: "name",
        category: "category",
        description: "description",
        image: "image",
        address: "address",
        phone: "phone",
        whatsappUrl: "whatsapp_url",
        instagramUrl: "instagram_url",
        websiteUrl: "website_url",
        mapUrl: "map_url",
        status: "status",
      });
      const [result] = await database.execute(
        `UPDATE partners SET ${update.sql} WHERE id = ?`,
        [...update.values, id],
      );
      if (result.affectedRows === 0)
        throw new AppError(
          404,
          "PARTNER_NOT_FOUND",
          "Parceiro não encontrado.",
        );
      return findPartner(database, id);
    },

    async archivePartner(id) {
      const [result] = await database.execute(
        "UPDATE partners SET status = 'archived' WHERE id = ?",
        [id],
      );
      if (result.affectedRows === 0)
        throw new AppError(
          404,
          "PARTNER_NOT_FOUND",
          "Parceiro não encontrado.",
        );
      return findPartner(database, id);
    },

    async listReviews({ status, search = "", page = 1, limit = 20 }) {
      const conditions = [];
      const values = [];
      if (status) {
        conditions.push("r.status = ?");
        values.push(status);
      }
      if (search) {
        conditions.push(
          "(r.author_name LIKE ? OR r.comment LIKE ? OR b.name LIKE ?)",
        );
        values.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const where = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";
      const [[count]] = await database.execute(
        `SELECT COUNT(*) AS total FROM reviews r JOIN beaches b ON b.id = r.beach_id ${where}`,
        values,
      );
      const [rows] = await database.execute(
        `SELECT r.*, b.name AS beach_name FROM reviews r JOIN beaches b ON b.id = r.beach_id ${where}
         ORDER BY r.created_at DESC, r.id DESC LIMIT ? OFFSET ?`,
        [...values, limit, (page - 1) * limit],
      );
      return {
        items: rows.map(mapReview),
        pagination: pagination(page, limit, count.total),
      };
    },

    async updateReviewStatus(id, status) {
      const [result] = await database.execute(
        "UPDATE reviews SET status = ? WHERE id = ?",
        [status, id],
      );
      if (result.affectedRows === 0)
        throw new AppError(
          404,
          "REVIEW_NOT_FOUND",
          "Avaliação não encontrada.",
        );
      const [rows] = await database.execute(
        "SELECT r.*, b.name AS beach_name FROM reviews r JOIN beaches b ON b.id = r.beach_id WHERE r.id = ?",
        [id],
      );
      return mapReview(rows[0]);
    },

    async listMessages({ status, search = "", page = 1, limit = 20 }) {
      const conditions = [];
      const values = [];
      if (status) {
        conditions.push("status = ?");
        values.push(status);
      }
      if (search) {
        conditions.push("(name LIKE ? OR email LIKE ? OR message LIKE ?)");
        values.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const where = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : "";
      const [[count]] = await database.execute(
        `SELECT COUNT(*) AS total FROM contact_messages ${where}`,
        values,
      );
      const [rows] = await database.execute(
        `SELECT * FROM contact_messages ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
        [...values, limit, (page - 1) * limit],
      );
      return {
        items: rows.map(mapMessage),
        pagination: pagination(page, limit, count.total),
      };
    },

    async updateMessageStatus(id, status) {
      const [result] = await database.execute(
        "UPDATE contact_messages SET status = ? WHERE id = ?",
        [status, id],
      );
      if (result.affectedRows === 0)
        throw new AppError(
          404,
          "MESSAGE_NOT_FOUND",
          "Mensagem não encontrada.",
        );
      const [rows] = await database.execute(
        "SELECT * FROM contact_messages WHERE id = ?",
        [id],
      );
      return mapMessage(rows[0]);
    },
  };
}
