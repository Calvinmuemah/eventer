import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLandingPage from '../../pages/AdminLandingPage';
import { Sparkles } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#081A2B',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          border: '2px solid var(--admin-accent)',
          color: 'var(--admin-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.5s infinite',
        }}>
          <Sparkles size={24} />
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--admin-champagne)', fontWeight: 600 }}>
          Verifying MC Titoe Security Credentials...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLandingPage />;
  }

  return children;
};

export default ProtectedRoute;
