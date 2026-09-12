import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  MessageSquare, 
  Phone, 
  Calendar, 
  MapPin, 
  Users 
} from 'lucide-react';
import { quotesApi } from '../api/quotesApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const QuotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Action States
  const [accepting, setAccepting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeNotes, setChangeNotes] = useState('');
  const [requestingChanges, setRequestingChanges] = useState(false);
  const [changeSubmitted, setChangeSubmitted] = useState(false);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await quotesApi.getById(id);
      setQuote(res.data);
    } catch (err) {
      setError(err.message || 'Quotation could not be located.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const handleAccept = async () => {
    try {
      setAccepting(true);
      setActionError(null);
      const res = await quotesApi.accept(id);
      const bookingId = res.data?.booking?.id;
      if (bookingId) {
        navigate(`/payment/${bookingId}`);
      } else {
        fetchQuote();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to accept quotation.');
    } finally {
      setAccepting(false);
    }
  };

  const handleRequestChanges = async (e) => {
    e.preventDefault();
    if (!changeNotes.trim()) return;
    try {
      setRequestingChanges(true);
      setActionError(null);
      await quotesApi.requestChanges(id, changeNotes.trim());
      setChangeSubmitted(true);
      setShowChangeModal(false);
      fetchQuote();
    } catch (err) {
      setActionError(err.message || 'Failed to submit change request.');
    } finally {
      setRequestingChanges(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <LoadingSpinner label="Loading quotation document..." />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <ErrorState 
          title="Quotation Not Found" 
          message={error || "The requested quotation record does not exist or has expired."} 
          onRetry={fetchQuote} 
        />
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'status-chip accepted';
      case 'sent': return 'status-chip pending';
      case 'change requested': return 'status-chip pending';
      case 'rejected': return 'status-chip rejected';
      default: return 'status-chip pending';
    }
  };

  return (
    <div className="quote-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Quotation ${quote.quote_number} | ${BRAND.name}`} 
        description="Review your customized event staging quotation, itemized services, and proceed to booking confirmation."
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
                Official Quotation
              </span>
              <h1 className="font-h2" style={{ color: '#FFFFFF', margin: '0.25rem 0 0.5rem' }}>
                Quotation #{quote.quote_number}
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
                Prepared for {quote.customer_name} • Request Ref: {quote.request_reference}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={getStatusClass(quote.status)}>
                {quote.status}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Quotation Paper */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        {actionError && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid var(--color-error)',
            color: 'var(--color-error)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}>
            {actionError}
          </div>
        )}

        {changeSubmitted && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success)',
            color: 'var(--color-success)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}>
            Your change request has been recorded. Our event coordinator will review your requested adjustments.
          </div>
        )}

        <div className="card-luxury" style={{
          backgroundColor: '#FFFFFF',
          padding: 'clamp(1.5rem, 4vw, 3.5rem)',
          boxShadow: 'var(--shadow-xl)',
        }}>
          {/* Top metadata grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2.5rem',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>Customer Details</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1.05rem' }}>{quote.customer_name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{quote.customer_email}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{quote.customer_phone}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>Event Type & Location</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1.05rem' }}>{quote.event_type}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{quote.event_location}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Estimated Guests: {quote.guest_count}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.25rem' }}>Date of Event</div>
              <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                {quote.event_date ? new Date(quote.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                Quote Valid Until: {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : '14 Days'}
              </div>
            </div>
          </div>

          {/* Itemized Services Table */}
          <div style={{ marginBottom: '3rem', overflowX: 'auto' }}>
            <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Itemized Service Schedule
            </h3>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.925rem',
            }}>
              <thead>
                <tr style={{
                  borderBottom: '2px solid var(--color-border)',
                  color: 'var(--color-muted)',
                  fontSize: '0.775rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  <th style={{ padding: '0.75rem 0' }}>Service & Description</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '0.75rem 0 0.75rem 1rem', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(quote.items || []).map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '1.25rem 0' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                        {item.service_name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', maxWidth: '520px' }}>
                        {item.description}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center', color: 'var(--color-dark)' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right', color: 'var(--color-dark)' }}>
                      KSh {parseFloat(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '1.25rem 0 1.25rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)' }}>
                      KSh {parseFloat(item.total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary Block */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem',
            borderTop: '2px solid var(--color-border)',
            paddingTop: '2rem',
          }}>
            <div style={{ maxWidth: '460px' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Quotation Notes & Terms
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {quote.notes || 'All equipment staging includes pre-event site coordination, setup, and dedicated professional operation throughout contracted hours.'}
              </p>
              {quote.change_request_notes && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.85rem',
                  color: 'var(--color-dark)',
                }}>
                  <strong>Requested Changes:</strong> {quote.change_request_notes}
                </div>
              )}
            </div>

            {/* Totals */}
            <div style={{
              width: '100%',
              maxWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>KSh {parseFloat(quote.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>Special Allowance / Discount</span>
                <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>-KSh {parseFloat(quote.discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.35rem',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '0.75rem',
                marginTop: '0.5rem',
                color: 'var(--color-primary)',
              }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Total (KSh)</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-accent)' }}>
                  KSh {parseFloat(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '2.5rem',
            marginTop: '3rem',
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {quote.status !== 'Accepted' && (
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="btn btn-secondary"
                  disabled={accepting}
                >
                  <MessageSquare size={16} /> Request Modifications
                </button>
              )}
              <Link to="/contact" className="btn btn-secondary">
                <Phone size={16} /> Speak With Us
              </Link>
            </div>

            {quote.status === 'Accepted' ? (
              <button
                onClick={handleAccept}
                className="btn btn-primary btn-lg"
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleAccept}
                className="btn btn-primary btn-lg"
                disabled={accepting}
              >
                {accepting ? 'Confirming...' : 'ACCEPT QUOTATION & BOOK'} <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Request Modal */}
      {showChangeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(8, 26, 43, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div className="card-luxury" style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Request Quotation Adjustments
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
              Let us know which services, equipment configurations, or hours you would like modified.
            </p>

            <form onSubmit={handleRequestChanges}>
              <div className="form-group">
                <label className="form-label">Notes on Desired Changes *</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="e.g. Please adjust MC hours from 4 to 6 hours, or add wireless lapel microphones..."
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="btn btn-secondary btn-sm"
                  disabled={requestingChanges}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={requestingChanges || !changeNotes.trim()}
                >
                  {requestingChanges ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotePage;
