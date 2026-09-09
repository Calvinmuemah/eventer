import React from 'react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const TermsPage = () => {
  return (
    <div className="terms-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Terms of Service | ${BRAND.name}`} 
        description="Terms of service, quotation validity, and booking policies of EVENTA."
      />

      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0 3.5rem',
        textAlign: 'center',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Contractual Standards
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Terms of Service
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
            1. Service Quotations & Validity
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            Provisional quotations issued through our platform remain valid for fourteen (14) calendar days unless otherwise stated in writing. Quotations reflect specifications provided by the client and may be adjusted following formal venue walkthroughs or changes in operational scope.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            2. Booking Confirmation & Reservations
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            A booking is formally confirmed once the quotation is accepted and the required deposit or payment schedule is satisfied. Acceptance secures technical crew allocation, sound and lighting inventory, and host reservations for the specified event date.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            3. Venue Access & Site Readiness
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            The host or venue management must ensure adequate load-in access, appropriate electrical power distribution, and safe staging environments as mutually agreed during pre-production coordination.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            4. Cancellations & Modifications
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            Modification requests submitted via our quotation portal or concierge team are accommodated subject to inventory availability and timeline feasibility. Cancellation policies are detailed in individual service agreement contracts.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            5. Contact Information
          </h3>
          <p style={{ color: 'var(--color-muted)' }}>
            For contractual inquiries, reach our administrative desk at <a href={`mailto:${BRAND.contact.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{BRAND.contact.email}</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
