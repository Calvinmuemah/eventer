import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  BookmarkCheck, 
  FileText, 
  CreditCard,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLandingPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@mctitoeevents.com');
    setPassword('Admin@McTitoe2026!');
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#081A2B',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Background ambient accents */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201, 162, 39, 0.12) 0%, rgba(8, 26, 43, 0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(231, 211, 163, 0.08) 0%, rgba(8, 26, 43, 0) 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top Navbar */}
      <header style={{
        padding: '1.25rem clamp(1rem, 3vw, 2.5rem)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(8, 26, 43, 0.85)',
        backdropFilter: 'blur(8px)',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '6px',
            border: '1.5px solid var(--admin-accent)',
            color: 'var(--admin-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(201, 162, 39, 0.1)',
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.35rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              lineHeight: 1.1,
            }}>
              MC TITOE
            </div>
            <div style={{
              fontSize: '0.625rem',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--admin-accent)',
              fontWeight: 700,
            }}>
              EVENTS & DESIGNS
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'rgba(255, 255, 255, 0.75)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
          >
            Public Site <ExternalLink size={13} />
          </a>

          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="admin-btn admin-btn-primary"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              boxShadow: '0 4px 14px rgba(201, 162, 39, 0.3)',
            }}
          >
            <Lock size={15} /> Sign In to Operations
          </button>
        </div>
      </header>

      {/* Main Hero & Login Split */}
      <main style={{
        flex: 1,
        maxWidth: '1360px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1rem, 3vw, 2.5rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
        gap: 'clamp(2.5rem, 5vw, 4.5rem)',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
      }}>
        {/* Left: Suite Introduction */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(201, 162, 39, 0.12)',
            border: '1px solid rgba(201, 162, 39, 0.3)',
            color: 'var(--admin-champagne)',
            fontSize: '0.775rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '1.5rem',
          }}>
            <ShieldCheck size={14} color="var(--admin-accent)" />
            Enterprise Operations Portal
          </div>

          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.35rem, 5vw, 3.75rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            color: '#FFFFFF',
          }}>
            Master Staging & <br />
            <span style={{ color: 'var(--admin-accent)' }}>Executive Management</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.65,
            marginBottom: '2.5rem',
            maxWidth: '560px',
          }}>
            Restricted administrative control suite for <strong>MC TITOE EVENTS AND DESIGNS</strong>. Oversee live inquiries, configure production services, approve itemized quotations, and audit verified transactions across Kenya.
          </p>

          {/* Quick Capabilities Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1.25rem',
          }}>
            {[
              {
                icon: BookmarkCheck,
                title: 'Bookings Ledger',
                desc: 'Reconcile settled contracts and upcoming production dates.',
              },
              {
                icon: FileText,
                title: 'Quotation Engine',
                desc: 'Review custom briefs and issue itemized proposals in KSh.',
              },
              {
                icon: Layers,
                title: 'Staging Catalogue',
                desc: 'Curate MC hosting, PA systems, lighting, and decor.',
              },
              {
                icon: CreditCard,
                title: 'Payment Audits',
                desc: 'Real-time reconciliation of M-Pesa and authorized transactions.',
              },
            ].map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div key={i} style={{
                  padding: '1.15rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}>
                  <div style={{ color: 'var(--admin-accent)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Icon size={18} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>{cap.title}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.45 }}>
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Login Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: 'clamp(1.75rem, 4vw, 2.75rem)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          color: 'var(--admin-text-main)',
          border: '1px solid var(--admin-border)',
          maxWidth: '480px',
          width: '100%',
          justifySelf: 'center',
        }}>
          <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 26, 43, 0.08)',
              color: 'var(--admin-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
            }}>
              <Lock size={22} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--admin-primary)', marginBottom: '0.35rem' }}>
              Operations Sign In
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Enter your verified administrator credentials to access the suite.
            </p>
          </div>

          {/* Quick Fill Demo Credentials Banner */}
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>
                Default Credentials
              </div>
              <div style={{ fontSize: '0.78rem', color: '#78350F', marginTop: '0.15rem' }}>
                admin@mctitoeevents.com
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#92400E',
                backgroundColor: '#FDE68A',
                border: 'none',
                padding: '0.35rem 0.65rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCD34D'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FDE68A'}
            >
              Fill Credentials
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#FEE2E2',
              border: '1px solid #F87171',
              borderRadius: '6px',
              color: '#991B1B',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <AlertCircle size={16} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label className="admin-label">Admin Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="admin@mctitoeevents.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={16} style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-muted)',
                }} />
              </div>
            </div>

            <div>
              <label className="admin-label">Access Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="admin-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <Lock size={16} style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-muted)',
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
                    color: 'var(--admin-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                boxShadow: '0 4px 12px rgba(201, 162, 39, 0.25)',
              }}
            >
              {loading ? 'Verifying Authorization...' : (
                <>
                  Access Operations Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--admin-border)',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--admin-text-muted)',
          }}>
            Protected under 256-bit TLS encrypted administrative tunnel.
          </div>
        </div>
      </main>

      {/* Modal View for Mobile or Floating Trigger */}
      {loginModalOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setLoginModalOpen(false)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--admin-primary)' }}>
                Sign In to Operations
              </div>
              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--admin-text-muted)' }}
              >
                ✕
              </button>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-label">Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mctitoeevents.com"
                  required
                />
              </div>

              <div>
                <label className="admin-label">Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleQuickFill}
                style={{ fontSize: '0.8rem', color: 'var(--admin-accent-hover)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
              >
                Use default admin credentials
              </button>

              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        padding: '1.5rem clamp(1rem, 3vw, 2.5rem)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 5,
      }}>
        © {new Date().getFullYear()} MC TITOE EVENTS AND DESIGNS LTD. All Rights Reserved. • Operations Suite v1.0.0
      </footer>
    </div>
  );
};

export default AdminLandingPage;
