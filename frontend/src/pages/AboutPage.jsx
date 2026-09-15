import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Compass, HeartHandshake, ArrowRight, Award } from 'lucide-react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const AboutPage = () => {
  return (
    <div className="about-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`About Us | ${BRAND.name}`} 
        description={`Learn about ${BRAND.name}, our philosophy of precision staging, acoustic mastery, and dedicated event hospitality.`}
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
            Our Heritage & Philosophy
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Elevating Celebrations Through Artistry & Engineering
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.82)',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            We believe that extraordinary occasions are born when technical precision seamlessly supports authentic human celebration.
          </p>
        </div>
      </section>

      {/* Story & Approach */}
      <section className="section-padding">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'center',
            marginBottom: 'clamp(3rem, 6vw, 6rem)',
          }}>
            <div>
              <span className="badge-eyebrow">Our Story</span>
              <h2 className="font-h2" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                Your Story Starts Here.
              </h2>
              <p style={{ color: 'var(--color-dark)', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '1rem' }}>
                {BRAND.name} was established with a singular focus: to liberate event hosts from the chaos of fragmented vendors. Too often, sound engineers, hosts, lighting technicians, and decorators work in silos—resulting in awkward technical pauses, poor sound distribution, and disjointed pacing.
              </p>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
                By establishing an integrated production collective, we coordinate master of ceremonies, acoustic sound engineering, backline instrumentation, and architectural lighting under a single accountable standard of luxury hospitality.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/services" className="btn btn-primary">
                  Explore Services <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Contact Concierge
                </Link>
              </div>
            </div>

            <div style={{
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}>
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80" 
                alt="Event Execution" 
                style={{ width: '100%', height: '440px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Mission & Vision */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: 'clamp(3rem, 6vw, 6rem)',
          }}>
            <div className="card-luxury" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '4px',
                backgroundColor: 'rgba(201, 162, 39, 0.12)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <Compass size={22} />
              </div>
              <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                To engineer pristine, atmospheric event environments where every word spoken is heard clearly, every musical passage resonates, and every milestone is celebrated with unhurried dignity.
              </p>
            </div>

            <div className="card-luxury" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '4px',
                backgroundColor: 'rgba(8, 26, 43, 0.08)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <Sparkles size={22} />
              </div>
              <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Our Vision
              </h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                To stand as the benchmark in luxury event services—renowned for calm professionalism, acoustic perfection, transparent pricing, and uncompromising hospitality.
              </p>
            </div>

            <div className="card-luxury" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '4px',
                backgroundColor: 'rgba(201, 162, 39, 0.12)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <HeartHandshake size={22} />
              </div>
              <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                Our Approach
              </h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Rigorous preparation precedes every event. We test all frequencies, conduct walk-throughs, map sightlines, and establish contingency protocols before your first guest steps through the doors.
              </p>
            </div>
          </div>

          {/* Pillars / Values Banner */}
          <div style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            padding: '4rem 3rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
                Guiding Principles
              </span>
              <h2 className="font-h2" style={{ color: '#FFFFFF' }}>
                The {BRAND.name} Commitment
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Acoustic Purity
                </div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
                  Calibrated sound coverage without harsh resonance or ear fatigue.
                </p>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Protocol Mastery
                </div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
                  Hosts who understand diplomatic etiquette, keynote cues, and cultural traditions.
                </p>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Radical Transparency
                </div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
                  Detailed, itemized quotations without surprise surcharges or hidden fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
