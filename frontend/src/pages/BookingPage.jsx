import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  ArrowRight, 
  Phone, 
  CheckCircle, 
  Clock, 
  FileText 
} from 'lucide-react';
import { bookingsApi } from '../api/bookingsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await bookingsApi.getById(id);
      setBooking(res.data);
    } catch (err) {
      setError(err.message || 'Booking details could not be found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <LoadingSpinner label="Retrieving booking ledger..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <ErrorState 
          title="Booking Not Found" 
          message={error || "The requested booking could not be located."} 
          onRetry={fetchBooking} 
        />
      </div>
    );
  }

  const isFullyPaid = parseFloat(booking.balance) <= 0 || booking.payment_status === 'Paid';

  return (
    <div className="booking-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Booking ${booking.booking_reference} | ${BRAND.name}`} 
        description="View your reserved event staging booking, payment status, and confirmed service schedules."
      />

      {/* Header Banner */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '3.5rem 0 2.5rem',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <div>
              <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
                Event Reservation
              </span>
              <h1 className="font-h2" style={{ color: '#FFFFFF', margin: '0.25rem 0 0.5rem' }}>
                Booking Ref: {booking.booking_reference}
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                {booking.event_type} • Prepared for {booking.customer_name}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span className={`status-chip ${booking.payment_status.toLowerCase().replace(' ', '-')}`}>
                Payment: {booking.payment_status}
              </span>
              <span className={`status-chip ${booking.booking_status.toLowerCase()}`}>
                Status: {booking.booking_status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Details Container */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Main Info */}
          <div className="card-luxury" style={{
            backgroundColor: '#FFFFFF',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              Reserved Event Schedule
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '2rem',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Date of Event</div>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                  {booking.event_date ? new Date(booking.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Venue / Location</div>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                  {booking.event_location}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Guest Attendance</div>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                  {booking.guest_count} Estimated Guests
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Quote Reference</div>
                <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                  {booking.quote_number}
                </div>
              </div>
            </div>

            {/* Services List */}
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Contracted Staging Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {(booking.services || []).map((service, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{service.service_name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>${parseFloat(service.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Payment history if any */}
            {booking.payments && booking.payments.length > 0 && (
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  Payment Records
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {booking.payments.map((p, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xs)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem',
                      }}
                    >
                      <div>
                        <strong>{p.transaction_reference}</strong> ({p.payment_method?.toUpperCase()})
                        <div style={{ fontSize: '0.775rem', color: 'var(--color-muted)' }}>
                          {new Date(p.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>+${parseFloat(p.amount).toFixed(2)}</span>
                        <div style={{ fontSize: '0.775rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                          {p.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment & Action Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card-luxury" style={{
              backgroundColor: '#FFFFFF',
              padding: '2rem',
              boxShadow: 'var(--shadow-xl)',
            }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                Payment Summary
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Total Contract Amount</span>
                  <span style={{ fontWeight: 600 }}>${parseFloat(booking.total_amount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted)' }}>Amount Settled</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>${parseFloat(booking.amount_paid).toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '0.75rem',
                  fontSize: '1.15rem',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                }}>
                  <span>Remaining Balance</span>
                  <span style={{ color: isFullyPaid ? 'var(--color-success)' : 'var(--color-accent)' }}>
                    ${parseFloat(booking.balance).toFixed(2)}
                  </span>
                </div>
              </div>

              {!isFullyPaid ? (
                <Link to={`/payment/${booking.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  <CreditCard size={18} /> Settle Payment (${parseFloat(booking.balance).toFixed(2)})
                </Link>
              ) : (
                <Link to={`/booking-confirmation/${booking.id}`} className="btn btn-navy" style={{ width: '100%' }}>
                  <CheckCircle size={18} /> View Confirmation Pass
                </Link>
              )}
            </div>

            {/* Assistance Card */}
            <div style={{
              padding: '1.75rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
            }}>
              <h5 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Need Assistance or Schedule Adjustments?
              </h5>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                Our production management team is available to assist with invoicing, custom payment arrangements, or technical adjustments.
              </p>
              <Link to="/contact" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                <Phone size={14} /> Contact Dedicated Coordinator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
