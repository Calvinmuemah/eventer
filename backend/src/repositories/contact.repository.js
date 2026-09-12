import db from '../db/index.js';
import { normalizeKenyanPhone } from '../utils/phone.js';

export const contactRepository = {
  async create(data) {
    const query = `
      INSERT INTO contact_messages (
        full_name, email, phone, subject, message
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      data.fullName,
      data.email,
      data.phone ? normalizeKenyanPhone(data.phone) : null,
      data.subject,
      data.message,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }
};
