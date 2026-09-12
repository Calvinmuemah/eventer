import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { servicesApi } from '../api/servicesApi';
import ServiceCard from '../components/services/ServiceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await servicesApi.getAll();
      setServices(res.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <MetaTags 
        title="Event Services & Production Catalogue" 
        description="Explore our specialized services: Master of Ceremonies, PA sound systems, musical backline, event planning, and atmospheric lighting."
      />

      {/* Header Banner */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Service Catalogue
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Elevate Every Element of Your Occasion
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            From charismatic hosting to concert-grade acoustics and immersive lighting, discover our core disciplines designed to work in perfect synchronization.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container">
          {loading ? (
            <LoadingSpinner label="Fetching service catalogue..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchServices} />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: '2.5rem',
            }}>
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {/* Bottom Custom Consultation Strip */}
          <div style={{
            marginTop: '5rem',
            padding: '3rem 2.5rem',
            backgroundColor: 'var(--color-surface-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}>
            <div>
              <span className="badge-eyebrow">Custom Coordination</span>
              <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Need a tailored combination or custom technical staging?
              </h3>
              <p style={{ color: 'var(--color-muted)', maxWidth: '600px', fontSize: '0.95rem' }}>
                Our team can bundle services into a cohesive package engineered specifically around your venue specifications and event run-of-show.
              </p>
            </div>
            <Link to="/plan-event" className="btn btn-primary btn-lg">
              Plan Your Custom Event <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
