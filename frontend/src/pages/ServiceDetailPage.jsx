import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { servicesApi } from '../api/servicesApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const ServiceDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await servicesApi.getBySlug(slug);
      setService(res.data);
    } catch (err) {
      setError(err.message || 'Service details could not be found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <LoadingSpinner label="Loading service details..." />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container" style={{ padding: '6rem 0' }}>
        <ErrorState 
          title="Service Not Found" 
          message={error || "The requested service could not be located."} 
          onRetry={fetchService} 
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/services" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to All Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      <MetaTags 
        title={`${service.name} | ${BRAND.name}`} 
        description={service.short_description}
      />

      {/* Breadcrumb & Navigation Header */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '3.5rem 0 3rem',
      }}>
        <div className="container">
          <Link 
            to="/services" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-champagne)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={14} /> Back to Services
          </Link>

          <div style={{ maxWidth: '780px' }}>
            <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
              Service Spotlight
            </span>
            <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
              {service.name}
            </h1>
            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.6,
            }}>
              {service.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section-padding">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
          }}>
            {/* Left Image and Media */}
            <div>
              <div style={{
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                marginBottom: '2rem',
                backgroundColor: 'var(--color-primary)',
              }}>
                <img 
                  src={service.image_url} 
                  alt={service.name}
                  style={{ width: '100%', height: '440px', objectFit: 'cover' }}
                />
              </div>

              {/* Service Assurance Card */}
              <div style={{
                padding: '1.75rem',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xs)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={22} style={{ color: 'var(--color-accent)' }} />
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-primary)' }}>
                    {BRAND.name} Assurance
                  </h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  Every service booking includes pre-event site coordination, rigorous technical sound checks, and on-site professional staffing throughout your event duration.
                </p>
              </div>
            </div>

            {/* Right Detailed Descriptions */}
            <div>
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  Overview & Philosophy
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--color-dark)',
                  lineHeight: 1.8,
                  marginBottom: '1.5rem',
                }}>
                  {service.description}
                </p>
              </div>

              {/* What is included */}
              {Array.isArray(service.features) && service.features.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                    What Is Included
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {service.features.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xs)',
                      }}>
                        <CheckCircle2 size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.925rem', color: 'var(--color-dark)', fontWeight: 500 }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Box */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-lg)',
              }}>
                <div className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
                  Tailored To Your Event
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  Ready to reserve this service?
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Include this service in your event plan. Our concierge team will review your specifications and generate an itemized quotation.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate(`/plan-event?service=${service.id}`)}
                    className="btn btn-primary btn-lg"
                  >
                    Request This Service <ArrowRight size={16} />
                  </button>
                  <Link to="/contact" className="btn btn-outline-gold btn-lg">
                    Speak With Concierge
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
