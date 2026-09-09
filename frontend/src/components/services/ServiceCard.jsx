import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ServiceCard = ({ service }) => {
  return (
    <motion.div 
      className="card-luxury"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Service Image */}
      <div style={{
        position: 'relative',
        height: '240px',
        overflow: 'hidden',
        backgroundColor: 'var(--color-primary)',
      }}>
        <img 
          src={service.image_url} 
          alt={service.name} 
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(8, 26, 43, 0.7) 0%, rgba(8, 26, 43, 0) 60%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1.25rem',
          right: '1.25rem',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.4rem',
            color: '#FFFFFF',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}>
            {service.name}
          </h3>
        </div>
      </div>

      {/* Service Content */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.925rem',
            color: 'var(--color-muted)',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
          }}>
            {service.short_description}
          </p>

          {/* Features snippet */}
          {Array.isArray(service.features) && service.features.length > 0 && (
            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}>
              {service.features.slice(0, 2).map((feat, idx) => (
                <li key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  fontSize: '0.825rem',
                  color: 'var(--color-dark)',
                }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--color-border-subtle)',
          paddingTop: '1rem',
          gap: '0.75rem',
        }}>
          <Link 
            to={`/services/${service.slug}`}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            View Details <ArrowRight size={14} />
          </Link>

          <Link
            to={`/plan-event?service=${service.id}`}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
          >
            Request Service
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
