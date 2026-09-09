import React from 'react';
import { Menu, ShieldCheck, ExternalLink } from 'lucide-react';

export const Topbar = ({ onToggleSidebar }) => {
  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
          aria-label="Toggle Navigation"
        >
          <Menu size={22} color="#0F172A" />
        </button>
        <div style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
          EVENTA Management Suite
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#166534',
          backgroundColor: '#DCFCE7',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
        }}>
          <ShieldCheck size={14} />
          <span>PostgreSQL Online</span>
        </div>

        <a
          href="http://localhost:5173/plan-event"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn-primary admin-btn-sm"
        >
          Test Planner <ExternalLink size={13} />
        </a>
      </div>
    </header>
  );
};

export default Topbar;
