import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { BRAND } from '../../constants/branding';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-primary-dark)',
      color: 'rgba(255, 255, 255, 0.75)',
      borderTop: '1px solid rgba(201, 162, 39, 0.2)',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        paddingTop: '2.25rem',
        paddingBottom: '1.75rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '1.75rem',
        }}>
          {/* Brand Col */}
          <div>
            <Link to="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              textDecoration: 'none',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', lineHeight: 1.05 }}>
                  <span className="brand-gradient-shimmer" style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}>
                    MC TITOE
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.54rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: 'var(--color-champagne)',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}>
                  EVENTS & DESIGNS
                </span>
              </div>
            </Link>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.825rem',
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.65)',
              marginBottom: '1rem',
              maxWidth: '300px',
            }}>
              {BRAND.footerTagline}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-champagne)' }}>
                <Phone size={14} />
                <span>{BRAND.contact.phoneFormatted}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-champagne)' }}>
                <Mail size={14} />
                <span>{BRAND.contact.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                <MapPin size={14} />
                <span>{BRAND.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: '0.65rem',
            }}>
              Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem' }}>
              <li><Link to="/services/mc" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Master of Ceremonies (MC)</Link></li>
              <li><Link to="/services/public-address-system" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Public Address System</Link></li>
              <li><Link to="/services/musical-instruments" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Musical Instruments & Backline</Link></li>
              <li><Link to="/services/events-planning" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Event Architecture & Planning</Link></li>
              <li><Link to="/services/decoration-lighting" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Decoration & Architectural Lighting</Link></li>
              <li><Link to="/services/more" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Custom & Specialized Staging</Link></li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: '0.65rem',
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem' }}>
              <li><Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link to="/how-it-works" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>How It Works</Link></li>
              <li><Link to="/gallery" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Portfolio & Gallery</Link></li>
              <li><Link to="/plan-event" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Plan Your Event</Link></li>
              <li><Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>Contact Concierge</Link></li>
            </ul>
          </div>

          {/* Social / Direct Connect */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: '0.65rem',
            }}>
              Connect
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem' }}>
              {BRAND.socials.map((social) => (
                <a 
                  key={social.label}
                  href={social.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                  }}
                >
                  {social.label} <ArrowUpRight size={12} style={{ color: 'var(--color-accent)' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slim Bottom Legal Bar */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(4, 15, 26, 0.65)',
        padding: '0.65rem 0',
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
        }}>
          <div>
            © Copyright {new Date().getFullYear()}. Designed by{' '}
            <a 
              href="https://calvin-muemah.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-champagne)',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-champagne)'; }}
            >
              Calfrah Creations
            </a>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
