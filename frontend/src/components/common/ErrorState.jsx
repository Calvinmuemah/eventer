import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorState = ({ 
  title = 'Service Notice', 
  message = 'We encountered an unexpected error while retrieving your request.', 
  onRetry 
}) => {
  return (
    <div style={{
      maxWidth: '520px',
      margin: '3rem auto',
      padding: '2.5rem 2rem',
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--color-border)',
      borderTop: '3px solid var(--color-error)',
      borderRadius: 'var(--radius-xs)',
      textAlign: 'center',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-error-bg)',
        color: 'var(--color-error)',
        marginBottom: '1rem',
      }}>
        <AlertCircle size={26} />
      </div>
      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.4rem',
        marginBottom: '0.5rem',
        color: 'var(--color-dark)',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.925rem',
        color: 'var(--color-muted)',
        marginBottom: '1.5rem',
        lineHeight: 1.55,
      }}>
        {message}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.4rem' }}
        >
          <RotateCcw size={14} /> Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
