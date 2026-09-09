import db from '../db/index.js';

export const servicesRepository = {
  async findAll() {
    const query = `
      SELECT id, name, slug, short_description, description, image_url, features, sort_order, created_at
      FROM services
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC
    `;
    const result = await db.query(query);
    return result.rows;
  },

  async findBySlug(slug) {
    const query = `
      SELECT id, name, slug, short_description, description, image_url, features, sort_order, created_at
      FROM services
      WHERE slug = $1 AND is_active = true
      LIMIT 1
    `;
    const result = await db.query(query, [slug]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const query = `
      SELECT id, name, slug, short_description, description, image_url, features, sort_order, created_at
      FROM services
      WHERE id = $1
      LIMIT 1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async findByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const query = `
      SELECT id, name, slug, short_description, description, image_url, features, sort_order
      FROM services
      WHERE id = ANY($1::uuid[]) AND is_active = true
      ORDER BY sort_order ASC
    `;
    const result = await db.query(query, [ids]);
    return result.rows;
  }
};
