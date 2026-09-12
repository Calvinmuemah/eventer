import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Smartphone, 
  Building2, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { paymentsApi } from '../api/paymentsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';
import { normalizeKenyanPhone, KENYAN_PHONE_PLACEHOLDER } from '../utils/phone';

export const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Payment state
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);

  // Assistance modal/form
  const [showAssistance, setShowAssistance] = useState(false);
  const [assistanceData, setAssistanceData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [assistanceSubmitting, setAssistanceSubmitting] = useState(false);
  const [assistanceSuccess, setAssistanceSuccess] = useState(false);
  const [assistanceError, setAssistanceError] = useState(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await paymentsApi.getDetails(id);
      setPaymentData(res.data);
      if (res.data) {
        setAssistanceData(prev => ({
          ...prev,
          name: res.data.customerName || '',
          email: res.data.customerEmail || '',
        }));
      }
    } catch (err) {
      setError(err.message || 'Payment information could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handlePay = async () => {
    try {
      setPaying(true);
      setPayError(null);
      const res = await paymentsApi.initiate(id, {
        paymentMethod: selectedMethod,
        amount: paymentData.balance,
      });

      // Navigate to confirmation page
      navigate(`/booking-confirmation/${id}`);
    } catch (err) {
      setPayError(err.message || 'Payment attempt was not completed.');
    } finally {
      setPaying(false);
    }
  };

  const handleAssistanceSubmit = async (e) => {
    e.preventDefault();
    if (!assistanceData.name || !assistanceData.phone || !assistanceData.message) return;
    try {
      setAssistanceSubmitting(true);
      setAssistanceError(null);
      await paymentsApi.requestAssistance({
        ...assistanceData,
        phone: normalizeKenyanPhone(assistanceData.phone),
        bookingReference: paymentData?.bookingReference || id,
      });
      setAssistanceSuccess(true);
    } catch (err) {
      setAssistanceError(err.message || 'Could not submit assistance request.');
    } finally {
      setAssistanceSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <LoadingSpinner label="Securing payment gateway..." />
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <ErrorState 
          title="Payment Record Unavailable" 
          message={error || "Payment details could not be found for this booking."} 
          onRetry={fetchDetails} 
        />
      </div>
    );
  }

  const isFullyPaid = paymentData.balance <= 0 || paymentData.paymentStatus === 'Paid';

  return (
    <div className="payment-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Payment for ${paymentData.bookingReference} | ${BRAND.name}`} 
        description="Secure checkout and payment gateway for your reserved event services."
      />

      {/* Header Banner */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '3.5rem 0 2.5rem',
      }}>
        <div className="container">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Secure Checkout
          </span>
          <h1 className="font-h2" style={{ color: '#FFFFFF', margin: '0.25rem 0 0.5rem' }}>
            Event Service Payment
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9rem' }}>
            Booking Reference: <strong>{paymentData.bookingReference}</strong> • {paymentData.eventType}
          </p>
        </div>
      </section>

      {/* Main Payment Grid */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '2.5rem',
          alignItems: 'start',
        }}>
          {/* Left: Payment Options & Simulation */}
          <div className="card-luxury" style={{
            backgroundColor: '#FFFFFF',
            padding: 'clamp(1.25rem, 3vw, 2.5rem)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Select Payment Method
            </h3>

            {payError && (
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--color-error-bg)',
                border: '1px solid var(--color-error)',
                color: 'var(--color-error)',
                borderRadius: 'var(--radius-xs)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}>
                {payError}
              </div>
            )}

            {isFullyPaid ? (
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--color-success-bg)',
                border: '1px solid var(--color-success)',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}>
                <CheckCircle2 size={36} style={{ color: 'var(--color-success)', margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                  Booking Is Fully Settled
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-dark)', marginBottom: '1.5rem' }}>
                  No outstanding balance remains for this reservation.
                </p>
                <Link to={`/booking-confirmation/${id}`} className="btn btn-primary btn-sm">
                  View Official Confirmation Pass <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                {/* Payment Methods Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { id: 'card', label: 'Credit / Debit Card (Visa, Mastercard, Amex)', icon: CreditCard, subtitle: 'Instant online authorization' },
                    { id: 'mobile_money', label: 'M-Pesa / Mobile Money', icon: Smartphone, subtitle: 'Direct mobile prompt or manual paybill' },
                    { id: 'bank_transfer', label: 'Direct Bank Wire Transfer', icon: Building2, subtitle: 'Corporate wire & bank receipt verification' },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        style={{
                          padding: '1.25rem',
                          border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-champagne-light)' : '#FFFFFF',
                          borderRadius: 'var(--radius-xs)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '4px',
                          backgroundColor: isSelected ? 'var(--color-accent)' : 'rgba(8, 26, 43, 0.06)',
                          color: isSelected ? '#081A2B' : 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                            {method.label}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                            {method.subtitle}
                          </div>
                        </div>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid var(--color-accent)' : '2px solid var(--color-border)',
                          backgroundColor: '#FFFFFF',
                        }} />
                      </div>
                    );
                  })}
                </div>

                {/* Development / Sandbox Notice */}
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderLeft: '4px solid var(--color-accent)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '2rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-dark)',
                  lineHeight: 1.5,
                }}>
                  <strong>Development Gateway Simulation:</strong> Live payment provider credentials (e.g. Stripe, M-Pesa Daraja) are not yet mounted. Submitting will simulate a verified sandbox transaction to confirm the booking in your ledger.
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePay}
                  className="btn btn-primary btn-lg"
                  disabled={paying}
                  style={{ width: '100%', marginBottom: '1.25rem' }}
                >
                  {paying ? 'Processing Authorization...' : `PAY NOW (KSh ${paymentData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
                </button>
              </>
            )}

            {/* Assistance Trigger */}
            <div style={{ textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAssistance(!showAssistance)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--color-muted)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <HelpCircle size={15} /> Need Help With Payment?
              </button>
            </div>

            {/* Assistance Form Reveal */}
            {showAssistance && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
              }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Concierge Payment Assistance
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                  If you require an alternate wire routing, split payment, or need our team to assist with corporate procurement:
                </p>

                {assistanceSuccess ? (
                  <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--color-success-bg)',
                    color: 'var(--color-success)',
                    fontSize: '0.875rem',
                    borderRadius: 'var(--radius-xs)',
                  }}>
                    Your assistance request has been submitted. Our concierge will contact you promptly at {assistanceData.phone}.
                  </div>
                ) : (
                  <form onSubmit={handleAssistanceSubmit}>
                    {assistanceError && (
                      <div className="form-error" style={{ marginBottom: '0.75rem' }}>{assistanceError}</div>
                    )}
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Name *</label>
                      <input 
                        type="text" 
                        className="form-input"
                        value={assistanceData.name}
                        onChange={(e) => setAssistanceData({ ...assistanceData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Phone Number *</label>
                      <input 
                        type="tel" 
                        className="form-input"
                        placeholder={KENYAN_PHONE_PLACEHOLDER}
                        value={assistanceData.phone}
                        onChange={(e) => setAssistanceData({ ...assistanceData, phone: e.target.value })}
                        required
                      />
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                        Enter 07... or 01... (+254 is added automatically)
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>Email Address *</label>
                      <input 
                        type="email" 
                        className="form-input"
                        value={assistanceData.email}
                        onChange={(e) => setAssistanceData({ ...assistanceData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>How can we assist? *</label>
                      <textarea 
                        className="form-textarea"
                        rows="3"
                        placeholder="e.g. Please issue an invoice with vendor Tax ID, or send M-Pesa manual paybill instructions..."
                        value={assistanceData.message}
                        onChange={(e) => setAssistanceData({ ...assistanceData, message: e.target.value })}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-secondary btn-sm"
                      disabled={assistanceSubmitting}
                      style={{ width: '100%' }}
                    >
                      {assistanceSubmitting ? 'Sending Request...' : 'Submit Assistance Request'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="card-luxury" style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Booking Summary
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>Customer</span>
                <span style={{ fontWeight: 600 }}>{paymentData.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>Event Type</span>
                <span style={{ fontWeight: 600 }}>{paymentData.eventType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>Date</span>
                <span style={{ fontWeight: 600 }}>
                  {paymentData.eventDate ? new Date(paymentData.eventDate).toLocaleDateString() : 'TBD'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-muted)' }}>Location</span>
                <span style={{ fontWeight: 600 }}>{paymentData.eventLocation}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                Services Reserved
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(paymentData.services || []).map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>{s.service_name}</span>
                    <span style={{ fontWeight: 500 }}>KSh {parseFloat(s.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              borderTop: '2px solid var(--color-border)',
              paddingTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>Total Amount</span>
                <span style={{ fontWeight: 600 }}>KSh {paymentData.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>Amount Paid</span>
                <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>KSh {paymentData.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '0.75rem',
                marginTop: '0.5rem',
              }}>
                <span style={{ fontFamily: 'var(--font-serif)' }}>Balance Due</span>
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-accent)' }}>
                  KSh {paymentData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
