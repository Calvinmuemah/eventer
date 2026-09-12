import db from '../db/index.js';

export const paymentsRepository = {
  async create(data, client = null) {
    const runner = client || db;
    const query = `
      INSERT INTO payments (
        booking_id, transaction_reference, amount, currency,
        provider, payment_method, status, provider_response
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      data.bookingId,
      data.transactionReference,
      data.amount,
      data.currency || 'KES',
      data.provider || 'mock_provider',
      data.paymentMethod || 'card',
      data.status || 'Pending',
      JSON.stringify(data.providerResponse || {}),
    ];
    const result = await runner.query(query, values);
    return result.rows[0];
  },

  async findByBookingId(bookingId) {
    const query = `
      SELECT * FROM payments
      WHERE booking_id = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [bookingId]);
    return result.rows;
  },

  async findByTransactionReference(txRef) {
    const query = `
      SELECT * FROM payments
      WHERE transaction_reference = $1
      LIMIT 1
    `;
    const result = await db.query(query, [txRef]);
    return result.rows[0] || null;
  }
};
