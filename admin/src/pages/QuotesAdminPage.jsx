import React, { useEffect, useState } from 'react';
import { ExternalLink, RotateCcw, Check, DollarSign } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import StatusBadge from '../components/common/StatusBadge';

export const QuotesAdminPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getQuotes();
      setQuotes(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load quotes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminApi.updateQuote(id, { status });
      fetchQuotes();
    } catch (err) {
      alert(err.message || 'Failed to update quote status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Quotations Ledger</h1>
          <p className="admin-subtitle">Monitor pricing schedules, discounts, line items, and client acceptance states.</p>
        </div>
        <button onClick={fetchQuotes} className="admin-btn admin-btn-outline">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading quotations...</div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
          <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchQuotes} className="admin-btn admin-btn-outline admin-btn-sm">Retry</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Quote Number</th>
                <th>Client / Occasion</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total (KSh)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                    No quotations generated yet.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <strong>{q.quote_number}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        Valid: {q.valid_until ? new Date(q.valid_until).toLocaleDateString() : '14 Days'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{q.customer_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{q.event_type}</div>
                    </td>
                    <td>KSh {parseFloat(q.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ color: '#166534' }}>-KSh {parseFloat(q.discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--admin-primary)' }}>
                        KSh {parseFloat(q.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td>
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        className="admin-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 'auto' }}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Change Requested">Change Requested</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <a
                        href={`http://localhost:5173/quote/${q.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        title="View Public Document"
                      >
                        Client View <ExternalLink size={12} />
                      </a>
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

export default QuotesAdminPage;
