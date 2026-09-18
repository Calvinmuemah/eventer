import React, { useEffect, useState } from 'react';
import { RotateCcw, Phone, Mail, MessageSquare, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import StatusBadge from '../components/common/StatusBadge';

export const PaymentAssistanceAdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

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

  const filteredRequests = statusFilter === 'All' 
    ? requests 
    : requests.filter((r) => (r.status || 'Pending').toLowerCase() === statusFilter.toLowerCase());

  const pendingCount = requests.filter((r) => (r.status || 'Pending') === 'Pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 className="admin-title">Payment Assistance Inquiries</h1>
            {pendingCount > 0 && (
              <span style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
              }}>
                {pendingCount} Pending Action
              </span>
            )}
          </div>
          <p className="admin-subtitle">Real-time alerts for clients requesting guidance on Bank Card or Wire payments.</p>
        </div>
        <button onClick={fetchRequests} className="admin-btn admin-btn-outline">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
        {['All', 'Pending', 'Contacted', 'Resolved'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: statusFilter === tab ? '1.5px solid var(--admin-accent)' : '1px solid var(--admin-border)',
              backgroundColor: statusFilter === tab ? 'var(--admin-primary)' : '#FFFFFF',
              color: statusFilter === tab ? '#FFFFFF' : 'var(--admin-text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab}
          </button>
        ))}
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
                <th>Inquiry / Notes</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                    No payment assistance inquiries found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r) => {
                  const phoneDigits = (r.phone || '').replace(/[^0-9]/g, '');
                  const waNumber = phoneDigits.startsWith('0') ? '254' + phoneDigits.slice(1) : phoneDigits;
                  const waUrl = phoneDigits ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${r.name}, this is MC Titoe Events regarding your booking ${r.booking_reference}. We received your payment assistance request.`)}` : null;

                  return (
                    <tr key={r.id}>
                      <td>
                        <strong style={{ color: 'var(--admin-primary)', fontSize: '0.95rem' }}>{r.booking_reference}</strong>
                        {r.balance !== null && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-accent)', fontWeight: 600, marginTop: '2px' }}>
                            Balance: KSh {parseFloat(r.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>{r.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '3px', flexWrap: 'wrap' }}>
                          <a 
                            href={`tel:${r.phone}`} 
                            style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                          >
                            <Phone size={12} color="var(--admin-primary)" /> {r.phone}
                          </a>
                          {waUrl && (
                            <a 
                              href={waUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                fontSize: '0.75rem',
                                color: '#10B981',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                              }}
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>
                        {r.email && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                            <Mail size={12} /> <a href={`mailto:${r.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{r.email}</a>
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{
                          maxWidth: '440px',
                          fontSize: '0.875rem',
                          lineHeight: 1.45,
                          color: 'var(--admin-text-main)',
                          backgroundColor: 'rgba(8, 26, 43, 0.03)',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '6px',
                          borderLeft: '3px solid var(--admin-accent)',
                        }}>
                          "{r.message}"
                        </div>
                      </td>
                      <td>
                        <select
                          value={r.status || 'Pending'}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          className="admin-select"
                          style={{
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            padding: '0.35rem 0.65rem',
                            width: 'auto',
                            borderColor: r.status === 'Resolved' ? '#10B981' : r.status === 'Contacted' ? '#3B82F6' : '#EF4444',
                            color: r.status === 'Resolved' ? '#065F46' : r.status === 'Contacted' ? '#1E40AF' : '#991B1B',
                            backgroundColor: r.status === 'Resolved' ? '#ECFDF5' : r.status === 'Contacted' ? '#EFF6FF' : '#FEF2F2',
                          }}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentAssistanceAdminPage;
