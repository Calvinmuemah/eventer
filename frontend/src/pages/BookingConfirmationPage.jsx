import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Calendar, MapPin, Sparkles, Phone, ArrowRight, FileCheck } from 'lucide-react';
import { bookingsApi } from '../api/bookingsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const BookingConfirmationPage = () => {
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
      setError(err.message || 'Could not load confirmation details.');
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
        <LoadingSpinner label="Validating reservation pass..." />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <ErrorState 
          title="Confirmation Unavailable" 
          message={error || "Could not locate this booking record."} 
          onRetry={fetchBooking} 
        />
      </div>
    );
  }

  return (
    <div className="booking-confirmation-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Confirmed: ${booking.booking_reference} | ${BRAND.name}`} 
        description={`Your event staging has been officially confirmed by ${BRAND.name}.`}
      />

      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem',
        textAlign: 'center',
      }}>
        <div className="container-narrow">
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: 'rgba(201, 162, 39, 0.18)',
            border: '2px solid var(--color-accent)',
            color: 'var(--color-accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}>
            <Check size={36} />
          </div>

          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Reservation Locked
          </span>
          <h1 className="font-display" style={{ color: '#FFFFFF', marginBottom: '1rem', fontWeight: 600 }}>
            Your Event Is Officially On.
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            We have confirmed your production reservation. Our technical coordinators are preparing run-of-show logistics for your celebration.
          </p>
        </div>
      </section>

      {/* Confirmation Pass Card */}
      <div className="container-narrow" style={{ marginTop: '-2rem' }}>
        <div className="card-luxury" style={{
          backgroundColor: '#FFFFFF',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          boxShadow: 'var(--shadow-xl)',
        }}>
          {/* Reference Banner */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2rem',
            gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Booking Reference</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {booking.booking_reference}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className={`status-chip ${booking.payment_status.toLowerCase().replace(' ', '-')}`}>
                {booking.payment_status}
              </span>
              <span className="status-chip confirmed">
                {booking.booking_status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.75rem',
            marginBottom: '2.5rem',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.3rem' }}>Host / Customer</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{booking.customer_name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{booking.customer_email}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.3rem' }}>Event Category</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{booking.event_type}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{booking.guest_count} Estimated Guests</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.3rem' }}>Event Date</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                {booking.event_date ? new Date(booking.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.3rem' }}>Venue Location</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{booking.event_location}</div>
            </div>
          </div>

          {/* Confirmed Services */}
          <div style={{
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xs)',
            padding: '1.5rem',
            marginBottom: '2.5rem',
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Confirmed Services Schedule
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {(booking.services || []).map((service, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                  }}
                >
                  <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
                  {service.service_name}
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
          }}>
            <Link to={`/booking/${booking.id}`} className="btn btn-secondary btn-lg">
              <FileCheck size={18} /> View Booking Ledger
            </Link>
            <Link to="/contact" className="btn btn-primary btn-lg">
              <Phone size={18} /> Contact Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
