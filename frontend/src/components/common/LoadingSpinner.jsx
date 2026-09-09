import React from 'react';

export const LoadingSpinner = ({ label = 'Curating experience...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      gap: '1.25rem',
      minHeight: '220px'
    }}>
      <div style={{
        position: 'relative',
        width: '48px',
        height: '48px',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          border: '3px solid rgba(201, 162, 39, 0.18)',
          borderTopColor: 'var(--color-accent)',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }} />
      </div>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.9rem',
        color: 'var(--color-muted)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {label}
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
