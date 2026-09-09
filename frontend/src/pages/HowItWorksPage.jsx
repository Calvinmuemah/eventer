import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, FileText, CreditCard, Music, ShieldCheck } from 'lucide-react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';
import { fadeInUp, staggerContainer } from '../animations/variants';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'Tell Us About Your Event',
      subtitle: 'Discovery & Event Parameter Framing',
      description: 'Your journey begins with defining the scope. Through our online event planner, you share your date, venue location, estimated guest count, and overall aesthetic desires. Whether a diplomatic dinner or a high-energy anniversary, this provides our directors with the foundational framework.',
      details: [
        'Venue acoustic profiling and physical dimensions',
        'Guest count and seating layout review',
        'Timeline constraints and curfew specifications',
      ],
      icon: FileText,
    },
    {
      num: '02',
      title: 'Choose Your Services',
      subtitle: 'Modular Staging & Multi-Discipline Curation',
      description: 'Select precisely what your event demands. Pick an articulate Master of Ceremonies, concert-grade sound reinforcement, backline instruments for your band, architectural lighting, or turnkey event planning. Our services integrate under a unified technical director.',
      details: [
        'Single or multi-service bundling',
        'Tailored equipment sizing based on room acoustics',
        'Optional bespoke staging requirements (More)',
      ],
      icon: Music,
    },
    {
      num: '03',
      title: 'Receive Your Quote',
      subtitle: 'Transparent, Itemized Cost Modeling',
      description: 'Within moments of submitting your brief, an itemized quotation is generated. We avoid vague lump sums; every sound system, host hour, and lighting fixture is transparently listed. You can review, request adjustments, or speak directly with our concierge.',
      details: [
        'Clear line-item pricing without surprise fees',
        'Digital change requests and adjustment notes',
        'Direct consultation with an event director',
      ],
      icon: Sparkles,
    },
    {
      num: '04',
      title: 'Confirm & Pay',
      subtitle: 'Secured Booking & Flawless On-Site Execution',
      description: 'Once you approve your quotation, lock in your date with our secure payment checkout or request concierge billing assistance. Our production crew commences run-of-show synchronization, equipment staging, and on-site rehearsals.',
      details: [
        'Official reservation ledger pass generated immediately',
        'Flexible checkout methods (Cards, Mobile Money, Wire)',
        'Dedicated on-site production lead assigned to your event',
      ],
      icon: CreditCard,
    },
  ];

  return (
    <div className="how-it-works-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`How It Works | ${BRAND.name}`} 
        description="Learn how EVENTA plans, stages, and coordinates unforgettable celebrations from initial inquiry to final encore."
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
            The Four-Step Blueprint
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            How We Bring Your Occasion to Life
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.82)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            A dependable, transparent process engineered to eliminate stress and deliver flawless execution.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="section-padding">
        <div className="container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 1;
              return (
                <motion.div 
                  key={step.num}
                  variants={fadeInUp}
                  className="card-luxury"
                  style={{
                    padding: 'clamp(2rem, 5vw, 3.5rem)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2.5rem',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '2.75rem',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        lineHeight: 1,
                      }}>
                        {step.num}
                      </span>
                      <div style={{
                        height: '2px',
                        flex: 1,
                        backgroundColor: 'var(--color-border)',
                      }} />
                    </div>

                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
                      {step.subtitle}
                    </div>
                    <h2 className="font-h2" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                      {step.title}
                    </h2>
                    <p style={{ color: 'var(--color-dark)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.975rem' }}>
                      {step.description}
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--color-surface-subtle)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
                      <Icon size={22} style={{ color: 'var(--color-accent)' }} />
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>What We Coordinate</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {step.details.map((detail, dIdx) => (
                        <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem' }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ color: 'var(--color-dark)' }}>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Box */}
          <div style={{
            marginTop: '5rem',
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-xl)',
          }}>
            <h3 className="font-h2" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
              Experience the Difference in Production Quality
            </h3>
            <p style={{ maxWidth: '560px', margin: '0 auto 2rem', color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem' }}>
              Submit your event brief today and take the first step towards a stress-free, extraordinary occasion.
            </p>
            <Link to="/plan-event" className="btn btn-primary btn-lg">
              Begin Planning Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
