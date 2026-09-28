import { AppError } from "../../lib/errors.js";
import { mapBeach, mapPartner, mapReview } from "../../lib/database-mappers.js";

const publicBeachSelect = `
  SELECT b.*,
    COALESCE(ROUND(AVG(CASE WHEN r.status = 'approved' THEN r.rating END), 1), 0) AS rating_average,
    COUNT(CASE WHEN r.status = 'approved' THEN 1 END) AS review_count
  FROM beaches b
  LEFT JOIN reviews r ON r.beach_id = b.id
`;

export function createCatalogRepository(database) {
  return {
    async listPublicBeaches({ search = "" }) {
      const term = `%${search}%`;
      const [rows] = await database.execute(
        `${publicBeachSelect}
         WHERE b.status = 'published' AND (? = '%%' OR b.name LIKE ? OR b.location LIKE ?)
         GROUP BY b.id
         ORDER BY b.featured DESC, b.name ASC`,
        [term, term, term],
      );
      return rows.map(mapBeach);
    },

    async getPublicBeachBySlug(slug) {
      const [rows] = await database.execute(
        `${publicBeachSelect}
         WHERE b.slug = ? AND b.status = 'published'
         GROUP BY b.id`,
        [slug],
      );
      if (!rows[0]) return null;
      const beach = mapBeach(rows[0]);
      const [images] = await database.execute(
        "SELECT id, image_path, alt_text, sort_order FROM beach_images WHERE beach_id = ? ORDER BY sort_order, id",
        [beach.id],
      );
      const [partners] = await database.execute(
        `SELECT p.*, b.name AS beach_name FROM partners p
         JOIN beaches b ON b.id = p.beach_id
         WHERE p.beach_id = ? AND p.status = 'published' ORDER BY p.name`,
        [beach.id],
      );
      const [reviews] = await database.execute(
        `SELECT r.*, b.name AS beach_name FROM reviews r
         JOIN beaches b ON b.id = r.beach_id
         WHERE r.beach_id = ? AND r.status = 'approved'
         ORDER BY r.created_at DESC, r.id DESC`,
        [beach.id],
      );
      return {
        ...beach,
        images: images.map((image) => ({
          id: image.id,
          imagePath: image.image_path,
          altText: image.alt_text,
          sortOrder: image.sort_order,
        })),
        partners: partners.map(mapPartner),
        reviews: reviews.map(mapReview),
      };
    },

    async createReview({ beachId, authorName, rating, comment }) {
      const [result] = await database.execute(
        `INSERT INTO reviews (beach_id, author_name, rating, comment, status)
         SELECT id, ?, ?, ?, 'pending' FROM beaches WHERE id = ? AND status = 'published'`,
        [authorName, rating, comment, beachId],
      );
      if (result.affectedRows === 0)
        throw new AppError(404, "BEACH_NOT_FOUND", "Praia não encontrada.");
      return { id: result.insertId, status: "pending" };
    },

    async createContact({ name, email, message }) {
      const [result] = await database.execute(
        "INSERT INTO contact_messages (name, email, message, status) VALUES (?, ?, ?, 'new')",
        [name, email, message],
      );
      return { id: result.insertId, status: "new" };
    },
  };
}
