import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ExternalLink,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLandingPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Login Modal & Form State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [demoLoaded, setDemoLoaded] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && loginModalOpen) {
        setLoginModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loginModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDemo = () => {
    setEmail('kelvinmuemah855@gmail.com');
    setPassword('@calvin254');
    setError(null);
    setDemoLoaded(true);
    setTimeout(() => setDemoLoaded(false), 3000);
  };

  // Resolve client frontend URL
  const publicSiteUrl = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5173';

  return (
    <div className="admin-landing-wrapper">
      {/* Decorative subtle topographic wave lines (bottom-left) matching screenshot */}
      <svg
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-40px',
          width: '460px',
          height: '360px',
          pointerEvents: 'none',
          opacity: 0.12,
          zIndex: 1,
        }}
        viewBox="0 0 460 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-50 360 C 60 280, 150 240, 260 270 C 350 290, 400 340, 460 360" stroke="#C9A227" strokeWidth="1.2" />
        <path d="M-50 320 C 50 240, 130 200, 230 230 C 320 250, 370 300, 430 330" stroke="#C9A227" strokeWidth="1.2" />
        <path d="M-50 280 C 40 200, 110 160, 200 190 C 280 210, 340 260, 400 300" stroke="#C9A227" strokeWidth="1.2" />
        <path d="M-50 240 C 30 160, 90 120, 170 150 C 240 170, 300 220, 360 270" stroke="#C9A227" strokeWidth="1.2" />
        <path d="M-50 200 C 20 120, 70 80, 140 110 C 200 130, 260 180, 320 240" stroke="#C9A227" strokeWidth="1.2" />
        <path d="M-50 160 C 10 80, 50 40, 110 70 C 160 90, 220 140, 280 210" stroke="#C9A227" strokeWidth="1.2" />
      </svg>

      {/* Top Navigation Bar - KEPT AS IS WITH PROJECT COLORS */}
      <header style={{
        padding: '1rem clamp(0.5rem, 1vw, 1rem)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(8, 26, 43, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        {/* Brand Crest */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1.5px solid var(--admin-accent)',
            color: 'var(--admin-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(201, 162, 39, 0.12)',
            boxShadow: '0 0 20px rgba(201, 162, 39, 0.25)',
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.3rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              lineHeight: 1.15,
            }}>
              MC TITOE
            </div>
            <div style={{
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--admin-champagne)',
              fontWeight: 700,
            }}>
              EVENTS & DESIGNS • OPERATIONS SUITE
            </div>
          </div>
        </div>

        {/* Status indicator & Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Live system health beacon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.75rem',
            color: '#34D399',
            fontWeight: 600,
          }}>
            <span className="landing-pulse-dot" />
            <span style={{ display: 'inline-block' }}>Systems Live</span>
          </div>

          <a
            href={publicSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.5rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <span>Public Site</span>
            <ExternalLink size={13} />
          </a>

          {/* Login Button in Navbar */}
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="landing-btn-gold"
            style={{
              width: 'auto',
              padding: '0.5rem 1.15rem',
              fontSize: '0.85rem',
              borderRadius: '6px',
            }}
          >
            <Lock size={14} />
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* Main Centered Hero Section */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(2.5rem, 6vh, 5rem) clamp(1rem, 3vw, 2rem)',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1080px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 5.4vw, 4.4rem)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.035em',
          color: '#FFFFFF',
          marginBottom: '1.4rem',
          maxWidth: '920px',
        }}>
          Unlimited event operations.<br />
          One unified control center.
        </h1>

        {/* Subtitle with Theme Gold Doodle Underline */}
        <p style={{
          fontSize: 'clamp(1.05rem, 1.9vw, 1.35rem)',
          color: 'rgba(255, 255, 255, 0.85)',
          lineHeight: 1.6,
          maxWidth: '780px',
          margin: '0 auto 2.6rem',
          fontWeight: 400,
        }}>
          With MC Titoe Admin, coordinate client bookings, reconcile payments, dispatch itemized quotes, and supervise sound & MC setups for{' '}
          <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', fontWeight: 600, color: '#FFFFFF' }}>
            <span>flawless real-time execution.</span>
            {/* Hand-drawn gold doodle curve */}
            <svg
              viewBox="0 0 280 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                left: 0,
                bottom: '-8px',
                width: '100%',
                height: '14px',
                pointerEvents: 'none',
                overflow: 'visible',
              }}
            >
              <path
                d="M 4 12 C 55 3, 175 2, 276 9"
                stroke="var(--admin-accent)"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
              <path
                d="M 12 15 C 65 7, 195 6, 265 13"
                stroke="var(--admin-champagne)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </span>
        </p>

        {/* Action Button - Clean Solid White Pill with Gold Hover Glow */}
        <div>
          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="limitless-cta-pill"
          >
            <span>Access Admin Portal</span>
          </button>
        </div>

        {/* 5 Carousel / Indicator Dots in Theme Colors */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '1.75rem',
          marginBottom: '0.75rem',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--admin-accent)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.35)' }} />
        </div>

        {/* Status Microcopy in Theme Champagne */}
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--admin-champagne)',
        }}>
          AUTHORIZED ACCESS ONLY • TLS 1.3 SECURE
        </div>
      </main>

      {/* Bottom Brand / Capability Showcase Bar */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '2rem 1.5rem 2.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(4, 13, 22, 0.65)',
        backdropFilter: 'blur(10px)',
      }}>
        {/* Caption */}
        <div style={{
          textAlign: 'center',
          fontSize: '0.725rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--admin-champagne)',
          opacity: 0.85,
          marginBottom: '1.5rem',
        }}>
          TRUSTED FOR PREMIER WEDDINGS, CONFERENCES & GALAS
        </div>

        {/* 5 Sleek Vector Brands / Tech Badges */}
        <div className="limitless-logos-row">
          {/* 1. M-PESA */}
          <div className="limitless-logo-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            <span style={{ letterSpacing: '0.02em' }}>M-PESA</span>
          </div>

          {/* 2. PAYSTACK */}
          <div className="limitless-logo-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="3" rx="1.5" fill="currentColor" />
              <rect x="3" y="10.5" width="12" height="3" rx="1.5" fill="currentColor" />
              <rect x="3" y="16" width="18" height="3" rx="1.5" fill="currentColor" />
            </svg>
            <span>paystack</span>
          </div>

          {/* 3. PIONEER PRO DJ */}
          <div className="limitless-logo-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="3" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="21" />
            </svg>
            <span>Pioneer DJ</span>
          </div>

          {/* 4. NEON CLOUD */}
          <div className="limitless-logo-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
            <span>Neon Cloud</span>
          </div>

          {/* 5. VERCEL */}
          <div className="limitless-logo-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L23 21H1L12 2Z" />
            </svg>
            <span>Vercel</span>
          </div>
        </div>
      </footer>

      {/* Simple, Clean Login Modal in Project Theme Colors */}
      {loginModalOpen && (
        <div className="landing-modal-backdrop" onClick={() => setLoginModalOpen(false)}>
          <div
            className="landing-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#081A2B',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '380px',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLoginModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'; }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Simple Clean Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                border: '1.5px solid var(--admin-accent)',
                color: 'var(--admin-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(201, 162, 39, 0.1)',
                marginBottom: '0.75rem',
              }}>
                <Lock size={18} />
              </div>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: '0 0 0.25rem',
              }}>
                Sign In
              </h2>
              <p style={{
                fontSize: '0.825rem',
                color: 'var(--admin-champagne)',
                margin: 0,
              }}>
                MC Titoe Administrative Suite
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#FCA5A5',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <AlertCircle size={15} flexShrink={0} color="#EF4444" />
                <span>{error}</span>
              </div>
            )}

            {/* Simple Clean Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '0.35rem',
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="landing-input-dark"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                  <Mail size={15} style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }} />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '0.35rem',
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="landing-input-dark"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                  />
                  <Lock size={15} style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button in Project Gold */}
              <button
                type="submit"
                disabled={loading}
                className="landing-btn-gold"
                style={{
                  marginTop: '0.4rem',
                  padding: '0.75rem',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Simple Demo Link */}
              <button
                type="button"
                onClick={handleApplyDemo}
                style={{
                  background: 'none',
                  border: 'none',
                  color: demoLoaded ? '#34D399' : 'var(--admin-champagne)',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '0.35rem 0 0',
                  textDecoration: 'underline',
                  opacity: 0.85,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              >
                {demoLoaded ? '✓ Demo credentials filled' : 'Fill demo credentials'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLandingPage;
