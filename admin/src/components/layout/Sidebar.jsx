import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  CalendarCheck, 
  FileText, 
  BookmarkCheck, 
  CreditCard, 
  HelpCircle, 
  Mail, 
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, pendingAssistanceCount = 0 }) => {
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/services', label: 'Services Catalogue', icon: Layers },
    { to: '/event-requests', label: 'Event Requests', icon: CalendarCheck },
    { to: '/quotes', label: 'Quotations', icon: FileText },
    { to: '/bookings', label: 'Bookings Ledger', icon: BookmarkCheck },
    { to: '/payments', label: 'Payments', icon: CreditCard },
    { to: '/payment-assistance', label: 'Payment Assistance', icon: HelpCircle, badge: pendingAssistanceCount },
    { to: '/messages', label: 'Client Messages', icon: Mail },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            border: '1.5px solid var(--admin-accent)',
            color: 'var(--admin-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              lineHeight: 1.1,
            }}>
              MC TITOE
            </div>
            <div style={{
              fontSize: '0.58rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--admin-accent)',
              marginTop: '2px',
              fontWeight: 700,
            }}>
              EVENTS & DESIGNS
            </div>
          </div>
        </div>

        <button
          type="button"
          className="admin-sidebar-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1rem 0', flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Icon size={18} />
                <span>{link.label}</span>
              </div>
              {link.badge > 0 && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.12rem 0.5rem',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                }}>
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer link to public website */}
      <div style={{
        padding: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <a 
          href="http://localhost:5173" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--admin-champagne)',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
        >
          View Client Website <ExternalLink size={14} />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
