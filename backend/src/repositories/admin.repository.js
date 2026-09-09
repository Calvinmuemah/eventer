import db from '../db/index.js';

export const adminRepository = {
  async getDashboardStats() {
    const statsQuery = `
      SELECT
        (SELECT COUNT(*) FROM event_requests) AS total_requests,
        (SELECT COUNT(*) FROM bookings) AS total_bookings,
        (SELECT COALESCE(SUM(amount_paid), 0) FROM bookings) AS total_revenue,
        (SELECT COALESCE(SUM(balance), 0) FROM bookings) AS total_balance_due,
        (SELECT COUNT(*) FROM services WHERE is_active = true) AS active_services,
        (SELECT COUNT(*) FROM payment_assistance_requests WHERE status = 'Pending') AS pending_assistance,
        (SELECT COUNT(*) FROM contact_messages WHERE is_read = false) AS unread_messages
    `;
    const statsRes = await db.query(statsQuery);

    const recentRequestsQuery = `
      SELECT id, reference_code, full_name, event_type, event_date, guest_count, status, created_at
      FROM event_requests
      ORDER BY created_at DESC
      LIMIT 5
    `;
    const recentRequestsRes = await db.query(recentRequestsQuery);

    const recentBookingsQuery = `
      SELECT b.id, b.booking_reference, er.full_name AS customer_name, er.event_type, 
             b.total_amount, b.amount_paid, b.payment_status, b.booking_status, b.created_at
      FROM bookings b
      JOIN event_requests er ON b.event_request_id = er.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `;
    const recentBookingsRes = await db.query(recentBookingsQuery);

    return {
      overview: statsRes.rows[0],
      recentRequests: recentRequestsRes.rows,
      recentBookings: recentBookingsRes.rows,
    };
  },

  // Services Management
  async getAllServices() {
    const query = `
      SELECT *
      FROM services
      ORDER BY sort_order ASC, name ASC
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async createService(data) {
    const query = `
      INSERT INTO services (name, slug, short_description, description, image_url, features, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      data.name,
      data.slug,
      data.short_description,
      data.description,
      data.image_url,
      JSON.stringify(data.features || []),
      data.is_active !== undefined ? data.is_active : true,
      data.sort_order || 0,
    ];
    const res = await db.query(query, values);
    return res.rows[0];
  },

  async updateService(id, data) {
    const query = `
      UPDATE services
      SET name = COALESCE($2, name),
          slug = COALESCE($3, slug),
          short_description = COALESCE($4, short_description),
          description = COALESCE($5, description),
          image_url = COALESCE($6, image_url),
          features = COALESCE($7, features),
          is_active = COALESCE($8, is_active),
          sort_order = COALESCE($9, sort_order),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      data.name,
      data.slug,
      data.short_description,
      data.description,
      data.image_url,
      data.features ? JSON.stringify(data.features) : null,
      data.is_active,
      data.sort_order,
    ];
    const res = await db.query(query, values);
    return res.rows[0] || null;
  },

  async deleteService(id) {
    // Attempt delete; if foreign key referenced, toggle is_active = false
    try {
      const res = await db.query(`DELETE FROM services WHERE id = $1 RETURNING *`, [id]);
      return res.rows[0] || null;
    } catch (err) {
      if (err.code === '23503') {
        const fallbackRes = await db.query(
          `UPDATE services SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
          [id]
        );
        return fallbackRes.rows[0] || null;
      }
      throw err;
    }
  },

  // Event Requests
  async getAllEventRequests() {
    const query = `
      SELECT 
        er.*,
        q.id AS quote_id,
        q.quote_number,
        q.total AS quote_total,
        q.status AS quote_status,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'name', s.name,
              'slug', s.slug
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS services
      FROM event_requests er
      LEFT JOIN quotes q ON q.event_request_id = er.id
      LEFT JOIN event_request_services ers ON er.id = ers.event_request_id
      LEFT JOIN services s ON ers.service_id = s.id
      GROUP BY er.id, q.id
      ORDER BY er.created_at DESC
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async updateEventRequestStatus(id, status) {
    const query = `
      UPDATE event_requests
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const res = await db.query(query, [id, status]);
    return res.rows[0] || null;
  },

  // Quotes
  async getAllQuotes() {
    const query = `
      SELECT 
        q.*,
        er.full_name AS customer_name,
        er.email AS customer_email,
        er.event_type,
        er.event_date,
        COUNT(qi.id) AS item_count
      FROM quotes q
      JOIN event_requests er ON q.event_request_id = er.id
      LEFT JOIN quote_items qi ON q.id = qi.quote_id
      GROUP BY q.id, er.id
      ORDER BY q.created_at DESC
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async updateQuote(id, data) {
    const query = `
      UPDATE quotes
      SET subtotal = COALESCE($2, subtotal),
          discount = COALESCE($3, discount),
          total = COALESCE($4, total),
          notes = COALESCE($5, notes),
          status = COALESCE($6, status),
          valid_until = COALESCE($7, valid_until),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      data.subtotal,
      data.discount,
      data.total,
      data.notes,
      data.status,
      data.valid_until,
    ];
    const res = await db.query(query, values);
    return res.rows[0] || null;
  },

  // Bookings
  async getAllBookings() {
    const query = `
      SELECT 
        b.*,
        er.full_name AS customer_name,
        er.email AS customer_email,
        er.phone AS customer_phone,
        er.event_type,
        er.event_date,
        er.event_location,
        q.quote_number,
        (SELECT COUNT(*) FROM booking_services bs WHERE bs.booking_id = b.id) AS services_count
      FROM bookings b
      JOIN event_requests er ON b.event_request_id = er.id
      JOIN quotes q ON b.quote_id = q.id
      ORDER BY b.created_at DESC
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async updateBookingStatus(id, bookingStatus, paymentStatus) {
    const query = `
      UPDATE bookings
      SET booking_status = COALESCE($2, booking_status),
          payment_status = COALESCE($3, payment_status),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const res = await db.query(query, [id, bookingStatus, paymentStatus]);
    return res.rows[0] || null;
  },

  // Payments
  async getAllPayments() {
    const query = `
      SELECT 
        p.*,
        b.booking_reference,
        er.full_name AS customer_name,
        er.event_type
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN event_requests er ON b.event_request_id = er.id
      ORDER BY p.created_at DESC
    `;
    const res = await db.query(query);
    return res.rows;
  },

  // Payment Assistance Requests
  async getAllPaymentAssistance() {
    const query = `
      SELECT 
        par.*,
        b.total_amount,
        b.balance
      FROM payment_assistance_requests par
      LEFT JOIN bookings b ON par.booking_reference = b.booking_reference
      ORDER BY par.created_at DESC
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async updatePaymentAssistanceStatus(id, status) {
    const query = `
      UPDATE payment_assistance_requests
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const res = await db.query(query, [id, status]);
    return res.rows[0] || null;
  },

  // Contact Messages
  async getAllContactMessages() {
    const query = `
      SELECT *
      FROM contact_messages
      ORDER BY created_at DESC
    `;
    const res = await db.query(query);
    return res.rows;
  },

  async toggleContactMessageRead(id, isRead) {
    const query = `
      UPDATE contact_messages
      SET is_read = $2
      WHERE id = $1
      RETURNING *
    `;
    const res = await db.query(query, [id, isRead]);
    return res.rows[0] || null;
  }
};
