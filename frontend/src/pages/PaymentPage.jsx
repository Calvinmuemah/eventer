import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  Smartphone, 
  Building2, 
  ArrowRight, 
  AlertCircle,
  Clock,
  PhoneCall,
  Check,
  RotateCcw,
  X
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
  const [selectedMethod, setSelectedMethod] = useState('paystack_mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);

  // Safaricom M-Pesa regulatory limit (KSh 250,000 per transaction)
  const [mpesaAmountOption, setMpesaAmountOption] = useState('max_limit'); // 'max_limit' | 'custom'
  const [customMpesaAmount, setCustomMpesaAmount] = useState('250000');

  // Real-time Safaricom M-Pesa STK Push state
  const [stkModalOpen, setStkModalOpen] = useState(false);
  const [stkReference, setStkReference] = useState(null);
  const [stkAmount, setStkAmount] = useState(0);
  const [stkPhone, setStkPhone] = useState('');
  const [stkStatus, setStkStatus] = useState('waiting'); // 'waiting' | 'success' | 'failed' | 'timeout'
  const [stkMessage, setStkMessage] = useState('');
  const [stkCountdown, setStkCountdown] = useState(60);
  const [manualChecking, setManualChecking] = useState(false);

  // Sandbox simulation prompt fallback
  const [simulatedPromptOpen, setSimulatedPromptOpen] = useState(false);
  const [simulatedTimer, setSimulatedTimer] = useState(3);

  const [searchParams] = useSearchParams();
  const paymentReference = searchParams.get('reference') || searchParams.get('trxref');
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

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
        setMpesaPhone(res.data.customerPhone || '');
        setAssistanceData(prev => ({
          ...prev,
          name: res.data.customerName || '',
          email: res.data.customerEmail || '',
          phone: res.data.customerPhone || '',
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

  // Handle return from Paystack checkout redirect (auto-verification)
  useEffect(() => {
    if (paymentReference && id) {
      const verifyPaystackPayment = async () => {
        try {
          setVerifying(true);
          setPayError(null);
          const res = await paymentsApi.verify(id, { reference: paymentReference });
          if (res.success && (res.data?.status === 'success' || res.status === 'success')) {
            setVerificationSuccess(true);
            setTimeout(() => {
              navigate(`/booking-confirmation/${id}`, { replace: true });
            }, 1800);
          } else {
            setPayError(res.message || 'Payment was not approved.');
          }
        } catch (err) {
          setPayError(err.message || 'Payment verification could not be completed.');
        } finally {
          setVerifying(false);
        }
      };
      verifyPaystackPayment();
    }
  }, [paymentReference, id, navigate]);

  // Compute active M-Pesa payment amount
  const getActiveMpesaAmount = () => {
    if (!paymentData) return 0;
    const balance = paymentData.balance || 0;
    if (balance <= 250000) return balance;
    if (mpesaAmountOption === 'max_limit') return 250000;
    const parsed = parseFloat(customMpesaAmount);
    return isNaN(parsed) || parsed <= 0 ? 250000 : Math.min(parsed, 250000);
  };
  const activeMpesaAmount = getActiveMpesaAmount();

  // Real-time polling for Safaricom STK Push confirmation
  useEffect(() => {
    if (!stkModalOpen || !stkReference || stkStatus !== 'waiting') return;

    let timerInterval = null;
    let pollInterval = null;

    // 1. 60-second countdown
    timerInterval = setInterval(() => {
      setStkCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          clearInterval(pollInterval);
          setStkStatus('timeout');
          setStkMessage('The authorization prompt timed out. If you entered your PIN, click "Check Payment Status Now".');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Poll status every 3.5s
    let isPolling = false;
    pollInterval = setInterval(async () => {
      if (isPolling) return;
      isPolling = true;
      try {
        const res = await paymentsApi.verify(id, { reference: stkReference });
        if (res.success && (res.data?.status === 'success' || res.status === 'success')) {
          clearInterval(timerInterval);
          clearInterval(pollInterval);
          setStkStatus('success');
          setStkMessage('Payment verified! Preparing your confirmed booking pass...');
          setTimeout(() => {
            navigate(`/booking-confirmation/${id}`, { replace: true });
          }, 1800);
        } else if (res.data && !res.data.isPending && res.data.status !== 'success') {
          clearInterval(timerInterval);
          clearInterval(pollInterval);
          setStkStatus('failed');
          setStkMessage(res.data.message || 'Payment was cancelled or declined on your mobile device.');
        }
      } catch (err) {
        console.warn('[STK Polling check]', err.message);
      } finally {
        isPolling = false;
      }
    }, 3500);

    return () => {
      if (timerInterval) clearInterval(timerInterval);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [stkModalOpen, stkReference, stkStatus, id, navigate]);

  const openAssistanceWithReason = (methodName) => {
    setShowAssistance(true);
    setAssistanceData(prev => ({
      ...prev,
      name: paymentData?.customerName || prev.name || '',
      email: paymentData?.customerEmail || prev.email || '',
      phone: paymentData?.customerPhone || prev.phone || '',
      message: `Hello MC Titoe team, I need assistance on how to proceed with payment via ${methodName} for booking reference ${paymentData?.bookingReference || id}. Please guide me on payment instructions / wire details.`,
    }));
    setTimeout(() => {
      const el = document.getElementById('payment-assistance-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handlePay = async () => {
    try {
      setPayError(null);

      if (selectedMethod === 'paystack_mpesa' && !mpesaPhone.trim()) {
        setPayError('Please enter your Safaricom M-Pesa mobile phone number to receive the STK prompt.');
        return;
      }

      setPaying(true);

      const amountToPay = selectedMethod === 'paystack_mpesa' ? activeMpesaAmount : paymentData.balance;

      const res = await paymentsApi.initiate(id, {
        paymentMethod: selectedMethod,
        amount: amountToPay,
        phone: mpesaPhone ? normalizeKenyanPhone(mpesaPhone) : undefined,
      });

      // 1. Direct Safaricom M-Pesa STK Push
      if (res.data?.isDirectStkPush) {
        setPaying(false);
        setStkReference(res.data.reference);
        setStkAmount(res.data.amount || amountToPay);
        setStkPhone(res.data.phone || mpesaPhone);
        setStkStatus('waiting');
        setStkCountdown(60);
        setStkMessage('');
        setStkModalOpen(true);
        return;
      }

      // 2. Bank Card - redirect to live Paystack card page
      if (res.data?.authorizationUrl) {
        window.location.href = res.data.authorizationUrl;
        return;
      }

      // 3. Fallback Sandbox simulation
      if (selectedMethod === 'paystack_mpesa') {
        setPaying(false);
        setSimulatedPromptOpen(true);
        let countdown = 3;
        const interval = setInterval(() => {
          countdown -= 1;
          setSimulatedTimer(countdown);
          if (countdown <= 0) {
            clearInterval(interval);
            navigate(`/booking-confirmation/${id}`);
          }
        }, 1000);
        return;
      }

      navigate(`/booking-confirmation/${id}`);
    } catch (err) {
      setPayError(err.message || 'Payment attempt was not completed.');
      setPaying(false);
    }
  };

  const handleManualCheck = async () => {
    if (!stkReference) return;
    try {
      setManualChecking(true);
      const res = await paymentsApi.verify(id, { reference: stkReference });
      if (res.success && (res.data?.status === 'success' || res.status === 'success')) {
        setStkStatus('success');
        setStkMessage('Payment verified successfully!');
        setTimeout(() => {
          navigate(`/booking-confirmation/${id}`, { replace: true });
        }, 1500);
      } else if (res.data && !res.data.isPending && res.data.status !== 'success') {
        setStkStatus('failed');
        setStkMessage(res.data.message || 'Payment was cancelled or declined.');
      } else {
        setStkMessage('Still awaiting PIN entry on your mobile handset...');
      }
    } catch (err) {
      setStkMessage(err.message || 'Could not verify status yet.');
    } finally {
      setManualChecking(false);
    }
  };

  const handleRetryStk = () => {
    setStkModalOpen(false);
    setStkStatus('waiting');
    setStkReference(null);
    setTimeout(() => {
      handlePay();
    }, 100);
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

  if (verifying) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <LoadingSpinner label="Verifying payment authorization with Paystack... Please do not close or refresh this window." />
      </div>
    );
  }

  if (verificationSuccess) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          maxWidth: '540px',
          margin: '0 auto',
          padding: '3rem 2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
        }}>
          <CheckCircle2 size={54} style={{ color: 'var(--color-success)', margin: '0 auto 1.25rem' }} />
          <h2 className="font-h2" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            Payment Verified!
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your transaction has been confirmed by Paystack. Preparing your official booking pass...
          </p>
          <LoadingSpinner label="Redirecting to confirmation..." />
        </div>
      </div>
    );
  }

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
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <AlertCircle size={18} color="var(--color-error)" flexShrink={0} />
                <span>{payError}</span>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                  {[
                    { 
                      id: 'paystack_mpesa', 
                      label: 'M-Pesa / Mobile Money', 
                      icon: Smartphone, 
                      subtitle: 'Enter your phone number for real-time STK push PIN prompt',
                      hasAssistanceBtn: false,
                    },
                    { 
                      id: 'paystack_card', 
                      label: 'Pay via Bank Card', 
                      icon: CreditCard, 
                      subtitle: 'Visa, Mastercard, American Express with 256-bit SSL encryption',
                      hasAssistanceBtn: true,
                    },
                    { 
                      id: 'bank_transfer', 
                      label: 'Direct Bank Wire Transfer', 
                      icon: Building2, 
                      subtitle: 'Direct bank settlement, RTGS or invoice wire transfer',
                      hasAssistanceBtn: true,
                    },
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
                          justifyContent: 'space-between',
                          gap: '1rem',
                          transition: 'all 0.2s ease',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '220px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? 'var(--color-accent)' : 'rgba(8, 26, 43, 0.06)',
                            color: isSelected ? '#081A2B' : 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.98rem' }}>
                              {method.label}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                              {method.subtitle}
                            </div>
                          </div>
                        </div>

                        {/* Far end actions: Request Assistance button & radio */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {method.hasAssistanceBtn && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAssistanceWithReason(method.label);
                              }}
                              className="btn btn-secondary btn-xs"
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap',
                                borderRadius: '4px',
                                textTransform: 'none',
                                letterSpacing: 'normal',
                              }}
                              title="Click to request assistance with this payment method"
                            >
                              Request Assistance
                            </button>
                          )}
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: isSelected ? '5px solid var(--color-accent)' : '2px solid var(--color-border)',
                            backgroundColor: '#FFFFFF',
                            flexShrink: 0,
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Specific Method Prompt & Instructions */}
                {selectedMethod === 'paystack_mpesa' && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1.75rem',
                  }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Smartphone size={16} color="var(--color-accent)" /> M-Pesa Mobile Prompt Instructions
                    </h4>

                    {/* Safaricom Regulatory Limit Alert if Balance > 250,000 */}
                    {paymentData.balance > 250000 && (
                      <div style={{
                        padding: '0.9rem 1rem',
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        borderRadius: 'var(--radius-xs)',
                        marginBottom: '1rem',
                        fontSize: '0.825rem',
                        color: '#92400E',
                        lineHeight: 1.5,
                      }}>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', color: '#B45309' }}>
                          <AlertCircle size={15} /> Safaricom M-Pesa Regulatory Limit (KSh 250,000)
                        </div>
                        Safaricom limits single mobile money transfers to a legal maximum of <strong>KSh 250,000.00</strong>. Your balance is <strong>KSh {paymentData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.
                        
                        <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="mpesaInstallment"
                              checked={mpesaAmountOption === 'max_limit'}
                              onChange={() => setMpesaAmountOption('max_limit')}
                              style={{ marginTop: '2px' }}
                            />
                            <span>
                              <strong>Pay Maximum M-Pesa Installment: KSh 250,000.00</strong>
                              <br />
                              <span style={{ color: 'var(--color-muted)', fontSize: '0.775rem' }}>
                                Remaining balance: KSh {(paymentData.balance - 250000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} can be cleared in a subsequent installment.
                              </span>
                            </span>
                          </label>

                          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="mpesaInstallment"
                              checked={mpesaAmountOption === 'custom'}
                              onChange={() => setMpesaAmountOption('custom')}
                              style={{ marginTop: '2px' }}
                            />
                            <span>
                              <strong>Pay Custom Installment (up to KSh 250,000.00)</strong>
                            </span>
                          </label>

                          {mpesaAmountOption === 'custom' && (
                            <div style={{ marginLeft: '1.4rem', marginTop: '0.2rem' }}>
                              <input
                                type="number"
                                min="100"
                                max="250000"
                                step="100"
                                className="form-input"
                                style={{ maxWidth: '200px', padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                                value={customMpesaAmount}
                                onChange={(e) => setCustomMpesaAmount(e.target.value)}
                                placeholder="Amount in KSh"
                              />
                            </div>
                          )}
                        </div>

                        <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px dashed #FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.775rem', color: '#78350F' }}>Prefer paying the full balance in one transaction?</span>
                          <button
                            type="button"
                            onClick={() => setSelectedMethod('paystack_card')}
                            className="btn btn-secondary btn-xs"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                          >
                            Switch to Bank Card →
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem' }}>M-Pesa Mobile Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder={KENYAN_PHONE_PLACEHOLDER}
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                      />
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                        Enter your active Safaricom line (e.g. 07... or 01...).
                      </div>
                    </div>
                    <ol style={{ fontSize: '0.825rem', color: 'var(--color-dark)', paddingLeft: '1.2rem', lineHeight: 1.5, margin: 0 }}>
                      <li>Click the button below to initiate the STK push.</li>
                      <li>Check your phone screen for the prompt: <strong>Pay KSh {activeMpesaAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to MC TITOE EVENTS</strong>.</li>
                      <li>Enter your 4-digit M-Pesa secret PIN to authorize.</li>
                      <li>Upon confirmation, this page will automatically confirm your reservation.</li>
                    </ol>
                  </div>
                )}

                {selectedMethod === 'paystack_card' && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1.75rem',
                  }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CreditCard size={16} color="var(--color-accent)" /> Bank Card Payment Instructions
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--color-dark)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
                      You will be directed to the bank card checkout page. Enter your 16-digit card number, expiration date, and CVV. Your issuing bank may send a 3D-Secure One Time Password (OTP) via SMS to verify the transaction.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                      <span>Need bank wire instructions or assistance?</span>
                      <button
                        type="button"
                        onClick={() => openAssistanceWithReason('Pay via Bank Card')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-accent)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        Request Assistance Here
                      </button>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bank_transfer' && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '1.75rem',
                  }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building2 size={16} color="var(--color-accent)" /> Direct Bank Wire Instructions
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--color-dark)', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
                      For corporate wire settlement or manual bank deposit, click below to request official banking coordinates and invoice documentation from our accounts desk.
                    </p>
                    <button
                      type="button"
                      onClick={() => openAssistanceWithReason('Direct Bank Wire Transfer')}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%' }}
                    >
                      Request Bank Wire Details &amp; Invoice
                    </button>
                  </div>
                )}

                {/* Gateway Security Notice */}
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'rgba(22, 163, 74, 0.08)',
                  borderLeft: '4px solid #16A34A',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '1.75rem',
                  fontSize: '0.85rem',
                  color: '#14532D',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <ShieldCheck size={24} style={{ color: '#16A34A', flexShrink: 0 }} />
                  <div>
                    <strong>Bank-Grade Encrypted Gateway:</strong> Real-time checkout powered by Paystack. Supports instant Safaricom M-Pesa STK prompts, Visa, Mastercard &amp; direct bank cards.
                  </div>
                </div>

                {/* Main Pay Button */}
                {selectedMethod !== 'bank_transfer' && (
                  <button
                    onClick={handlePay}
                    className="btn btn-primary btn-lg"
                    disabled={paying}
                    style={{ width: '100%', marginBottom: '1.5rem' }}
                  >
                    {paying 
                      ? 'Connecting to Payment Gateway...' 
                      : selectedMethod === 'paystack_mpesa'
                        ? `PAY VIA M-PESA (KSh ${activeMpesaAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                        : `PAY VIA BANK CARD (KSh ${paymentData.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                    }
                  </button>
                )}
              </>
            )}

            {/* Assistance Section / Modal Anchor */}
            <div id="payment-assistance-section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
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
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <HelpCircle size={15} /> Need Help or Alternate Payment Arrangement?
                </button>
              </div>

              {/* Assistance Form */}
              {showAssistance && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1.5rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  border: '1.5px solid var(--color-accent)',
                  borderRadius: 'var(--radius-xs)',
                }}>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                    Concierge Payment Assistance
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-muted)', marginBottom: '1.25rem' }}>
                    Submit your request and MC Titoe operations team will receive an urgent email notification to assist you with Bank Card, Wire, or custom arrangements.
                  </p>

                  {assistanceSuccess ? (
                    <div style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--color-success-bg)',
                      border: '1px solid var(--color-success)',
                      color: 'var(--color-success)',
                      fontSize: '0.9rem',
                      borderRadius: 'var(--radius-xs)',
                      lineHeight: 1.5,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        <CheckCircle2 size={18} /> Request Submitted Successfully!
                      </div>
                      Our concierge desk and MC Titoe have been notified via email. We will reach out to you promptly at <strong>{assistanceData.phone}</strong>.
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
                        {assistanceSubmitting ? 'Dispatching Notification...' : 'Submit Assistance Request'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
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

      {/* Real-time Safaricom M-Pesa STK Push Modal */}
      {stkModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(8, 26, 43, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '2.25rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
          }}>
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setStkModalOpen(false);
                setPaying(false);
              }}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-muted)',
                padding: '0.25rem',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* WAITING STATE */}
            {stkStatus === 'waiting' && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  position: 'relative',
                }}>
                  <Smartphone size={32} />
                </div>

                <span className="badge-eyebrow" style={{ color: '#16A34A', marginBottom: '0.25rem' }}>
                  Live Safaricom Prompt Dispatched
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-primary)', margin: '0.25rem 0 0.5rem' }}>
                  M-Pesa STK Prompt Sent!
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-dark)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  A prompt has been sent to your Safaricom mobile phone:
                  <br />
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{stkPhone}</strong>
                </p>

                <div style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-surface-subtle)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  marginBottom: '1.25rem',
                  textAlign: 'left',
                  fontSize: '0.825rem',
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                    Quick Instructions:
                  </div>
                  <ol style={{ paddingLeft: '1.1rem', margin: 0, lineHeight: 1.6 }}>
                    <li>Unlock your phone screen now.</li>
                    <li>Check the popup: <strong>Pay KSh {stkAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to MC TITOE EVENTS</strong>.</li>
                    <li>Enter your secret 4-digit M-Pesa PIN and tap OK.</li>
                  </ol>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'rgba(217, 119, 6, 0.1)',
                  color: '#B45309',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                }}>
                  <Clock size={14} /> Awaiting authorization... {stkCountdown}s
                </div>

                {stkMessage && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                    {stkMessage}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={handleManualCheck}
                    className="btn btn-secondary btn-sm"
                    disabled={manualChecking}
                    style={{ width: '100%' }}
                  >
                    {manualChecking ? 'Checking status...' : 'I Entered My PIN — Check Status'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStkModalOpen(false);
                      setPaying(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: '0.3rem',
                    }}
                  >
                    Cancel / Change Phone Number
                  </button>
                </div>
              </>
            )}

            {/* SUCCESS STATE */}
            {stkStatus === 'success' && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <CheckCircle2 size={36} />
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Payment Verified!
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Your payment of <strong>KSh {stkAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> has been received and confirmed.
                </p>
                <LoadingSpinner label="Redirecting to your booking confirmation..." />
              </>
            )}

            {/* FAILED STATE */}
            {stkStatus === 'failed' && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-error-bg)',
                  color: 'var(--color-error)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <AlertCircle size={36} />
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Authorization Not Completed
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {stkMessage || 'The M-Pesa prompt was cancelled or not confirmed on your handset.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={handleRetryStk}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <RotateCcw size={14} /> Send STK Prompt Again
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStkModalOpen(false);
                      setSelectedMethod('paystack_card');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    Pay via Bank Card Instead
                  </button>

                  <button
                    type="button"
                    onClick={() => setStkModalOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: '0.3rem',
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* TIMEOUT STATE */}
            {stkStatus === 'timeout' && (
              <>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}>
                  <Clock size={36} />
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                  Awaiting Confirmation
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {stkMessage || 'If you already entered your PIN on your phone, click below to check status. Otherwise, you can resend the prompt.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={handleManualCheck}
                    className="btn btn-primary btn-sm"
                    disabled={manualChecking}
                    style={{ width: '100%' }}
                  >
                    {manualChecking ? 'Checking...' : 'Check Payment Status Now'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRetryStk}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <RotateCcw size={14} /> Resend M-Pesa Prompt
                  </button>

                  <button
                    type="button"
                    onClick={() => setStkModalOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      padding: '0.3rem',
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Simulated M-Pesa Prompt Modal (when testing in dev simulation mode) */}
      {simulatedPromptOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(8, 26, 43, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}>
              <Smartphone size={28} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              M-Pesa STK Prompt Sent!
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Check your mobile phone (<strong>{mpesaPhone}</strong>) for the Safaricom STK prompt for <strong>KSh {activeMpesaAmount.toLocaleString()}</strong> to <strong>MC TITOE EVENTS</strong>.
            </p>
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: 'var(--color-dark)',
              marginBottom: '1.25rem',
            }}>
              <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Simulated development response confirming in {simulatedTimer}s...
            </div>
            <LoadingSpinner label="Awaiting M-Pesa PIN confirmation..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
