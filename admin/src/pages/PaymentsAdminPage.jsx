import React, { useEffect, useState } from 'react';
import { RotateCcw, DollarSign, ExternalLink } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import StatusBadge from '../components/common/StatusBadge';

export const PaymentsAdminPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getPayments();
      setPayments(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load payments ledger.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Payments & Transactions</h1>
          <p className="admin-subtitle">Audit trail of authorized transactions, sandbox simulations, and payment references.</p>
        </div>
        <button onClick={fetchPayments} className="admin-btn admin-btn-outline">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading payments...</div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
          <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchPayments} className="admin-btn admin-btn-outline admin-btn-sm">Retry</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Transaction Ref</th>
                <th>Booking Reference</th>
                <th>Client / Event</th>
                <th>Amount (USD)</th>
                <th>Method / Provider</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.transaction_reference}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>
                        {p.booking_reference}
                      </span>
                    </td>
                    <td>
                      <div>{p.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{p.event_type}</div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.95rem', color: '#166534' }}>
                        +${parseFloat(p.amount).toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <div style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.8rem' }}>
                        {p.payment_method}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--admin-text-muted)' }}>
                        {p.provider}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(p.created_at).toLocaleString()}
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

export default PaymentsAdminPage;
