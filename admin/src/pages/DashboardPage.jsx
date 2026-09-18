import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  BookmarkCheck, 
  CalendarCheck, 
  Layers, 
  HelpCircle, 
  Mail, 
  Plus, 
  ArrowRight,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getStats();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
        Loading operational metrics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
        <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error || 'Unable to load metrics.'}</p>
        <button onClick={fetchStats} className="admin-btn admin-btn-outline admin-btn-sm">
          <RotateCcw size={14} /> Retry
        </button>
      </div>
    );
  }

  const { overview, recentRequests, recentBookings } = data;
  const pendingAssistanceCount = parseInt(overview.pending_assistance || 0, 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-title">Operational Overview</h1>
          <p className="admin-subtitle">Live status across reservations, staging services, and client inquiries.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/services" className="admin-btn admin-btn-primary">
            <Plus size={16} /> Manage Services
          </Link>
          <button onClick={fetchStats} className="admin-btn admin-btn-outline" title="Refresh metrics">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Urgent Payment Assistance Alert Banner */}
      {pendingAssistanceCount > 0 && (
        <div style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <AlertCircle size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '1rem' }}>
                {pendingAssistanceCount} Pending Payment Assistance Request{pendingAssistanceCount > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#B91C1C' }}>
                Clients have requested urgent guidance on paying via Bank Card or Wire. Review their notes and reach out.
              </div>
            </div>
          </div>
          <Link 
            to="/payment-assistance" 
            className="admin-btn admin-btn-sm" 
            style={{ backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            Review Inquiries <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        gap: '1.25rem',
      }}>
        <StatCard
          title="Total Revenue Settled"
          value={`KSh ${parseFloat(overview.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`KSh ${parseFloat(overview.total_balance_due || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} balance pending`}
          icon={DollarSign}
          color="accent"
        />
        <StatCard
          title="Total Bookings"
          value={overview.total_bookings}
          subtitle="Confirmed & active ledgers"
          icon={BookmarkCheck}
          color="success"
        />
        <StatCard
          title="Event Inquiries"
          value={overview.total_requests}
          subtitle="Submitted through planner"
          icon={CalendarCheck}
          color="info"
        />
        <StatCard
          title="Catalogue Services"
          value={overview.active_services}
          subtitle="Active staging disciplines"
          icon={Layers}
          color="primary"
        />
        <StatCard
          title="Assistance Inquiries"
          value={overview.pending_assistance}
          subtitle={`${overview.unread_messages} unread messages`}
          icon={HelpCircle}
          color="warning"
        />
      </div>

      {/* 2-Column Tables */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
        gap: '2rem',
      }}>
        {/* Recent Event Requests */}
        <div className="admin-table-container">
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--admin-primary)' }}>
              Recent Event Requests
            </h3>
            <Link to="/event-requests" style={{ fontSize: '0.8rem', color: 'var(--admin-accent-hover)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client</th>
                <th>Event Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    No event requests yet.
                  </td>
                </tr>
              ) : (
                recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <strong>{req.reference_code}</strong>
                    </td>
                    <td>
                      <div>{req.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{req.event_type}</div>
                    </td>
                    <td>
                      {req.event_date ? new Date(req.event_date).toLocaleDateString() : 'TBD'}
                    </td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Bookings */}
        <div className="admin-table-container">
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--admin-primary)' }}>
              Recent Bookings
            </h3>
            <Link to="/bookings" style={{ fontSize: '0.8rem', color: 'var(--admin-accent-hover)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    No bookings created yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.booking_reference}</strong>
                    </td>
                    <td>
                      <div>{b.customer_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{b.event_type}</div>
                    </td>
                    <td>
                      <strong>KSh {parseFloat(b.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </td>
                    <td>
                      <StatusBadge status={b.booking_status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
