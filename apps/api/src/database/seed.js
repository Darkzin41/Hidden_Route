import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { pool } from "./pool.js";
import { buildSeedData } from "./seed-data.js";

async function seed() {
  const connection = await pool.getConnection();
  const data = buildSeedData();

  try {
    await connection.beginTransaction();
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await connection.execute(
      `INSERT INTO admins (name, email, password_hash)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)`,
      [env.ADMIN_NAME, env.ADMIN_EMAIL.toLowerCase(), passwordHash],
    );

    const beachIds = new Map();
    for (const beach of data.beaches) {
      await connection.execute(
        `INSERT INTO beaches (slug, name, location, summary, description, hero_image, map_url, status, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), location = VALUES(location), summary = VALUES(summary),
           description = VALUES(description), hero_image = VALUES(hero_image), map_url = VALUES(map_url),
           status = VALUES(status), featured = VALUES(featured)`,
        [
          beach.slug,
          beach.name,
          beach.location,
          beach.summary,
          beach.description,
          beach.heroImage,
          beach.mapUrl,
          beach.status,
          beach.featured,
        ],
      );
      const [[row]] = await connection.execute(
        "SELECT id FROM beaches WHERE slug = ?",
        [beach.slug],
      );
      beachIds.set(beach.slug, row.id);
      await connection.execute("DELETE FROM beach_images WHERE beach_id = ?", [
        row.id,
      ]);
      for (const image of beach.images) {
        await connection.execute(
          "INSERT INTO beach_images (beach_id, image_path, alt_text, sort_order) VALUES (?, ?, ?, ?)",
          [row.id, image.imagePath, image.altText, image.sortOrder],
        );
      }
    }

    for (const partner of data.partners) {
      await connection.execute(
        `INSERT INTO partners
          (beach_id, name, category, description, image, address, phone, whatsapp_url, instagram_url, website_url, map_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE category = VALUES(category), description = VALUES(description), image = VALUES(image),
           address = VALUES(address), phone = VALUES(phone), whatsapp_url = VALUES(whatsapp_url),
           instagram_url = VALUES(instagram_url), website_url = VALUES(website_url), map_url = VALUES(map_url),
           status = VALUES(status)`,
        [
          beachIds.get(partner.beachSlug),
          partner.name,
          partner.category,
          partner.description,
          partner.image,
          partner.address,
          partner.phone,
          partner.whatsappUrl,
          partner.instagramUrl,
          partner.websiteUrl,
          partner.mapUrl,
          partner.status,
        ],
      );
    }

    await connection.commit();
    console.log("Seed local aplicado com sucesso.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

try {
  await seed();
} finally {
  await pool.end();
}
