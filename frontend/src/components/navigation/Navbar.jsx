import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND } from '../../constants/branding';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? 'rgba(8, 26, 43, 0.95)' : 'var(--color-primary)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(231, 211, 163, 0.15)',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none',
    }}>
      <div style={{
        width: '100%',
        padding: '0 clamp(0.5rem, 1vw, 1rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
      }}>
        {/* Brand Logo - Far Left End */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          flexShrink: 0,
        }}>
          {/* Animated luxury brand emblem */}
          <motion.div 
            whileHover={{ scale: 1.08, rotate: [0, -6, 6, 0] }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              border: '1.5px solid var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
              background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.18) 0%, rgba(8, 26, 43, 0.8) 100%)',
              boxShadow: '0 0 14px rgba(201, 162, 39, 0.22)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Sparkles size={18} />
            </motion.div>
          </motion.div>

          {/* Animated Typography Lockup */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.2rem',
              lineHeight: 1.05,
            }}>
              <span className="brand-gradient-shimmer" style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}>
                MC TITOE
              </span>
              <span style={{ color: 'var(--color-accent)', fontSize: '1.4rem', fontWeight: 700 }}>.</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.24em',
              color: 'var(--color-champagne)',
              textTransform: 'uppercase',
              marginTop: '2px',
              opacity: 0.92,
            }}>
              EVENTS & DESIGNS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation & Actions - Far Right End */}
        <div 
          className="desktop-nav"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2.25rem',
            marginLeft: 'auto',
          }}
        >
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
          }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: isActive ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.82)',
                  position: 'relative',
                  padding: '0.4rem 0',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/plan-event" className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
            PLAN YOUR EVENT <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            padding: '0.5rem',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-primary)',
          borderTop: '1px solid rgba(231, 211, 163, 0.1)',
          padding: '1.75rem 1.5rem 2.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          maxHeight: 'calc(100dvh - 80px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: isActive ? 'var(--color-accent)' : '#FFFFFF',
                padding: '0.4rem 0',
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Link to="/plan-event" className="btn btn-primary" style={{ width: '100%' }}>
              PLAN YOUR EVENT <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
