import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Menu, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar = ({ onToggleSidebar, pendingAssistanceCount = 0 }) => {
  const { user, logout } = useAuth();

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button
          type="button"
          className="admin-mobile-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>
        <div className="admin-topbar-title">
          <span className="admin-topbar-brand">MC TITOE EVENTS & DESIGNS</span>
          <span className="admin-topbar-divider"> • </span>
          <span className="admin-topbar-sub">Operations Suite</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 1.2vw, 0.85rem)', flexShrink: 0 }}>
        {pendingAssistanceCount > 0 && (
          <Link
            to="/payment-assistance"
            className="admin-status-pill"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#EF4444',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
            title="Clients requiring payment assistance"
          >
            <AlertCircle size={14} color="#EF4444" />
            <span className="admin-status-text">{pendingAssistanceCount} Assistance Due</span>
          </Link>
        )}

        <div className="admin-status-pill">
          <ShieldCheck size={14} />
          <span className="admin-status-text">PostgreSQL Online</span>
        </div>

        <a
          href="http://localhost:5173/plan-event"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-outline admin-btn-sm admin-topbar-action"
          title="Open Client Planner"
        >
          <span className="admin-btn-label">Planner</span> <ExternalLink size={13} />
        </a>

        {/* Authenticated Admin Badge */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.6rem',
            backgroundColor: 'rgba(8, 26, 43, 0.05)',
            borderRadius: '6px',
            fontSize: '0.8rem',
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--admin-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }} className="admin-status-text">
              {user.fullName || user.email}
            </span>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="admin-btn admin-btn-outline admin-btn-sm"
          style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          title="Sign out of Operations"
        >
          <LogOut size={13} />
          <span className="admin-btn-label">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
