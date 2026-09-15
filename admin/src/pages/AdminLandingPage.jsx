import React, { useState, useEffect } from 'react';
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
  Check,
  AlertCircle,
  KeyRound,
  X,
  Volume2,
  Mic2,
  CalendarCheck,
  Award,
  Clock,
  Radio,
  Sliders,
  Sparkle
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
  const [rememberMe, setRememberMe] = useState(true);
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
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201, 162, 39, 0.14) 0%, rgba(8, 26, 43, 0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(18, 43, 69, 0.5) 0%, rgba(8, 26, 43, 0) 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Top Navigation Bar with small margin alignment */}
      <header style={{
        padding: '1rem clamp(0.5rem, 1vw, 1rem)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(7, 21, 36, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
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

      {/* Main Informational Page Body with small margin alignment */}
      <main style={{
        flex: 1,
        maxWidth: '1840px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(2rem, 3.5vw, 3.5rem) clamp(0.5rem, 1vw, 1rem)',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(3rem, 5vw, 4.5rem)',
      }}>
        {/* Hero Section */}
        <section style={{
          textAlign: 'center',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '1rem 0',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(201, 162, 39, 0.12)',
            border: '1px solid rgba(201, 162, 39, 0.3)',
            color: 'var(--admin-champagne)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '1.5rem',
          }}>
            <ShieldCheck size={15} color="var(--admin-accent)" />
            Enterprise Operations Command &bull; Mombasa Bamburi, Kenya
          </div>

          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            color: '#FFFFFF',
          }}>
            MC TITOE EVENTS AND DESIGNS <br />
            <span className="landing-gold-text">Comprehensive Staging & Operations Suite</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: '820px',
            margin: '0 auto 2.5rem auto',
          }}>
            Kenya’s premier digital control suite for orchestrating high-profile corporate galas, VIP celebrations, sound acoustics, and master of ceremonies production. Built for automated client quotation generation in Kenyan Shillings (KSh), live inventory logistics, and real-time M-Pesa transaction reconciliation.
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
          }}>
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="landing-btn-gold"
              style={{
                width: 'auto',
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                borderRadius: '8px',
              }}
            >
              <Lock size={17} />
              <span>Access Operations Portal</span>
            </button>

            <a
              href={publicSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <span>Explore Public Client Platform</span>
              <ExternalLink size={15} />
            </a>
          </div>

          {/* Operational Metrics Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '1rem',
            textAlign: 'left',
          }}>
            {[
              {
                icon: Radio,
                label: 'Operational Cluster',
                val: 'Live & Active',
                detail: 'PostgreSQL Pool Connection (Neon AWS)',
              },
              {
                icon: Sliders,
                label: 'Currency Architecture',
                val: 'KES / KSh Standard',
                detail: 'Provisional line-item costing & audits',
              },
              {
                icon: CreditCard,
                label: 'Payment Verification',
                val: 'M-Pesa Real-Time',
                detail: 'Automated receipt reconciliation',
              },
              {
                icon: ShieldCheck,
                label: 'Access Protocol',
                val: '256-Bit TLS 1.3',
                detail: 'Bcrypt hashing & JWT session guard',
              },
            ].map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="landing-feature-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Icon size={16} color="var(--admin-accent)" />
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {metric.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                    {metric.val}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {metric.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Enterprise Operational Pillars */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '0.5rem',
            }}>
              Operational Pillars & Control Suites
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
              Centralized administrative capabilities empowering MC Titoe Events to deliver flawless stage execution.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.25rem',
          }}>
            {[
              {
                icon: BookmarkCheck,
                badge: 'Workflow Dispatch',
                title: 'Client Inquiries & CRM',
                desc: 'Real-time triage of inbound website inquiries. Features automated acknowledgment emails via Nodemailer, Kenyan phone normalization (+254), and executive client follow-up queues.',
              },
              {
                icon: FileText,
                badge: 'Quotation Engine',
                title: 'Itemized Proposals in KSh',
                desc: 'Instantly computes estimates across MC appearances, PA equipment, stage lighting, and luxury decor. Issues 14-day formal quotations with unique EVT reference codes and customer portal links.',
              },
              {
                icon: Layers,
                badge: 'Equipment & Staging',
                title: 'Hardware & Staging Catalog',
                desc: 'Full-spectrum inventory management covering Yamaha digital consoles, Shure dual wireless UHF systems, ambient par cans, moving-head beams, hazers, and structural stage setups.',
              },
              {
                icon: CreditCard,
                badge: 'Financial Audit',
                title: 'M-Pesa & Payment Ledger',
                desc: 'Real-time transaction tracking for customer deposits, final balances, and payment assistance requests. Maintains a tamper-proof audit trail of verified receipts across Kenyan banks and mobile money.',
              },
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="landing-feature-card" style={{ padding: '1.75rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--admin-champagne)',
                    backgroundColor: 'rgba(201, 162, 39, 0.1)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                  }}>
                    {pillar.badge}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(201, 162, 39, 0.15)',
                      color: 'var(--admin-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>{pillar.title}</h3>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.68)', lineHeight: 1.6 }}>
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: The Production Lifecycle Workflow */}
        <section style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: 'clamp(2rem, 3.5vw, 3rem) clamp(1rem, 2vw, 2rem)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '0.5rem',
            }}>
              Event Lifecycle & Execution Workflow
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
              How client bookings seamlessly transition from digital brief to live stage execution.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '1.25rem',
          }}>
            {[
              {
                step: '01',
                title: 'Client Specification',
                desc: 'Client selects guest count, proposed date, event type, and desired sound & MC packages on the booking portal.',
              },
              {
                step: '02',
                title: 'Automated Quote & Email',
                desc: 'Engine calculates itemized costs in KSh and dispatches branded email confirmations with quote links to client & admin.',
              },
              {
                step: '03',
                title: 'Review & Customization',
                desc: 'Admin reviews venue acoustics, fine-tunes stage requirements, applies custom discounts, and conducts technical walkthrough.',
              },
              {
                step: '04',
                title: 'Settlement & Staging',
                desc: 'Client accepts quote, locks in date with M-Pesa deposit, and production team dispatches audio engineers & MC.',
              },
            ].map((wf, idx) => (
              <div key={idx} className="landing-step-card">
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'Cormorant Garamond, serif',
                  color: 'var(--admin-accent)',
                  opacity: 0.8,
                  lineHeight: 1,
                  marginBottom: '0.85rem',
                }}>
                  {wf.step}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  {wf.title}
                </h4>
                <p style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.55 }}>
                  {wf.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Production Hardware & Staging Standards */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '0.5rem',
            }}>
              Production Staging & Acoustic Standards
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>
              High-end audiovisual equipment and bespoke event styling deployed for our clients.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.25rem',
          }}>
            {[
              {
                icon: Mic2,
                title: 'Master of Ceremonies (MC)',
                highlights: ['Corporate Protocol & Etiquette', 'Bilingual English & Swahili', 'Seamless Ceremony Pacing', 'Interactive Crowd Engagement'],
              },
              {
                icon: Volume2,
                title: 'Public Address & Audio',
                highlights: ['Calibrated Line-Array Speakers', 'Yamaha / JBL Digital Mixers', 'Dual Shure UHF Wireless Mics', 'Acoustic Sound Optimization'],
              },
              {
                icon: Sparkles,
                title: 'Lighting & Stage Visuals',
                highlights: ['Beam Moving-Head Lights', 'Ambient LED Par Can Uplighting', 'Hazer Atmosphere Machines', 'Heavy-Duty Stage Trussing'],
              },
              {
                icon: Award,
                title: 'Luxury Event Styling',
                highlights: ['Thematic Stage Backdrops', 'VIP Arch & Floral Design', 'Luxury Tablescape Decor', 'Red Carpet & VIP Entries'],
              },
            ].map((spec, i) => {
              const Icon = spec.icon;
              return (
                <div key={i} className="landing-feature-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(201, 162, 39, 0.12)',
                      color: 'var(--admin-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={18} />
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>{spec.title}</h4>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {spec.highlights.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.72)' }}>
                        <Check size={13} color="var(--admin-accent)" flexShrink={0} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Bottom Executive Call to Action Banner */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(13, 31, 51, 0.9) 0%, rgba(8, 26, 43, 0.95) 100%)',
          border: '1px solid rgba(201, 162, 39, 0.3)',
          borderRadius: '16px',
          padding: 'clamp(2.5rem, 4vw, 3.5rem) clamp(1rem, 2vw, 2.5rem)',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(201, 162, 39, 0.15)',
            color: 'var(--admin-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Lock size={22} />
          </div>

          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.1rem, 4vw, 3rem)',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '0.85rem',
          }}>
            Ready to Coordinate Your Next Event Production?
          </h2>

          <p style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.75)',
            maxWidth: '650px',
            margin: '0 auto 2rem auto',
            lineHeight: 1.6,
          }}>
            Authorized administrators and event managers can sign in to view inbound client briefs, update staging line items, and audit verified transactions.
          </p>

          <button
            type="button"
            onClick={() => setLoginModalOpen(true)}
            className="landing-btn-gold"
            style={{
              width: 'auto',
              padding: '0.9rem 2.5rem',
              fontSize: '1.05rem',
              borderRadius: '8px',
              margin: '0 auto',
            }}
          >
            <Lock size={18} />
            <span>Open Operations Login</span>
            <ArrowRight size={18} />
          </button>
        </section>
      </main>

      {/* Corporate Information Ribbon */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '1rem clamp(0.5rem, 1vw, 1rem)',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5,
      }}>
        <div style={{
          maxWidth: '1840px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(1rem, 2vw, 2.5rem)',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.65)',
        }}>
          <span>📍 Headquarters: Mombasa Bamburi, Kenya</span>
          <span>📞 Production Dispatch: +254 721 784 682 / +254 758 726 167 (WhatsApp: 0782 527 081)</span>
          <span>✉️ Operations Desk: mctitoeeventsdesigns@gmail.com</span>
          <span>🔒 Clearance: 256-Bit TLS 1.3 Certified</span>
        </div>
      </div>

      {/* Footer with small margin alignment */}
      <footer style={{
        padding: '1.5rem clamp(0.5rem, 1vw, 1rem)',
        maxWidth: '1840px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.775rem',
        color: 'rgba(255, 255, 255, 0.4)',
        position: 'relative',
        zIndex: 5,
      }}>
        <div>
          &copy; {new Date().getFullYear()} <strong>MC TITOE EVENTS AND DESIGNS</strong>. All Rights Reserved.
        </div>
        <div>
          Enterprise Operations Platform &bull; Release v2.4 (Kenya Edition)
        </div>
      </footer>

      {/* Luxury Operations Login Modal */}
      {loginModalOpen && (
        <div 
          className="landing-modal-backdrop"
          onClick={() => setLoginModalOpen(false)}
        >
          <div 
            className="landing-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLoginModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              }}
              aria-label="Close login modal"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(201, 162, 39, 0.12)',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                color: 'var(--admin-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.85rem',
                boxShadow: '0 0 20px rgba(201, 162, 39, 0.2)',
              }}>
                <Lock size={22} />
              </div>

              <h3 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                marginBottom: '0.25rem',
              }}>
                Sign In to Operations
              </h3>
              <p style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                Enter your administrative credentials to manage MC Titoe live events.
              </p>
            </div>

            {/* Quick Demo Access Pill */}
            <div style={{
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <button
                type="button"
                onClick={handleApplyDemo}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: demoLoaded ? '#34D399' : 'var(--admin-champagne)',
                  backgroundColor: demoLoaded ? 'rgba(16, 185, 129, 0.12)' : 'rgba(201, 162, 39, 0.1)',
                  border: `1px solid ${demoLoaded ? 'rgba(16, 185, 129, 0.3)' : 'rgba(201, 162, 39, 0.25)'}`,
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!demoLoaded) e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.18)';
                }}
                onMouseLeave={(e) => {
                  if (!demoLoaded) e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.1)';
                }}
                title="Click to auto-populate administrator credentials"
              >
                {demoLoaded ? (
                  <>
                    <Check size={13} />
                    <span>Credentials Applied</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={13} />
                    <span>Quick Admin Access (kelvinmuemah855@gmail.com)</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                padding: '0.75rem 0.95rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '8px',
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--admin-champagne)',
                  marginBottom: '0.4rem',
                }}>
                  Corporate Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="landing-input-dark"
                    placeholder="kelvinmuemah855@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                  <Mail size={16} style={{
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
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--admin-champagne)',
                  marginBottom: '0.4rem',
                }}>
                  Security Key / Password
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
                  <Lock size={16} style={{
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
                      padding: '0.2rem',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      accentColor: 'var(--admin-accent)',
                      width: '14px',
                      height: '14px',
                      cursor: 'pointer',
                    }}
                  />
                  <span>Remember session</span>
                </label>
                <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>TLS 1.3 Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="landing-btn-gold"
                style={{ marginTop: '0.5rem', padding: '0.8rem' }}
              >
                {loading ? (
                  <span>Verifying Authorization...</span>
                ) : (
                  <>
                    <span>Authenticate & Enter Suite</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center',
              fontSize: '0.725rem',
              color: 'rgba(255, 255, 255, 0.45)',
            }}>
              Restricted portal &bull; Authorized Mc Titoe Events Staff Only
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLandingPage;
