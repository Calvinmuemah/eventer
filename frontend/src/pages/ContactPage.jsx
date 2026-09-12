import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { contactApi } from '../api/contactApi';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';
import { normalizeKenyanPhone, isValidKenyanPhone, KENYAN_PHONE_PLACEHOLDER } from '../utils/phone';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'A valid email address is required.';
    }
    if (formData.phone.trim() && !isValidKenyanPhone(formData.phone)) {
      errs.phone = 'Please enter a valid Kenyan phone number (e.g. 0712 345 678 or 0112 345 678).';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required.';
    if (!formData.message.trim() || formData.message.length < 5) {
      errs.message = 'Please provide a detailed message (at least 5 characters).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      setSubmitError(null);
      await contactApi.send({
        ...formData,
        phone: formData.phone.trim() ? normalizeKenyanPhone(formData.phone) : '',
      });
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to transmit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Contact Concierge | ${BRAND.name}`} 
        description="Connect with EVENTA event production coordinators for consultations, custom staging questions, and venue visits."
      />

      {/* Header Banner */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem',
        textAlign: 'center',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Direct Communication
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Speak With Our Production Concierge
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.82)',
            maxWidth: '580px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            Have an upcoming celebration or technical query? Our team is available to assist with inquiries, venue assessments, and customized staging briefs.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="section-padding">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            alignItems: 'start',
          }}>
            {/* Left: Contact Info */}
            <div>
              <span className="badge-eyebrow">Connect With Us</span>
              <h2 className="font-h2" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                We Are Here to Ensure Every Detail Is Addressed
              </h2>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: '2.5rem', fontSize: '0.975rem' }}>
                Whether you are in early exploratory phases or finalizing the run-of-show for a corporate summit, we welcome your conversation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(201, 162, 39, 0.12)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 600 }}>Phone Concierge</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                      {BRAND.contact.phoneFormatted}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(8, 26, 43, 0.08)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 600 }}>Email Inquiries</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                      {BRAND.contact.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(201, 162, 39, 0.12)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 600 }}>Studio & Pavilion Location</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-dark)', marginTop: '0.2rem', lineHeight: 1.5 }}>
                      {BRAND.contact.address}<br />
                      {BRAND.contact.city}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(8, 26, 43, 0.08)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-muted)', fontWeight: 600 }}>Operating Hours</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-dark)', marginTop: '0.2rem' }}>
                      {BRAND.contact.hours}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="card-luxury" style={{
              backgroundColor: '#FFFFFF',
              padding: 'clamp(2rem, 4vw, 3rem)',
              boxShadow: 'var(--shadow-xl)',
            }}>
              <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Send a Message
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginBottom: '2rem' }}>
                Complete the inquiry form below and our production desk will respond within 24 business hours.
              </p>

              {success && (
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success)',
                  color: 'var(--color-success)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <CheckCircle2 size={22} />
                  <span style={{ fontSize: '0.925rem' }}>
                    Thank you. Your message has been safely received. We will be in touch shortly.
                  </span>
                </div>
              )}

              {submitError && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                  color: 'var(--color-error)',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Marcus Aurelius"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-input"
                      placeholder="marcus@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-input"
                      placeholder={KENYAN_PHONE_PLACEHOLDER}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                      Enter 07... or 01... (+254 is added automatically)
                    </div>
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="e.g. Corporate Summit Audio & MC Consultation"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                  {errors.subject && <div className="form-error">{errors.subject}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea 
                    className="form-textarea"
                    rows="5"
                    placeholder="Provide event date, venue, expected scope, or specific technical staging questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                  {errors.message && <div className="form-error">{errors.message}</div>}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {submitting ? 'Transmitting Message...' : 'Send Message to Concierge'} <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
