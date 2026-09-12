import db from '../db/index.js';

export const usersRepository = {
  async findByEmail(email) {
    const query = `
      SELECT * FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `;
    const result = await db.query(query, [email.trim()]);
    return result.rows[0] || null;
  },

  async findById(id) {
    const query = `
      SELECT id, email, full_name, phone, role, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async create({ email, passwordHash, fullName, phone = null, role = 'admin' }) {
    const query = `
      INSERT INTO users (
        email, password_hash, full_name, phone, role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, phone, role, created_at
    `;
    const values = [email.trim().toLowerCase(), passwordHash, fullName.trim(), phone, role];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async countAdmins() {
    const query = `
      SELECT COUNT(*)::int AS count
      FROM users
      WHERE role = 'admin'
    `;
    const result = await db.query(query);
    return result.rows[0]?.count || 0;
  },

  async updatePassword(id, passwordHash) {
    const query = `
      UPDATE users
      SET password_hash = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, full_name, role
    `;
    const result = await db.query(query, [id, passwordHash]);
    return result.rows[0] || null;
  }
};
