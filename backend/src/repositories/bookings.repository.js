import db from '../db/index.js';

export const bookingsRepository = {
  async create(data, services = [], client = null) {
    const runner = client || db;
    const query = `
      INSERT INTO bookings (
        booking_reference, event_request_id, quote_id,
        total_amount, amount_paid, balance,
        payment_status, booking_status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      data.bookingReference,
      data.eventRequestId,
      data.quoteId,
      data.totalAmount,
      data.amountPaid || 0,
      data.balance || data.totalAmount,
      data.paymentStatus || 'Pending',
      data.bookingStatus || 'Pending',
      data.notes || null,
    ];
    const result = await runner.query(query, values);
    const booking = result.rows[0];

    if (services.length > 0) {
      for (const item of services) {
        await runner.query(
          `INSERT INTO booking_services (booking_id, service_id, service_name, price)
           VALUES ($1, $2, $3, $4)`,
          [booking.id, item.serviceId || null, item.serviceName, item.price || 0]
        );
      }
    }

    return booking;
  },

  async findById(id) {
    const query = `
      SELECT 
        b.*,
        er.reference_code AS request_reference,
        er.full_name AS customer_name,
        er.email AS customer_email,
        er.phone AS customer_phone,
        er.event_type,
        er.event_date,
        er.event_location,
        er.guest_count,
        q.quote_number,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', bs.id,
              'service_id', bs.service_id,
              'service_name', bs.service_name,
              'price', bs.price
            )
          ) FILTER (WHERE bs.id IS NOT NULL), '[]'
        ) AS services,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', p.id,
                'transaction_reference', p.transaction_reference,
                'amount', p.amount,
                'provider', p.provider,
                'payment_method', p.payment_method,
                'status', p.status,
                'created_at', p.created_at
              )
            ) FROM payments p WHERE p.booking_id = b.id
          ), '[]'
        ) AS payments
      FROM bookings b
      JOIN event_requests er ON b.event_request_id = er.id
      JOIN quotes q ON b.quote_id = q.id
      LEFT JOIN booking_services bs ON b.id = bs.booking_id
      WHERE b.id = $1
      GROUP BY b.id, er.id, q.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async findByReference(reference) {
    const query = `SELECT id FROM bookings WHERE booking_reference = $1 LIMIT 1`;
    const res = await db.query(query, [reference]);
    if (!res.rows[0]) return null;
    return this.findById(res.rows[0].id);
  },

  async findByQuoteId(quoteId) {
    const query = `SELECT id FROM bookings WHERE quote_id = $1 LIMIT 1`;
    const res = await db.query(query, [quoteId]);
    if (!res.rows[0]) return null;
    return this.findById(res.rows[0].id);
  },

  async updatePaymentState(id, paymentStatus, amountPaid, balance, bookingStatus, client = null) {
    const runner = client || db;
    const query = `
      UPDATE bookings
      SET payment_status = $2,
          amount_paid = $3,
          balance = $4,
          booking_status = $5,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await runner.query(query, [id, paymentStatus, amountPaid, balance, bookingStatus]);
    return result.rows[0] || null;
  },

  async updatePaymentStatusOnly(id, paymentStatus, client = null) {
    const runner = client || db;
    const query = `
      UPDATE bookings
      SET payment_status = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await runner.query(query, [id, paymentStatus]);
    return result.rows[0] || null;
  }
};
