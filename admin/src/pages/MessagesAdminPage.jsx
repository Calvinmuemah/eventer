import React, { useEffect, useState } from 'react';
import { RotateCcw, Mail, Phone, CheckSquare, Square } from 'lucide-react';
import { adminApi } from '../api/adminApi';

export const MessagesAdminPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getContactMessages();
      setMessages(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentRead) => {
    try {
      await adminApi.toggleMessageRead(id, !currentRead);
      fetchMessages();
    } catch (err) {
      alert(err.message || 'Failed to update message status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Client Contact Messages</h1>
          <p className="admin-subtitle">Inquiries and messages submitted through the public Contact Concierge portal.</p>
        </div>
        <button onClick={fetchMessages} className="admin-btn admin-btn-outline">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading client messages...</div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
          <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchMessages} className="admin-btn admin-btn-outline admin-btn-sm">Retry</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Read</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message Content</th>
                <th style={{ textAlign: 'right' }}>Received</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                    No contact inquiries received yet.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr key={m.id} style={{ backgroundColor: m.is_read ? 'transparent' : 'rgba(201, 162, 39, 0.04)' }}>
                    <td>
                      <button
                        onClick={() => handleToggleRead(m.id, m.is_read)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: m.is_read ? 'var(--admin-text-light)' : 'var(--admin-accent-hover)' }}
                        title={m.is_read ? 'Mark as Unread' : 'Mark as Read'}
                      >
                        {m.is_read ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                    </td>
                    <td>
                      <div style={{ fontWeight: m.is_read ? 500 : 700 }}>{m.full_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{m.email}</div>
                      {m.phone && <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{m.phone}</div>}
                    </td>
                    <td>
                      <span style={{ fontWeight: m.is_read ? 500 : 700, color: 'var(--admin-primary)' }}>
                        {m.subject}
                      </span>
                    </td>
                    <td>
                      <div style={{ maxWidth: '440px', fontSize: '0.85rem', color: 'var(--admin-text-main)', lineHeight: 1.45 }}>
                        {m.message}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(m.created_at).toLocaleString()}
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

export default MessagesAdminPage;
