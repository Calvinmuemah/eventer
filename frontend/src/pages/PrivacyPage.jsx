import React from 'react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const PrivacyPage = () => {
  return (
    <div className="privacy-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Privacy Policy | ${BRAND.name}`} 
        description={`Privacy policy and data governance practices of ${BRAND.name}.`}
      />

      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0 3.5rem',
        textAlign: 'center',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Data Governance
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
            Last updated: September 2026
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow" style={{
          backgroundColor: '#FFFFFF',
          padding: '3rem 2.5rem',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xs)',
          lineHeight: 1.8,
          fontSize: '0.975rem',
          color: 'var(--color-dark)',
        }}>
          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            1. Commitment to Client Confidentiality
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            At {BRAND.legalName}, we recognize the deeply personal and high-profile nature of private galas, diplomatic gatherings, weddings, and corporate celebrations. We safeguard all client specifications, guest attendance estimates, and venue logistics with strict security and confidentiality.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            2. Information We Collect
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            We gather information necessary to prepare quotations, execute staging operations, and administer bookings. This includes contact details (names, verified emails, phone numbers), event location and dates, guest capacity requirements, and specific technical staging briefs.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            3. Payment Data Security
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            We do not store complete payment card credentials or sensitive banking passwords on our internal servers. All transactions are routed through certified, PCI-compliant payment gateway providers or verified banking wire channels.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            4. Third-Party Disclosures
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            We never sell, lease, or monetize your contact or event information. Information is only coordinated with vetted technical crew members, sound engineers, and on-site production personnel bound by confidentiality agreements.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            5. Inquiries & Requests
          </h3>
          <p style={{ color: 'var(--color-muted)' }}>
            For questions regarding our privacy practices or to request data modification, contact our concierge at <a href={`mailto:${BRAND.contact.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{BRAND.contact.email}</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
