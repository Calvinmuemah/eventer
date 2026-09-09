import db from '../db/index.js';

export const paymentAssistanceRepository = {
  async create(data) {
    const query = `
      INSERT INTO payment_assistance_requests (
        booking_reference, booking_id, name, phone, email, message, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.bookingReference,
      data.bookingId || null,
      data.name,
      data.phone,
      data.email,
      data.message,
      'Pending',
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findByBookingReference(ref) {
    const query = `
      SELECT * FROM payment_assistance_requests
      WHERE booking_reference = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [ref]);
    return result.rows;
  }
};
