export function toBoolean(value) {
  return value === 1 || value === true;
}

export function mapBeach(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location,
    summary: row.summary,
    description: row.description,
    heroImage: row.hero_image,
    mapUrl: row.map_url,
    status: row.status,
    featured: toBoolean(row.featured),
    ratingAverage: Number(row.rating_average || 0),
    reviewCount: Number(row.review_count || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPartner(row) {
  return {
    id: row.id,
    beachId: row.beach_id,
    beachName: row.beach_name,
    name: row.name,
    category: row.category,
    description: row.description,
    image: row.image,
    address: row.address,
    phone: row.phone,
    whatsappUrl: row.whatsapp_url,
    instagramUrl: row.instagram_url,
    websiteUrl: row.website_url,
    mapUrl: row.map_url,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapReview(row) {
  return {
    id: row.id,
    beachId: row.beach_id,
    beachName: row.beach_name,
    authorName: row.author_name,
    rating: Number(row.rating),
    comment: row.comment,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMessage(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
