import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
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
        paddingTop: '5rem',
        paddingBottom: '4rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '2.5rem',
          marginBottom: '4rem',
        }}>
          {/* Brand Col */}
          <div>
            <Link to="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              textDecoration: 'none',
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '6px',
                border: '1.5px solid var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent)',
                background: 'rgba(201, 162, 39, 0.12)',
                boxShadow: '0 0 14px rgba(201, 162, 39, 0.2)',
              }}>
                <Sparkles size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', lineHeight: 1.05 }}>
                  <span className="brand-gradient-shimmer" style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}>
                    MC TITOE
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.62rem',
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
              fontSize: '0.925rem',
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.65)',
              marginBottom: '1.75rem',
              maxWidth: '300px',
            }}>
              {BRAND.footerTagline}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-champagne)' }}>
                <Phone size={15} />
                <span>{BRAND.contact.phoneFormatted}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-champagne)' }}>
                <Mail size={15} />
                <span>{BRAND.contact.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                <MapPin size={15} />
                <span>{BRAND.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
            }}>
              Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/services/mc" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Master of Ceremonies (MC)</Link></li>
              <li><Link to="/services/public-address-system" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Public Address System</Link></li>
              <li><Link to="/services/musical-instruments" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Musical Instruments & Backline</Link></li>
              <li><Link to="/services/events-planning" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Event Architecture & Planning</Link></li>
              <li><Link to="/services/decoration-lighting" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Decoration & Architectural Lighting</Link></li>
              <li><Link to="/services/more" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Custom & Specialized Staging</Link></li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
            }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>About Us</Link></li>
              <li><Link to="/how-it-works" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>How It Works</Link></li>
              <li><Link to="/gallery" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Portfolio & Gallery</Link></li>
              <li><Link to="/plan-event" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Plan Your Event</Link></li>
              <li><Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Contact Concierge</Link></li>
            </ul>
          </div>

          {/* Social / Direct Connect */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              marginBottom: '1.25rem',
            }}>
              Connect
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              {BRAND.socials.map((social) => (
                <a 
                  key={social.label}
                  href={social.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {social.label} <ArrowUpRight size={13} style={{ color: 'var(--color-accent)' }} />
                </a>
              ))}
            </div>
            <div style={{ marginTop: '1.75rem' }}>
              <Link to="/plan-event" className="btn btn-outline-gold btn-sm" style={{ width: '100%' }}>
                Request Quotation
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'rgba(255, 255, 255, 0.45)',
        }}>
          <div>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
