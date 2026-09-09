import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      <MetaTags title={`Page Not Found | ${BRAND.name}`} />

      <div style={{ maxWidth: '520px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent-subtle)',
          color: 'var(--color-accent)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <Compass size={32} />
        </div>

        <div className="badge-eyebrow" style={{ color: 'var(--color-accent)' }}>
          404 Error
        </div>
        <h1 className="font-h1" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Page Not Located
        </h1>
        <p style={{
          color: 'var(--color-muted)',
          fontSize: '1rem',
          lineHeight: 1.6,
          marginBottom: '2rem',
        }}>
          The page or event record you requested could not be located. It may have been moved, updated, or does not exist.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
          <Link to="/services" className="btn btn-secondary">
            View Services Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
