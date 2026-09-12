import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  CheckSquare, 
  Square, 
  Sparkles, 
  FileText, 
  Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesApi } from '../api/servicesApi';
import { eventRequestsApi } from '../api/eventRequestsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';
import { normalizeKenyanPhone, isValidKenyanPhone, KENYAN_PHONE_PLACEHOLDER } from '../utils/phone';

const EVENT_TYPES = [
  'Wedding Reception',
  'Corporate Summit / Gala',
  'Private Birthday / Anniversary',
  'Graduation Celebration',
  'Cocktail & Dinner Reception',
  'Festival / Live Staging',
  'Other Custom Event',
];

const BUDGET_RANGES = [
  'Under KSh 50,000',
  'KSh 50,000 – KSh 150,000',
  'KSh 150,000 – KSh 350,000',
  'KSh 350,000 – KSh 750,000',
  'KSh 750,000+',
  'Flexible / Open to Consultation',
];

export const PlanEventPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    eventType: 'Wedding Reception',
    eventDate: '',
    eventLocation: '',
    guestCount: '',
    serviceIds: [],
    budgetRange: 'KSh 150,000 – KSh 350,000',
    additionalRequirements: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Prepopulate services and search param
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true);
        const res = await servicesApi.getAll();
        const data = res.data || [];
        setServices(data);

        const preselectServiceId = searchParams.get('service');
        if (preselectServiceId && data.some(s => s.id === preselectServiceId)) {
          setFormData(prev => ({
            ...prev,
            serviceIds: [preselectServiceId]
          }));
        }
      } catch (err) {
        console.error('Failed to load services for form:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    loadServices();
  }, [searchParams]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const toggleService = (id) => {
    setFormData(prev => {
      const exists = prev.serviceIds.includes(id);
      const updated = exists 
        ? prev.serviceIds.filter(sId => sId !== id)
        : [...prev.serviceIds, id];
      return { ...prev, serviceIds: updated };
    });
    if (errors.serviceIds) {
      setErrors(prev => ({ ...prev, serviceIds: null }));
    }
  };

  // Step Validations
  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'A valid email address is required.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'A valid contact phone number is required.';
    } else if (!isValidKenyanPhone(formData.phone)) {
      errs.phone = 'Please enter a valid Kenyan phone number (e.g. 0712 345 678 or 0112 345 678).';
    }
    if (!formData.eventType) errs.eventType = 'Please select an event type.';
    if (!formData.eventDate) errs.eventDate = 'Event date is required.';
    if (!formData.eventLocation.trim()) errs.eventLocation = 'Event venue or location is required.';
    
    const count = parseInt(formData.guestCount, 10);
    if (isNaN(count) || count <= 0) errs.guestCount = 'Enter estimated number of guests.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (formData.serviceIds.length === 0) {
      errs.serviceIds = 'Please select at least one service for your event.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: normalizeKenyanPhone(formData.phone),
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation.trim(),
        guestCount: parseInt(formData.guestCount, 10),
        serviceIds: formData.serviceIds,
        budgetRange: formData.budgetRange,
        additionalRequirements: formData.additionalRequirements.trim(),
        notes: formData.notes.trim(),
      };

      const res = await eventRequestsApi.create(payload);
      setSubmitSuccess(res.data);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Event Details' },
    { num: 2, title: 'Select Services' },
    { num: 3, title: 'Requirements' },
    { num: 4, title: 'Review & Submit' },
  ];

  return (
    <div className="plan-event-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title="Plan Your Event | Bespoke Event Production" 
        description="Submit your event specifications and select services to receive an itemized quotation from EVENTA."
      />

      {/* Hero Header */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '4.5rem 0 3.5rem',
        textAlign: 'center',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Curate Your Occasion
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Plan Your Event
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.82)',
            maxWidth: '580px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Complete our multi-step planner. Our production specialists will review your requirements and return a bespoke quotation.
          </p>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="container" style={{ marginTop: '-1.5rem' }}>
        {/* If successfully submitted */}
        {submitSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-luxury"
            style={{
              padding: '3.5rem 2.5rem',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}>
              <Check size={32} />
            </div>

            <span className="badge-eyebrow" style={{ color: 'var(--color-success)' }}>
              Request Successfully Received
            </span>
            <h2 className="font-h2" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Your Event Request Has Been Lodged
            </h2>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--color-muted)',
              maxWidth: '560px',
              margin: '0 auto 2rem',
              lineHeight: 1.65,
            }}>
              Thank you, <strong>{formData.fullName}</strong>. A provisional quotation has been prepared based on your selected staging requirements.
            </p>

            {/* Reference Badge */}
            <div style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xs)',
              marginBottom: '2.5rem',
            }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)' }}>
                Request Reference
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}>
                {submitSuccess.eventRequest?.reference_code || 'EVT-SUBMITTED'}
              </div>
            </div>

            {/* Direct CTA to view Quote */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {submitSuccess.quoteId && (
                <Link to={`/quote/${submitSuccess.quoteId}`} className="btn btn-primary btn-lg">
                  View Your Quotation Now <ArrowRight size={18} />
                </Link>
              )}
              <Link to="/" className="btn btn-secondary btn-lg">
                Return to Home
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="card-luxury" style={{
            backgroundColor: '#FFFFFF',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
          }}>
            {/* Step Progress Tracker */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-subtle)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}>
              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isPassed = currentStep > step.num;
                return (
                  <div
                    key={step.num}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      padding: '1.25rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      borderBottom: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                      color: isActive ? 'var(--color-primary)' : isPassed ? 'var(--color-muted)' : 'var(--color-muted-light)',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem',
                      background: isActive ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      backgroundColor: isPassed ? 'var(--color-accent)' : isActive ? 'var(--color-primary)' : 'var(--color-border)',
                      color: isPassed ? '#081A2B' : '#FFFFFF',
                    }}>
                      {isPassed ? <Check size={14} /> : step.num}
                    </div>
                    <span>{step.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Step Body */}
            <div style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem) clamp(0.75rem, 2vw, 2rem)' }}>
              {submitError && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                  color: 'var(--color-error)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '2rem',
                  fontSize: '0.9rem',
                }}>
                  {submitError}
                </div>
              )}

              {/* STEP 1: EVENT DETAILS */}
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    01. Event & Contact Details
                  </h3>
                  <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', fontSize: '0.925rem' }}>
                    Tell us where, when, and how you envision your gathering.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
                    gap: '1.25rem',
                  }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Eleanor Vance"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                      />
                      {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="eleanor@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />
                      {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        placeholder={KENYAN_PHONE_PLACEHOLDER}
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                        Enter 07... or 01... (+254 is added automatically)
                      </div>
                      {errors.phone && <div className="form-error">{errors.phone}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Event Type *</label>
                      <select 
                        className="form-select"
                        value={formData.eventType}
                        onChange={(e) => handleChange('eventType', e.target.value)}
                      >
                        {EVENT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.eventType && <div className="form-error">{errors.eventType}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Event Date *</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={formData.eventDate}
                        onChange={(e) => handleChange('eventDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.eventDate && <div className="form-error">{errors.eventDate}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Estimated Guest Count *</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="e.g. 150"
                        min="1"
                        value={formData.guestCount}
                        onChange={(e) => handleChange('guestCount', e.target.value)}
                      />
                      {errors.guestCount && <div className="form-error">{errors.guestCount}</div>}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Event Location / Venue Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. The Grand Botanical Pavilion, Downtown"
                      value={formData.eventLocation}
                      onChange={(e) => handleChange('eventLocation', e.target.value)}
                    />
                    {errors.eventLocation && <div className="form-error">{errors.eventLocation}</div>}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SELECT SERVICES */}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    02. Select Services
                  </h3>
                  <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', fontSize: '0.925rem' }}>
                    Choose one or multiple services. We will coordinate their seamless execution.
                  </p>

                  {errors.serviceIds && (
                    <div className="form-error" style={{ marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                      {errors.serviceIds}
                    </div>
                  )}

                  {loadingServices ? (
                    <LoadingSpinner label="Loading services..." />
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                      gap: '1.25rem',
                    }}>
                      {services.map((service) => {
                        const selected = formData.serviceIds.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            style={{
                              padding: '1.25rem',
                              border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                              backgroundColor: selected ? 'var(--color-champagne-light)' : '#FFFFFF',
                              borderRadius: 'var(--radius-xs)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.85rem',
                            }}
                          >
                            <div style={{
                              color: selected ? 'var(--color-accent)' : 'var(--color-muted-light)',
                              marginTop: '2px',
                            }}>
                              {selected ? <CheckSquare size={20} /> : <Square size={20} />}
                            </div>
                            <div>
                              <h4 style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '1.15rem',
                                color: 'var(--color-primary)',
                                marginBottom: '0.35rem',
                              }}>
                                {service.name}
                              </h4>
                              <p style={{
                                fontSize: '0.825rem',
                                color: 'var(--color-muted)',
                                lineHeight: 1.45,
                              }}>
                                {service.short_description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: EVENT REQUIREMENTS */}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    03. Event Requirements & Scope
                  </h3>
                  <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', fontSize: '0.925rem' }}>
                    Help us align on your expectations, technical constraints, and budget targets.
                  </p>

                  <div className="form-group">
                    <label className="form-label">Anticipated Budget Range</label>
                    <select 
                      className="form-select"
                      value={formData.budgetRange}
                      onChange={(e) => handleChange('budgetRange', e.target.value)}
                    >
                      {BUDGET_RANGES.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Technical Requirements or Specific Desires</label>
                    <textarea 
                      className="form-textarea"
                      rows="4"
                      placeholder="e.g. Wireless lapel microphones for 4 panelists, stage uplighting in warm gold, acoustic grand piano tuning..."
                      value={formData.additionalRequirements}
                      onChange={(e) => handleChange('additionalRequirements', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">General Notes / Questions for Our Production Team</label>
                    <textarea 
                      className="form-textarea"
                      rows="3"
                      placeholder="Any particular schedule constraints, venue load-in times, or special requests..."
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW & CONFIRM */}
              {currentStep === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    04. Review Your Event Specification
                  </h3>
                  <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', fontSize: '0.925rem' }}>
                    Verify your details before submitting. You will receive an immediate provisional quotation.
                  </p>

                  <div style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '1.75rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Contact Name</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formData.fullName}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Email</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formData.email}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Phone</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{normalizeKenyanPhone(formData.phone) || formData.phone}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Event Date</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formData.eventDate}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Location</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formData.eventLocation}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Guests & Type</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{formData.guestCount} guests • {formData.eventType}</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                        Selected Services
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {formData.serviceIds.map(id => {
                          const s = services.find(item => item.id === id);
                          return s ? (
                            <span 
                              key={id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.35rem 0.75rem',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid var(--color-accent)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                              }}
                            >
                              <Sparkles size={13} style={{ color: 'var(--color-accent)' }} />
                              {s.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {(formData.additionalRequirements || formData.notes) && (
                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.875rem' }}>
                        {formData.additionalRequirements && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Requirements: </span>
                            <span style={{ color: 'var(--color-muted)' }}>{formData.additionalRequirements}</span>
                          </div>
                        )}
                        {formData.notes && (
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Notes: </span>
                            <span style={{ color: 'var(--color-muted)' }}>{formData.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Navigation Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '1.75rem',
                marginTop: '2rem',
              }}>
                {currentStep > 1 ? (
                  <button 
                    type="button" 
                    onClick={handleBack} 
                    className="btn btn-secondary"
                    disabled={submitting}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div />}

                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    className="btn btn-primary"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSubmit} 
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting Request...' : 'SUBMIT EVENT REQUEST'} <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanEventPage;
