import React, { useEffect, useState } from 'react';
import { ExternalLink, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import StatusBadge from '../components/common/StatusBadge';

export const EventRequestsAdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getEventRequests();
      setRequests(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load event requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminApi.updateEventRequestStatus(id, newStatus);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Event Inquiries & Requests</h1>
          <p className="admin-subtitle">Review multi-service requests submitted by potential clients through the event planner.</p>
        </div>
        <button onClick={fetchRequests} className="admin-btn admin-btn-outline">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading event requests...</div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
          <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchRequests} className="admin-btn admin-btn-outline admin-btn-sm">Retry</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client Contact</th>
                <th>Event Specs</th>
                <th>Services Selected</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                    No client requests recorded yet.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.reference_code}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {new Date(req.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.full_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{req.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{req.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>{req.event_type}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                        {req.event_date ? new Date(req.event_date).toLocaleDateString() : 'Date TBD'} • {req.guest_count} Guests
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--admin-text-muted)' }}>
                        📍 {req.event_location}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxWidth: '240px' }}>
                        {(req.services || []).map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              backgroundColor: 'rgba(8, 26, 43, 0.06)',
                              borderRadius: '4px',
                              fontWeight: 500,
                            }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className="admin-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 'auto' }}
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="quoted">Quoted</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {req.quote_id ? (
                        <a
                          href={`http://localhost:5173/quote/${req.quote_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          title="View Client Quotation"
                        >
                          <FileText size={13} /> View Quote <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>No quote yet</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventRequestsAdminPage;
