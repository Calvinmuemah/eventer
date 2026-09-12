import React, { useEffect, useState } from 'react';
import { ExternalLink, RotateCcw, ShieldCheck } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import StatusBadge from '../components/common/StatusBadge';

export const BookingsAdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getBookings();
      setBookings(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, bookingStatus, paymentStatus) => {
    try {
      await adminApi.updateBookingStatus(id, bookingStatus, paymentStatus);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to update booking.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Bookings & Reservations</h1>
          <p className="admin-subtitle">Confirmed client production schedules, settled balances, and operational staging states.</p>
        </div>
        <button onClick={fetchBookings} className="admin-btn admin-btn-outline">
          <RotateCcw size={15} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading bookings...</div>
      ) : error ? (
        <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
          <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchBookings} className="admin-btn admin-btn-outline admin-btn-sm">Retry</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Client & Venue</th>
                <th>Event Date</th>
                <th>Total / Paid / Balance</th>
                <th>Payment State</th>
                <th>Booking State</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--admin-text-muted)' }}>
                    No bookings recorded in ledger yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.booking_reference}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        Quote: {b.quote_number}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.customer_name}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--admin-text-muted)' }}>{b.event_type}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>📍 {b.event_location}</div>
                    </td>
                    <td>
                      {b.event_date ? new Date(b.event_date).toLocaleDateString() : 'TBD'}
                    </td>
                    <td>
                      <div>Total: <strong>KSh {parseFloat(b.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: '#166534' }}>Paid: KSh {parseFloat(b.amount_paid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div style={{ fontSize: '0.8rem', color: parseFloat(b.balance) > 0 ? '#B45309' : '#166534', fontWeight: 600 }}>
                        Balance: KSh {parseFloat(b.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <select
                        value={b.payment_status}
                        onChange={(e) => handleUpdateStatus(b.id, b.booking_status, e.target.value)}
                        className="admin-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 'auto' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Assistance Requested">Assistance Requested</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={b.booking_status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value, b.payment_status)}
                        className="admin-select"
                        style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 'auto' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <a
                          href={`http://localhost:5173/booking/${b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          title="View Ledger"
                        >
                          Ledger <ExternalLink size={11} />
                        </a>
                        <a
                          href={`http://localhost:5173/booking-confirmation/${b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          title="View Confirmation Pass"
                        >
                          Pass <ExternalLink size={11} />
                        </a>
                      </div>
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

export default BookingsAdminPage;
