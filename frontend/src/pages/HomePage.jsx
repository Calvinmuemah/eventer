import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Mic2, 
  Music, 
  CalendarCheck, 
  Layers, 
  Star, 
  ChevronRight 
} from 'lucide-react';
import { servicesApi } from '../api/servicesApi';
import ServiceCard from '../components/services/ServiceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';
import { fadeInUp, staggerContainer } from '../animations/variants';

export const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await servicesApi.getAll();
      setServices(res.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load services catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="homepage">
      <MetaTags 
        title="Bespoke Event Planning, Sound & Staging" 
        description="We turn your vision into an unforgettable event with master MCs, concert-grade sound, bespoke planning, and architectural lighting."
      />

      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        overflow: 'hidden',
        padding: '5rem 0',
      }}>
        {/* Cinematic Backdrop Image with Luxury Gradients */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.28,
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(201, 162, 39, 0.15) 0%, transparent 60%), linear-gradient(to bottom, rgba(8, 26, 43, 0.85) 0%, rgba(8, 26, 43, 0.95) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            style={{ maxWidth: '820px' }}
          >
            <motion.div 
              variants={fadeInUp} 
              className="badge-eyebrow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 1.1rem',
                border: '1px solid rgba(201, 162, 39, 0.45)',
                background: 'rgba(8, 26, 43, 0.75)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-flex', color: 'var(--color-accent)' }}
              >
                <Sparkles size={14} />
              </motion.span>
              <span style={{ fontWeight: 700, letterSpacing: '0.14em', color: '#FFFFFF' }}>
                MC TITOE EVENTS & DESIGNS
              </span>
              <span style={{ color: 'var(--color-accent)', opacity: 0.7 }}>•</span>
              <span style={{ color: 'var(--color-champagne)' }}>Premier Production & Staging</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="font-display" 
              style={{
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                fontWeight: 600,
              }}
            >
              {BRAND.tagline}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="font-body-large"
              style={{
                color: 'rgba(255, 255, 255, 0.82)',
                marginBottom: '2.5rem',
                maxWidth: '680px',
                lineHeight: 1.7,
              }}
            >
              {BRAND.subTagline}
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <Link to="/plan-event" className="btn btn-primary btn-lg">
                Plan Your Event <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn btn-outline-gold btn-lg">
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST / CREDIBILITY STRIP */}
      <section style={{
        backgroundColor: '#040D16',
        borderBottom: '1px solid rgba(231, 211, 163, 0.15)',
        padding: '1.5rem 0',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '0.85rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-accent)' }} />
              <span>Concert-Grade Acoustic Standards</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mic2 size={20} style={{ color: 'var(--color-accent)' }} />
              <span>Elite Protocol-Trained MCs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CalendarCheck size={20} style={{ color: 'var(--color-accent)' }} />
              <span>Turnkey Event Architecture</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Sparkles size={20} style={{ color: 'var(--color-accent)' }} />
              <span>Transparent Tailored Quotations</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="section-padding">
        <div className="container">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '3.5rem',
          }}>
            <span className="badge-eyebrow">Our Specializations</span>
            <h2 className="font-h2" style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
              Comprehensive Production & Event Services
            </h2>
            <p style={{
              maxWidth: '640px',
              color: 'var(--color-muted)',
              fontSize: '1rem',
            }}>
              Whether orchestrating a state gala, an opulent wedding, or an executive conference, our modular services combine flawlessly to bring your exact vision to life.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading services catalogue..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchServices} />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 330px), 1fr))',
              gap: '2rem',
            }}>
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/services" className="btn btn-secondary btn-lg">
              View Complete Catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="section-padding" style={{
        backgroundColor: 'var(--color-surface-subtle)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
          }}>
            {/* Visual block */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80" 
                  alt="Atmospheric Event Production"
                  style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-1.5rem',
                right: '-1.5rem',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                padding: '1.75rem',
                borderRadius: 'var(--radius-xs)',
                boxShadow: 'var(--shadow-lg)',
                maxWidth: '240px',
                borderLeft: '4px solid var(--color-accent)',
                display: 'none',
              }} className="highlight-box">
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>
                  100%
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                  Dedicated on-site production management for every event.
                </div>
              </div>
            </div>

            {/* Content block */}
            <div>
              <span className="badge-eyebrow">The Standard of Excellence</span>
              <h2 className="font-h2" style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                Why Leading Event Hosts Rely On {BRAND.name}
              </h2>
              <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                An extraordinary event is built upon hundreds of synchronized decisions. We bridge the gap between technical staging and warm hospitality, delivering an experience that feels effortless to you and unforgettable to your guests.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(8, 26, 43, 0.08)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CalendarCheck size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--color-primary)' }}>
                      Rigorous Timeline & Flow Management
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                      From keynote transitions to the dinner bell, we maintain a crisp, dignified tempo with zero awkward pauses.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(201, 162, 39, 0.12)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Music size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--color-primary)' }}>
                      Precision Sound & Staging
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                      No feedback, no muffled speeches. Calibrated acoustic dispersion tailored directly to your venue geometry.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(8, 26, 43, 0.08)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.3rem', color: 'var(--color-primary)' }}>
                      Single Point of Contact
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                      Stop juggling ten different vendors. We unify MC, audio, lighting, backline, and decor under one accountable team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (min-width: 768px) {
            .highlight-box { display: block !important; }
          }
        `}</style>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge-eyebrow">Seamless Process</span>
            <h2 className="font-h2" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
              How We Bring Your Event Together
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-muted)' }}>
              From your initial inquiry to the final applause, our clear four-step journey keeps you in complete control.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
          }}>
            {[
              {
                step: '01',
                title: 'Tell Us About Your Event',
                desc: 'Provide your event date, venue location, guest size, and requirements through our streamlined planner.',
              },
              {
                step: '02',
                title: 'Choose Your Services',
                desc: 'Select from MC, Sound System, Instruments, Event Planning, Lighting, or bespoke custom solutions.',
              },
              {
                step: '03',
                title: 'Receive Your Quote',
                desc: 'Review an itemized quotation crafted specifically for your scale, with options to request fine adjustments.',
              },
              {
                step: '04',
                title: 'Confirm & Pay',
                desc: 'Approve your quote and confirm your booking securely online or with our dedicated concierge assistance.',
              },
            ].map((item) => (
              <div 
                key={item.step}
                className="card-luxury"
                style={{
                  padding: '2rem 1.75rem',
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'var(--color-champagne)',
                  lineHeight: 1,
                  marginBottom: '1rem',
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  color: 'var(--color-primary)',
                  marginBottom: '0.75rem',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-muted)',
                  lineHeight: 1.6,
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/how-it-works" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}>
              Learn more about our operational standards <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FEATURED EVENT EXPERIENCE SPOTLIGHT */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}>
            <div>
              <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
                Curated Production Package
              </span>
              <h2 className="font-h2" style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>
                The Complete Gala & Wedding Experience
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7, marginBottom: '2rem' }}>
                Experience total creative peace of mind. When sound engineering, ambient architectural lighting, expert master of ceremonies, and floor logistics harmonize under a single banner, your celebration reaches an unforgettable echelon.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                {[
                  'Bespoke scriptwriting and protocol timing',
                  'Calibrated line-array audio staging and speech reinforcement',
                  'Warm ambient pin-spotting and chandelier illumination',
                  'Dedicated on-site production director',
                ].map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.925rem' }}>
                    <Sparkles size={16} style={{ color: 'var(--color-accent)' }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <Link to="/plan-event" className="btn btn-primary btn-lg">
                Request Custom Package <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}>
              <img 
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80" 
                alt="Keynote and Gala Host"
                style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" 
                alt="Lighting Installation"
                style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', marginTop: '2rem' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="section-padding">
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
            gap: '1.5rem',
          }}>
            <div>
              <span className="badge-eyebrow">Visual Excellence</span>
              <h2 className="font-h2" style={{ color: 'var(--color-primary)' }}>
                Moments Crafted With Intention
              </h2>
            </div>
            <Link to="/gallery" className="btn btn-secondary btn-sm">
              View All Moments <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1.5rem',
          }}>
            {[
              {
                url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                caption: 'Grand Banquet Table Styling',
              },
              {
                url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
                caption: 'Digital Audio Mixing Console',
              },
              {
                url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
                caption: 'Concert Grand Piano Backline',
              },
              {
                url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
                caption: 'Ambient Canopy Lighting',
              },
            ].map((img, i) => (
              <div 
                key={i} 
                style={{
                  position: 'relative',
                  height: '300px',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-primary)',
                }}
              >
                <img 
                  src={img.url} 
                  alt={img.caption}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(8, 26, 43, 0.8) 0%, transparent 50%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '1.25rem',
                }}>
                  <span style={{ color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 500 }}>
                    {img.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="section-padding" style={{
        backgroundColor: 'var(--color-surface-subtle)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge-eyebrow">Client Perspectives</span>
            <h2 className="font-h2" style={{ color: 'var(--color-primary)' }}>
              Trusted by Host Committees & Couples
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '2rem',
          }}>
            {[
              {
                quote: "The sound reinforcement was pristine from the first keynote to the concluding gala dinner. Their MC maintained an elegant, confident flow throughout our summit.",
                author: "Sarah Sterling",
                role: "Director of Corporate Affairs, Horizon Forum",
              },
              {
                quote: "From our initial meeting to the final dance, EVENTA turned our wedding reception into pure magic. The architectural lighting was breathtaking.",
                author: "David & Julianne K.",
                role: "Private Wedding Clients",
              },
              {
                quote: "Having backline instruments and full PA managed by one unified crew saved our production days of back-and-forth communication. Flawless execution.",
                author: "Martin O'Connor",
                role: "Artistic Producer, Starlight Concert Series",
              },
            ].map((t, i) => (
              <div key={i} className="card-luxury" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--color-accent)', marginBottom: '1rem' }}>
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  fontStyle: 'italic',
                  color: 'var(--color-dark)',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}>
                  "{t.quote}"
                </p>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                    {t.author}
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--color-muted)' }}>
                    {t.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. STRONG CTA */}
      <section style={{
        backgroundColor: 'var(--color-primary-dark)',
        color: '#FFFFFF',
        padding: '6rem 0',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Start Your Journey
          </span>
          <h2 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>
            Ready to Bring Your Vision to Life?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2.5rem',
            lineHeight: 1.7,
          }}>
            Tell us about your upcoming occasion. Our production specialists will review your brief and prepare a comprehensive, tailored quotation.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/plan-event" className="btn btn-primary btn-lg">
              Plan Your Event <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn btn-outline-gold btn-lg">
              Speak With Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
