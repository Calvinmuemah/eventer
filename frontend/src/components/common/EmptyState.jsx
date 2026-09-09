import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({ 
  title = 'No Records Found', 
  description = 'There are currently no items to display.',
  ctaText,
  ctaLink 
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 1.5rem',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-accent-subtle)',
        color: 'var(--color-accent)',
        marginBottom: '1.25rem',
      }}>
        <Sparkles size={24} />
      </div>
      <h4 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.4rem',
        color: 'var(--color-dark)',
        marginBottom: '0.5rem',
      }}>
        {title}
      </h4>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.925rem',
        color: 'var(--color-muted)',
        marginBottom: ctaText ? '1.5rem' : '0',
      }}>
        {description}
      </p>
      {ctaText && ctaLink && (
        <Link to={ctaLink} className="btn btn-primary btn-sm">
          {ctaText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
