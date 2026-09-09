import db from '../db/index.js';

export const quotesRepository = {
  async create(data, items = [], client = null) {
    const runner = client || db;
    const query = `
      INSERT INTO quotes (
        quote_number, event_request_id, subtotal, discount, total,
        notes, status, valid_until
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      data.quoteNumber,
      data.eventRequestId,
      data.subtotal || 0,
      data.discount || 0,
      data.total || 0,
      data.notes || null,
      data.status || 'Sent',
      data.validUntil || null,
    ];
    const result = await runner.query(query, values);
    const quote = result.rows[0];

    if (items.length > 0) {
      for (const item of items) {
        await runner.query(
          `INSERT INTO quote_items (quote_id, service_id, service_name, description, unit_price, quantity, total_price)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            quote.id,
            item.serviceId || null,
            item.serviceName,
            item.description || null,
            item.unitPrice,
            item.quantity || 1,
            item.totalPrice,
          ]
        );
      }
    }

    return quote;
  },

  async findById(id) {
    const quoteQuery = `
      SELECT 
        q.*,
        er.reference_code AS request_reference,
        er.full_name AS customer_name,
        er.email AS customer_email,
        er.phone AS customer_phone,
        er.event_type,
        er.event_date,
        er.event_location,
        er.guest_count,
        COALESCE(
          json_agg(
            json_build_object(
              'id', qi.id,
              'service_id', qi.service_id,
              'service_name', qi.service_name,
              'description', qi.description,
              'unit_price', qi.unit_price,
              'quantity', qi.quantity,
              'total_price', qi.total_price
            )
          ) FILTER (WHERE qi.id IS NOT NULL), '[]'
        ) AS items
      FROM quotes q
      JOIN event_requests er ON q.event_request_id = er.id
      LEFT JOIN quote_items qi ON q.id = qi.quote_id
      WHERE q.id = $1
      GROUP BY q.id, er.id
    `;
    const result = await db.query(quoteQuery, [id]);
    return result.rows[0] || null;
  },

  async findByQuoteNumber(quoteNumber) {
    const quoteQuery = `
      SELECT 
        q.*,
        er.reference_code AS request_reference,
        er.full_name AS customer_name,
        er.email AS customer_email,
        er.phone AS customer_phone,
        er.event_type,
        er.event_date,
        er.event_location,
        er.guest_count,
        COALESCE(
          json_agg(
            json_build_object(
              'id', qi.id,
              'service_id', qi.service_id,
              'service_name', qi.service_name,
              'description', qi.description,
              'unit_price', qi.unit_price,
              'quantity', qi.quantity,
              'total_price', qi.total_price
            )
          ) FILTER (WHERE qi.id IS NOT NULL), '[]'
        ) AS items
      FROM quotes q
      JOIN event_requests er ON q.event_request_id = er.id
      LEFT JOIN quote_items qi ON q.id = qi.quote_id
      WHERE q.quote_number = $1
      GROUP BY q.id, er.id
    `;
    const result = await db.query(quoteQuery, [quoteNumber]);
    return result.rows[0] || null;
  },

  async findByEventRequestId(eventRequestId) {
    const query = `SELECT * FROM quotes WHERE event_request_id = $1 ORDER BY created_at DESC LIMIT 1`;
    const result = await db.query(query, [eventRequestId]);
    return result.rows[0] || null;
  },

  async updateStatus(id, status, changeNotes = null, client = null) {
    const runner = client || db;
    const query = `
      UPDATE quotes
      SET status = $2,
          change_request_notes = COALESCE($3, change_request_notes),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await runner.query(query, [id, status, changeNotes]);
    return result.rows[0] || null;
  }
};
