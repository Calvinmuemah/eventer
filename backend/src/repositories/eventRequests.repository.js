import db from '../db/index.js';

export const eventRequestsRepository = {
  async create(data, client = null) {
    const runner = client || db;
    const query = `
      INSERT INTO event_requests (
        reference_code, full_name, email, phone, event_type,
        event_date, event_location, guest_count, budget_range,
        additional_requirements, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      data.referenceCode,
      data.fullName,
      data.email,
      data.phone,
      data.eventType,
      data.eventDate,
      data.eventLocation,
      data.guestCount,
      data.budgetRange || null,
      data.additionalRequirements || null,
      data.notes || null,
      'submitted',
    ];
    const result = await runner.query(query, values);
    return result.rows[0];
  },

  async linkServices(eventRequestId, serviceIds, client = null) {
    const runner = client || db;
    for (const serviceId of serviceIds) {
      await runner.query(
        `INSERT INTO event_request_services (event_request_id, service_id)
         VALUES ($1, $2)
         ON CONFLICT (event_request_id, service_id) DO NOTHING`,
        [eventRequestId, serviceId]
      );
    }
  },

  async findById(id) {
    const query = `
      SELECT 
        er.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'name', s.name,
              'slug', s.slug,
              'image_url', s.image_url
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS services
      FROM event_requests er
      LEFT JOIN event_request_services ers ON er.id = ers.event_request_id
      LEFT JOIN services s ON ers.service_id = s.id
      WHERE er.id = $1
      GROUP BY er.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  async findByReference(referenceCode) {
    const query = `
      SELECT 
        er.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'name', s.name,
              'slug', s.slug,
              'image_url', s.image_url
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) AS services
      FROM event_requests er
      LEFT JOIN event_request_services ers ON er.id = ers.event_request_id
      LEFT JOIN services s ON ers.service_id = s.id
      WHERE er.reference_code = $1
      GROUP BY er.id
    `;
    const result = await db.query(query, [referenceCode]);
    return result.rows[0] || null;
  }
};
