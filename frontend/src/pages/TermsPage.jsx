import React from 'react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

export const TermsPage = () => {
  return (
    <div className="terms-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Terms of Service | ${BRAND.name}`} 
        description={`Terms of service, quotation validity, deposit schedules, and cancellation policies of ${BRAND.name}.`}
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
            2. Booking Confirmation & Deposit Policy
          </h3>
          <p style={{ marginBottom: '1.25rem', color: 'var(--color-muted)' }}>
            A reservation is formally locked in once the quotation is accepted and the required <strong>50% deposit</strong> is satisfied. This deposit secures technical crew allocation, sound and lighting gear, and Master of Ceremonies reservations for your event date.
          </p>
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--color-champagne-light)',
            borderLeft: '4px solid var(--color-accent)',
            borderRadius: 'var(--radius-xs)',
            marginBottom: '1.75rem',
            fontSize: '0.9rem',
          }}>
            <strong>Payment Schedule:</strong> 50% deposit upon quotation acceptance to lock down the date. The remaining balance must be cleared at least <strong>48 hours prior</strong> to the event.
          </div>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            3. Venue Access & Site Readiness
          </h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--color-muted)' }}>
            The host or venue management must ensure adequate load-in access, safe electrical power distribution, and suitable staging environments in Mombasa or any event destination across Kenya as mutually agreed during pre-production coordination.
          </p>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            4. Event Cancellation & Postponement Policy
          </h3>
          <p style={{ marginBottom: '1.25rem', color: 'var(--color-muted)' }}>
            If a client moves, reschedules, or cancels an event date, the following refund and credit structure applies based on the formal written notice provided:
          </p>

          <div style={{
            overflowX: 'auto',
            marginBottom: '1.75rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xs)',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.9rem',
              textAlign: 'left',
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-surface-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--color-primary)', fontWeight: 700 }}>Notice Provided</th>
                  <th style={{ padding: '0.85rem 1.25rem', color: 'var(--color-primary)', fontWeight: 700 }}>Refund / Fee Structure</th>
                </tr>
              </thead>
              <tbody>
                {BRAND.cancellationPolicy.map((tier, idx) => (
                  <tr key={idx} style={{ borderBottom: idx < BRAND.cancellationPolicy.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--color-primary)' }}>{tier.notice}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--color-muted)' }}>{tier.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
            5. Contact Information
          </h3>
          <p style={{ color: 'var(--color-muted)' }}>
            For contractual inquiries, booking adjustments, or billing questions, reach our administrative desk at <a href={`mailto:${BRAND.contact.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{BRAND.contact.email}</a> or call <a href={`tel:${BRAND.contact.phoneRaw}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{BRAND.contact.phoneFormatted}</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
