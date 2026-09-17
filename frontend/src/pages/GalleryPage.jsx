import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Custom Stage Backdrop & Cultural Decor',
    category: 'lighting',
    imageUrl: '/images/events/IMG-20260915-WA0019.jpg',
    description: 'Bespoke dowry ceremony backdrop with artisanal calabash accents, woven basketry, and vibrant red runway draping.',
  },
  {
    id: 2,
    title: 'Master of Ceremonies & Protocol Direction',
    category: 'mc',
    imageUrl: '/images/events/IMG-20260915-WA0008.jpg',
    description: 'MC Titoe presiding over live dowry proceedings, guest pacing, and ceremonial introductions on the red carpet.',
  },
  {
    id: 3,
    title: 'High-Energy Celebration & Dance Pacing',
    category: 'weddings',
    imageUrl: '/images/events/IMG-20260915-WA0011.jpg',
    description: 'Joyful family celebration, festive tinsel garlands, and rhythmic choreography orchestrated during live festivities.',
  },
  {
    id: 4,
    title: 'Concert PA Acoustics & Live Vocal Address',
    category: 'sound',
    imageUrl: '/images/events/IMG-20260915-WA0020.jpg',
    description: 'Crisp wireless frequency management and acoustic clarity for keynote family speeches and musical numbers.',
  },
  {
    id: 5,
    title: 'Lead Event Director & Production Hospitality',
    category: 'mc',
    imageUrl: '/images/events/IMG-20260915-WA0018.jpg',
    description: 'Calm, confident stage presence and on-site oversight ensuring every transition unfolds seamlessly.',
  },
  {
    id: 6,
    title: 'On-Site Staging & Acoustic Coordination',
    category: 'sound',
    imageUrl: '/images/events/IMG-20260915-WA0014.jpg',
    description: 'Coordinated audio setup with wide-dispersion speakers and stage floral enhancements for outdoor venues.',
  },
  {
    id: 7,
    title: 'Imperial Gala Banquet Staging',
    category: 'galas',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    description: 'Precision table geometry and warm ambient lighting for corporate delegates.',
  },
  {
    id: 8,
    title: 'Concert PA & Digital Acoustic Mixing',
    category: 'sound',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    description: 'Front-of-house 32-channel digital console with multi-zone delay management.',
  },
  {
    id: 9,
    title: 'Keynote & Executive Host Podium',
    category: 'mc',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    description: 'Bespoke stage lectern, RF frequency management, and pro presenter monitors.',
  },
  {
    id: 10,
    title: 'Acoustic Grand Piano & Backline Stage',
    category: 'instruments',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    description: 'Tour-grade backline staging calibrated for live jazz and classical ensembles.',
  },
  {
    id: 11,
    title: 'Canopy Fairy Light & Chandelier Staging',
    category: 'lighting',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    description: 'Atmospheric architectural lighting transforming a pavilion courtyard.',
  },
  {
    id: 12,
    title: 'Private Estate Wedding Reception',
    category: 'weddings',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Harmonized floral arrangements, sound distribution, and run-of-show direction.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'mc', label: 'MC & Hosting' },
  { id: 'weddings', label: 'Weddings & Dowries' },
  { id: 'lighting', label: 'Decor & Staging' },
  { id: 'sound', label: 'PA & Acoustics' },
  { id: 'galas', label: 'Corporate & Galas' },
  { id: 'instruments', label: 'Backline & Instruments' },
];

export const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeItem, setActiveItem] = useState(null);

  const filteredItems = selectedCategory === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Portfolio & Gallery | ${BRAND.name}`} 
        description="Visual portfolio of past event staging, concert sound engineering, decor, and architectural illumination."
      />

      {/* Header Banner */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem',
        textAlign: 'center',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Visual Portfolio
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Production Moments & Staging
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.82)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            Explore our visual showcase demonstrating the synergy of sound reinforcement, ambient lighting, master hosting, and refined event architecture.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container">
          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '3.5rem',
          }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--color-muted)',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Image Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.25rem, 3vw, 2rem)',
          }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="card-luxury"
                style={{
                  position: 'relative',
                  height: '340px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-primary)',
                }}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(8, 26, 43, 0.85) 0%, transparent 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                }}>
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.25rem',
                    color: '#FFFFFF',
                    marginBottom: '0.25rem',
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '0.825rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: 1.4,
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {activeItem && (
            <div 
              onClick={() => setActiveItem(null)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(4, 13, 22, 0.88)',
                backdropFilter: 'blur(6px)',
                zIndex: 1200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '860px',
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <button
                  onClick={() => setActiveItem(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                >
                  <X size={20} />
                </button>
                <div style={{ backgroundColor: '#071524', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={activeItem.imageUrl} 
                    alt={activeItem.title} 
                    style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ padding: '1.75rem 2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {activeItem.title}
                  </h3>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                    {activeItem.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{
            marginTop: '5rem',
            textAlign: 'center',
            padding: '3.5rem 2rem',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}>
            <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
              Envisioning Similar Staging for Your Event?
            </h3>
            <p style={{ maxWidth: '520px', margin: '0 auto 2rem', color: 'var(--color-muted)' }}>
              Let our team tailor lighting, acoustics, and production to your exact specifications.
            </p>
            <Link to="/plan-event" className="btn btn-primary btn-lg">
              Plan Your Event <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
