import React, { useEffect, useState } from 'react';
import { RotateCcw, Phone, Mail, MessageSquare } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import StatusBadge from '../components/common/StatusBadge';

export const PaymentAssistanceAdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getPaymentAssistance();
      setRequests(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load payment assistance inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminApi.updatePaymentAssistanceStatus(id, status);
      fetchRequests();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Payment Assistance Inquiries</h1>
          <p className="admin-subtitle">Inquiries from clients requesting wire instructions, invoicing, or payment arrangements.</p>
        </div>
        <button onClick={fetchRequests} className="admin-btn admin-btn-outline">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading assistance requests...</div>
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
                <th>Booking Ref</th>
                <th>Client Details</th>
                <th>Inquiry / Message</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                    No payment assistance inquiries submitted.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ color: 'var(--admin-primary)' }}>{r.booking_reference}</strong>
                      {r.balance !== null && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                          Balance: KSh {parseFloat(r.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Phone size={11} /> {r.phone}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Mail size={11} /> {r.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '420px', fontSize: '0.875rem', lineHeight: 1.4, color: 'var(--admin-text-main)' }}>
                        "{r.message}"
                      </div>
                    </td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusChange(r.id, e.target.value)}
                        className="admin-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 'auto' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(r.created_at).toLocaleString()}
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

export default PaymentAssistanceAdminPage;
