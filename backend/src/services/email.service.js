import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

/**
 * Checks if the SMTP credentials in .env are configured with real values
 */
function isSmtpConfigured() {
  const { user, pass } = config.smtp;
  if (!user || !pass) return false;
  // Detect placeholder strings
  if (user.includes('your_email') || pass.includes('your_16_char')) {
    return false;
  }
  return true;
}

/**
 * Create reusable nodemailer transporter
 */
let cachedTransporter = null;
function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
    tls: {
      rejectUnauthorized: false, // Prevents self-signed cert blocks on custom mail hosts
    },
  });

  return cachedTransporter;
}

/**
 * Base email layout wrapper with luxury MC TITOE branding
 */
function wrapHtmlTemplate({ title, preheader, contentHtml }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0F172A;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F1F5F9;
      padding: 32px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border: 1px solid #E2E8F0;
    }
    .header {
      background: linear-gradient(135deg, #081A2B 0%, #0F2942 100%);
      padding: 36px 28px;
      text-align: center;
      border-bottom: 3px solid #C9A227;
    }
    .brand-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #D4AF37;
      background: rgba(201, 162, 39, 0.15);
      border: 1px solid rgba(201, 162, 39, 0.35);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .brand-title {
      color: #FFFFFF;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 1.5px;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-subtitle {
      color: #94A3B8;
      font-size: 13px;
      margin: 6px 0 0 0;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.65;
      color: #334155;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 14px;
    }
    .badge-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #C9A227;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 24px 0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    .details-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #E2E8F0;
    }
    .details-table td.label {
      font-weight: 600;
      color: #475569;
      width: 40%;
      background-color: #F8FAFC;
    }
    .details-table td.value {
      color: #0F172A;
      font-weight: 500;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 20px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #C9A227 0%, #B38E1B 100%);
      color: #081A2B !important;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.5px;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(201, 162, 39, 0.3);
    }
    .footer {
      background-color: #081A2B;
      padding: 28px 24px;
      text-align: center;
      color: #94A3B8;
      font-size: 12px;
      line-height: 1.6;
    }
    .footer-links {
      margin-bottom: 12px;
    }
    .footer-links a {
      color: #C9A227;
      text-decoration: none;
      margin: 0 8px;
    }
    .preheader {
      display: none;
      font-size: 1px;
      color: #333333;
      line-height: 1px;
      max-height: 0px;
      max-width: 0px;
      opacity: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader || title}</span>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="brand-badge">Luxury & Corporate Events</div>
        <h1 class="brand-title">MC TITOE EVENTS AND DESIGNS</h1>
        <p class="brand-subtitle">Master of Ceremonies • Sound & PA • Decor • Production</p>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <div class="footer-links">
          <a href="${config.frontendUrl}">Website</a> • 
          <a href="${config.frontendUrl}/services">Services</a> • 
          <a href="${config.frontendUrl}/contact">Contact Us</a>
        </div>
        <p style="margin: 0 0 6px 0;">Mombasa Bamburi, Kenya • Phone: +254 721 784 682 / +254 758 726 167 • WhatsApp: +254 782 527 081</p>
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} MC TITOE EVENTS AND DESIGNS. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generic safe mail sender that catches any network/auth failures
 */
async function sendMailSafely(mailOptions) {
  const sender = `"${config.smtp.fromName}" <${config.smtp.fromAddress || config.smtp.user}>`;
  const fullMailOptions = {
    from: sender,
    ...mailOptions,
  };

  // Check if SMTP is configured
  if (!isSmtpConfigured()) {
    console.log('\n======================================================');
    console.log('[EmailService] DRY RUN (SMTP credentials not yet configured in .env)');
    console.log(`[EmailService] To: ${fullMailOptions.to}`);
    console.log(`[EmailService] Subject: ${fullMailOptions.subject}`);
    console.log(`[EmailService] Notice: Replace SMTP_USER and SMTP_PASS in backend/.env with your real credentials to send real emails.`);
    console.log('======================================================\n');
    return { success: true, simulated: true };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(fullMailOptions);
    console.log(`[EmailService] Email sent successfully to ${fullMailOptions.to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EmailService ERROR] Failed sending email to ${fullMailOptions.to}:`, err.message);
    // Do not throw: return gracefully so user's booking/inquiry flow is never broken
    return { success: false, error: err.message };
  }
}

export const emailService = {
  /**
   * 1. Confirmation email when a user submits the "Contact Us" form
   */
  async sendContactConfirmationEmail({ to, fullName, subject, message }) {
    if (!to) return { success: false, error: 'Recipient email is required' };

    const clientName = fullName || 'Valued Client';
    const inquirySubject = subject || 'General Event Inquiry';
    const emailSubject = `Inquiry Received: We're excited to assist you! | MC TITOE EVENTS AND DESIGNS`;

    const contentHtml = `
      <div class="greeting">Dear ${clientName},</div>
      <p>Thank you for contacting <strong>MC TITOE EVENTS AND DESIGNS</strong>. We have successfully received your inquiry regarding <em>"${inquirySubject}"</em>.</p>
      
      <div class="badge-card">
        <h4 style="margin: 0 0 8px 0; color: #081A2B; font-size: 15px;">Your Inquiry Summary:</h4>
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748B;"><strong>Subject:</strong> ${inquirySubject}</p>
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 12px; border-radius: 6px; font-style: italic; color: #334155; font-size: 14px;">
          "${message ? message.replace(/\n/g, '<br/>') : 'No message body provided'}"
        </div>
      </div>

      <p>Our dedicated events coordination and production team is currently reviewing your details. One of our specialists will get in touch with you shortly (typically within 2 to 4 business hours) to discuss how we can make your celebration extraordinary.</p>

      <p>If your inquiry is urgent, feel free to call or WhatsApp our management team directly at <strong>+254 721 784 682</strong> or <strong>+254 782 527 081</strong>.</p>

      <div class="btn-container">
        <a href="${config.frontendUrl}/services" class="btn">Explore Our Event Services</a>
      </div>

      <p style="margin-top: 24px; font-size: 14px; color: #64748B;">
        Warm regards,<br/>
        <strong>MC Titoe & The Events Production Team</strong><br/>
        MC TITOE EVENTS AND DESIGNS
      </p>
    `;

    const html = wrapHtmlTemplate({
      title: emailSubject,
      preheader: `Thank you for contacting MC TITOE EVENTS AND DESIGNS. We have received your inquiry.`,
      contentHtml,
    });

    const text = `
Dear ${clientName},

Thank you for reaching out to MC TITOE EVENTS AND DESIGNS. We have successfully received your message regarding "${inquirySubject}".

Inquiry Message:
${message || ''}

Our team is reviewing your inquiry and will contact you within 2 to 4 business hours.
For urgent assistance, contact us at +254 721 784 682 or WhatsApp +254 782 527 081.

Best regards,
MC TITOE EVENTS AND DESIGNS
${config.frontendUrl}
    `.trim();

    // Send confirmation to the client
    const clientResult = await sendMailSafely({
      to,
      subject: emailSubject,
      text,
      html,
    });

    // Notify the admin team in the background
    if (config.smtp.adminNotificationEmail && config.smtp.adminNotificationEmail !== to) {
      const adminSubject = `[New Contact Inquiry] from ${clientName} - ${inquirySubject}`;
      const adminHtml = wrapHtmlTemplate({
        title: adminSubject,
        preheader: `New contact submission from ${clientName} (${to})`,
        contentHtml: `
          <div class="greeting">New Contact Inquiry Received</div>
          <p>A new customer has submitted an inquiry through the MC TITOE website.</p>
          <table class="details-table">
            <tr><td class="label">Customer Name</td><td class="value">${clientName}</td></tr>
            <tr><td class="label">Email Address</td><td class="value"><a href="mailto:${to}">${to}</a></td></tr>
            <tr><td class="label">Subject</td><td class="value">${inquirySubject}</td></tr>
          </table>
          <div class="badge-card">
            <h4 style="margin: 0 0 6px 0; color: #081A2B;">Message:</h4>
            <p style="margin: 0; color: #334155;">${message ? message.replace(/\n/g, '<br/>') : 'N/A'}</p>
          </div>
        `,
      });

      sendMailSafely({
        to: config.smtp.adminNotificationEmail,
        subject: adminSubject,
        text: `New contact inquiry from ${clientName} (${to}):\n\nSubject: ${inquirySubject}\n\nMessage:\n${message}`,
        html: adminHtml,
      }).catch((err) => console.warn('[EmailService] Admin notification warning:', err.message));
    }

    return clientResult;
  },

  /**
   * 2. Confirmation email when a user plans an event with us & generates a quotation
   */
  async sendEventPlanningConfirmationEmail({
    to,
    fullName,
    referenceCode,
    eventType,
    eventDate,
    eventLocation,
    guestCount,
    services = [],
    quoteId,
    quoteNumber,
    totalAmount,
  }) {
    if (!to) return { success: false, error: 'Recipient email is required' };

    const clientName = fullName || 'Valued Client';
    const emailSubject = `Event Planning Request Received [${referenceCode}] | MC TITOE EVENTS AND DESIGNS`;
    const quoteUrl = quoteId ? `${config.frontendUrl}/quote/${quoteId}` : `${config.frontendUrl}`;

    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-KE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'To Be Confirmed';

    const servicesListHtml =
      Array.isArray(services) && services.length > 0
        ? services.map((s) => `<li><strong>${s.name || s.slug || 'Service'}</strong></li>`).join('')
        : '<li>Custom Event Services Package</li>';

    const formattedAmount = Number(totalAmount || 0).toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).replace('KES', 'KSh');

    const contentHtml = `
      <div class="greeting">Dear ${clientName},</div>
      <p>Thank you for choosing <strong>MC TITOE EVENTS AND DESIGNS</strong> for your upcoming event! We have received your event planning request and our quotation system has generated your initial estimate.</p>

      <div class="badge-card">
        <table style="width: 100%; border: none;">
          <tr>
            <td>
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600;">Reference Code</span><br/>
              <strong style="font-size: 18px; color: #081A2B; letter-spacing: 0.5px;">${referenceCode}</strong>
            </td>
            ${
              quoteNumber
                ? `
            <td style="text-align: right;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600;">Quotation #</span><br/>
              <strong style="font-size: 16px; color: #C9A227;">${quoteNumber}</strong>
            </td>`
                : ''
            }
          </tr>
        </table>
      </div>

      <h4 style="margin: 20px 0 8px 0; color: #081A2B;">Event Specifications:</h4>
      <table class="details-table">
        <tr>
          <td class="label">Event Type</td>
          <td class="value" style="text-transform: capitalize;">${eventType || 'Celebration'}</td>
        </tr>
        <tr>
          <td class="label">Date of Event</td>
          <td class="value">${formattedDate}</td>
        </tr>
        <tr>
          <td class="label">Location / Venue</td>
          <td class="value">${eventLocation || 'Nairobi, Kenya'}</td>
        </tr>
        <tr>
          <td class="label">Estimated Guests</td>
          <td class="value">${guestCount ? `${guestCount} Guests` : 'To be specified'}</td>
        </tr>
        <tr>
          <td class="label">Provisional Estimate</td>
          <td class="value" style="color: #081A2B; font-weight: 800; font-size: 16px;">${formattedAmount}</td>
        </tr>
      </table>

      <h4 style="margin: 20px 0 8px 0; color: #081A2B;">Selected Services:</h4>
      <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #334155;">
        ${servicesListHtml}
      </ul>

      <p>Your provisional quotation has been prepared. You can review the breakdown online, request customized adjustments, or proceed with locking in your date.</p>

      ${
        quoteId
          ? `
      <div class="btn-container">
        <a href="${quoteUrl}" class="btn">View & Confirm Your Quotation</a>
      </div>
      <p style="text-align: center; font-size: 12px; color: #64748B; margin-top: -10px;">
        Or visit: <a href="${quoteUrl}" style="color: #C9A227;">${quoteUrl}</a>
      </p>
      `
          : ''
      }

      <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 14px 18px; margin: 24px 0; font-size: 13px; color: #1E40AF;">
        <strong>What happens next?</strong><br/>
        Our senior lead planner will review your venue details and date availability. We will follow up via phone or WhatsApp to finalize stage setups, schedule, and any custom requirements.
      </div>

      <p style="margin-top: 24px; font-size: 14px; color: #64748B;">
        Warm regards,<br/>
        <strong>MC Titoe & The Events Management Team</strong><br/>
        MC TITOE EVENTS AND DESIGNS
      </p>
    `;

    const html = wrapHtmlTemplate({
      title: emailSubject,
      preheader: `Your event planning request ${referenceCode} with MC TITOE EVENTS AND DESIGNS has been received.`,
      contentHtml,
    });

    const text = `
Dear ${clientName},

Thank you for choosing MC TITOE EVENTS AND DESIGNS!
We have received your event planning request.

Reference Code: ${referenceCode}
Quotation Number: ${quoteNumber || 'Generated'}
Event Type: ${eventType}
Date: ${formattedDate}
Location: ${eventLocation}
Estimated Guests: ${guestCount}
Provisional Total: ${formattedAmount}

You can view your quotation and proceed online at:
${quoteUrl}

Our team will contact you shortly to coordinate further details.

Warm regards,
MC TITOE EVENTS AND DESIGNS
${config.frontendUrl}
    `.trim();

    // Send confirmation to client
    const clientResult = await sendMailSafely({
      to,
      subject: emailSubject,
      text,
      html,
    });

    // Alert admin team
    if (config.smtp.adminNotificationEmail && config.smtp.adminNotificationEmail !== to) {
      const adminSubject = `[New Event Booking Request] ${referenceCode} - ${clientName} (${eventType})`;
      const adminHtml = wrapHtmlTemplate({
        title: adminSubject,
        preheader: `New event request ${referenceCode} from ${clientName} (${to})`,
        contentHtml: `
          <div class="greeting">New Event Request Received</div>
          <p>A client has submitted an event planning request on the MC TITOE platform.</p>
          <table class="details-table">
            <tr><td class="label">Reference Code</td><td class="value"><strong>${referenceCode}</strong></td></tr>
            <tr><td class="label">Quote Number</td><td class="value">${quoteNumber || 'N/A'}</td></tr>
            <tr><td class="label">Client Name</td><td class="value">${clientName}</td></tr>
            <tr><td class="label">Client Email</td><td class="value"><a href="mailto:${to}">${to}</a></td></tr>
            <tr><td class="label">Event Type</td><td class="value">${eventType}</td></tr>
            <tr><td class="label">Event Date</td><td class="value">${formattedDate}</td></tr>
            <tr><td class="label">Location</td><td class="value">${eventLocation}</td></tr>
            <tr><td class="label">Guest Count</td><td class="value">${guestCount}</td></tr>
            <tr><td class="label">Total Amount</td><td class="value">${formattedAmount}</td></tr>
          </table>
          <div class="btn-container">
            <a href="${config.frontendUrl}/quote/${quoteId}" class="btn">View Customer Quotation</a>
          </div>
        `,
      });

      sendMailSafely({
        to: config.smtp.adminNotificationEmail,
        subject: adminSubject,
        text: `New event request ${referenceCode} from ${clientName} (${to})\nEvent: ${eventType}\nDate: ${formattedDate}\nTotal: ${formattedAmount}\nQuote: ${quoteUrl}`,
        html: adminHtml,
      }).catch((err) => console.warn('[EmailService] Admin notification warning:', err.message));
    }

    return clientResult;
  },

  /**
   * 3. Confirmation email when a booking is created / quote accepted
   */
  async sendBookingConfirmationEmail({
    to,
    fullName,
    bookingReference,
    quoteNumber,
    eventType,
    eventDate,
    eventLocation,
    guestCount,
    totalAmount,
    amountPaid,
    balance,
    bookingId,
  }) {
    if (!to) return { success: false, error: 'Recipient email is required' };

    const clientName = fullName || 'Valued Client';
    const emailSubject = `Booking Confirmed [${bookingReference}] | MC TITOE EVENTS AND DESIGNS`;
    const bookingUrl = bookingId ? `${config.frontendUrl}/payment/${bookingId}` : `${config.frontendUrl}`;

    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString('en-KE', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'To Be Confirmed';

    const formattedTotal = Number(totalAmount || 0).toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).replace('KES', 'KSh');

    const formattedPaid = Number(amountPaid || 0).toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).replace('KES', 'KSh');

    const formattedBalance = Number(balance || totalAmount || 0).toLocaleString('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).replace('KES', 'KSh');

    const contentHtml = `
      <div class="greeting">Dear ${clientName},</div>
      <p>Congratulations! Your booking with <strong>MC TITOE EVENTS AND DESIGNS</strong> has been confirmed.</p>

      <div class="badge-card">
        <table style="width: 100%; border: none;">
          <tr>
            <td>
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600;">Booking Reference</span><br/>
              <strong style="font-size: 18px; color: #081A2B;">${bookingReference}</strong>
            </td>
            ${
              quoteNumber
                ? `
            <td style="text-align: right;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600;">Quote Ref</span><br/>
              <strong style="font-size: 16px; color: #C9A227;">${quoteNumber}</strong>
            </td>`
                : ''
            }
          </tr>
        </table>
      </div>

      <h4 style="margin: 20px 0 8px 0; color: #081A2B;">Reservation Summary:</h4>
      <table class="details-table">
        <tr><td class="label">Event Type</td><td class="value" style="text-transform: capitalize;">${eventType || 'Event'}</td></tr>
        <tr><td class="label">Date</td><td class="value">${formattedDate}</td></tr>
        <tr><td class="label">Location</td><td class="value">${eventLocation || 'Nairobi, Kenya'}</td></tr>
        <tr><td class="label">Total Amount</td><td class="value"><strong>${formattedTotal}</strong></td></tr>
        <tr><td class="label">Amount Paid</td><td class="value">${formattedPaid}</td></tr>
        <tr><td class="label">Balance Due</td><td class="value" style="color: #C9A227; font-weight: 700;">${formattedBalance}</td></tr>
      </table>

      ${
        bookingId
          ? `
      <div class="btn-container">
        <a href="${bookingUrl}" class="btn">View Booking & Payment Options</a>
      </div>`
          : ''
      }

      <p style="margin-top: 24px; font-size: 14px; color: #64748B;">
        Warm regards,<br/>
        <strong>MC Titoe & The Events Team</strong><br/>
        MC TITOE EVENTS AND DESIGNS
      </p>
    `;

    const html = wrapHtmlTemplate({
      title: emailSubject,
      preheader: `Booking confirmation [${bookingReference}] with MC TITOE EVENTS AND DESIGNS`,
      contentHtml,
    });

    const text = `
Dear ${clientName},

Your booking reservation with MC TITOE EVENTS AND DESIGNS is confirmed.
Booking Reference: ${bookingReference}
Event: ${eventType}
Date: ${formattedDate}
Location: ${eventLocation}
Total: ${formattedTotal}
Balance: ${formattedBalance}

View payment and confirmation details:
${bookingUrl}

Warm regards,
MC TITOE EVENTS AND DESIGNS
    `.trim();

    return await sendMailSafely({
      to,
      subject: emailSubject,
      text,
      html,
    });
  },

  /**
   * 4. Urgent notification when a client requests payment assistance (Bank card, wire instructions, etc.)
   */
  async sendPaymentAssistanceNotificationEmail({
    name,
    phone,
    email,
    bookingReference,
    message,
    balance = null,
    eventType = null,
    eventDate = null,
  }) {
    const clientName = name || 'Valued Client';
    const cleanPhone = phone || 'N/A';
    const cleanEmail = email || 'N/A';
    const formattedBalance = balance !== null ? `KSh ${parseFloat(balance).toLocaleString()}` : 'Pending Quote / Ledger';
    const adminUrl = config.adminUrl || 'http://localhost:5174';

    // Format WhatsApp direct click link if Kenyan phone
    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
    const waLink = digitsOnly ? `https://wa.me/${digitsOnly.startsWith('0') ? '254' + digitsOnly.slice(1) : digitsOnly}` : null;

    // 1. Notify Admin (MC Titoe owner)
    if (config.smtp.adminNotificationEmail) {
      const adminSubject = `[URGENT: Payment Assistance Request] from ${clientName} (${bookingReference || 'General'})`;
      const adminHtml = wrapHtmlTemplate({
        title: adminSubject,
        preheader: `Customer ${clientName} has requested assistance with bank card or wire payment for booking ${bookingReference}`,
        contentHtml: `
          <div class="greeting" style="color: #EF4444;">⚠️ Urgent: Payment Assistance Requested</div>
          <p>A client has requested administrative support on completing their booking payment (Bank Card / Wire / M-Pesa assistance).</p>

          <table class="details-table">
            <tr><td class="label">Customer Name</td><td class="value"><strong>${clientName}</strong></td></tr>
            <tr><td class="label">Booking Reference</td><td class="value"><strong style="color: #C9A227;">${bookingReference || 'N/A'}</strong></td></tr>
            <tr><td class="label">Phone Number</td><td class="value"><a href="tel:${cleanPhone}">${cleanPhone}</a> ${waLink ? ` &bull; <a href="${waLink}" target="_blank" style="color: #10B981; font-weight: 600;">Chat on WhatsApp</a>` : ''}</td></tr>
            <tr><td class="label">Email Address</td><td class="value"><a href="mailto:${cleanEmail}">${cleanEmail}</a></td></tr>
            <tr><td class="label">Outstanding Balance</td><td class="value" style="color: #C9A227; font-weight: 700;">${formattedBalance}</td></tr>
            ${eventType ? `<tr><td class="label">Event Type</td><td class="value">${eventType}</td></tr>` : ''}
            ${eventDate ? `<tr><td class="label">Event Date</td><td class="value">${new Date(eventDate).toLocaleDateString()}</td></tr>` : ''}
          </table>

          <div class="badge-card" style="border-left: 4px solid #C9A227; background-color: #F8FAFC; margin-top: 16px;">
            <h4 style="margin: 0 0 6px 0; color: #081A2B;">Customer Inquiry / Note:</h4>
            <p style="margin: 0; color: #334155; font-style: italic;">"${message ? message.replace(/\n/g, '<br/>') : 'Customer requested assistance via payment portal.'}"</p>
          </div>

          <div class="btn-container" style="margin-top: 24px;">
            <a href="${adminUrl}/payment-assistance" class="btn">View in Admin Operations</a>
          </div>
        `,
      });

      const adminText = `
URGENT: Payment Assistance Requested
Customer: ${clientName}
Booking Ref: ${bookingReference || 'N/A'}
Phone: ${cleanPhone}
Email: ${cleanEmail}
Balance: ${formattedBalance}
Message: ${message || 'N/A'}

Review in Admin: ${adminUrl}/payment-assistance
      `.trim();

      sendMailSafely({
        to: config.smtp.adminNotificationEmail,
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      }).catch((err) => console.warn('[EmailService] Admin payment assistance notification error:', err.message));
    }

    // 2. Acknowledgment to the client if email is provided
    if (cleanEmail && cleanEmail.includes('@') && cleanEmail !== config.smtp.adminNotificationEmail) {
      const clientSubject = `Payment Assistance Received [${bookingReference || 'MC TITOE EVENTS'}]`;
      const clientHtml = wrapHtmlTemplate({
        title: clientSubject,
        preheader: `Thank you ${clientName}. Our finance and concierge team has received your payment inquiry.`,
        contentHtml: `
          <div class="greeting">We Have Received Your Request</div>
          <p>Dear <strong>${clientName}</strong>,</p>
          <p>Thank you for reaching out regarding payment for booking reference <strong>${bookingReference || ''}</strong>. Our concierge and finance desk has received your note and will contact you directly to assist with your payment arrangement.</p>

          <table class="details-table">
            <tr><td class="label">Booking Reference</td><td class="value"><strong>${bookingReference || 'N/A'}</strong></td></tr>
            <tr><td class="label">Pending Balance</td><td class="value" style="color: #C9A227; font-weight: 700;">${formattedBalance}</td></tr>
            <tr><td class="label">Contact Phone</td><td class="value">${cleanPhone}</td></tr>
          </table>

          <p style="margin-top: 20px; font-size: 14px; color: #475569;">
            If you require immediate real-time coordination, you may also reach our direct hotline at <strong>+254 721 784 682</strong> or WhatsApp at <strong>+254 782 527 081</strong>.
          </p>

          <p style="margin-top: 24px; font-size: 14px; color: #64748B;">
            Warm regards,<br/>
            <strong>MC Titoe Finance & Operations Desk</strong><br/>
            MC TITOE EVENTS AND DESIGNS
          </p>
        `,
      });

      sendMailSafely({
        to: cleanEmail,
        subject: clientSubject,
        text: `Dear ${clientName},\n\nWe have received your payment assistance request for booking ${bookingReference}. Our concierge will contact you at ${cleanPhone} shortly.\n\nWarm regards,\nMC TITOE EVENTS AND DESIGNS`,
        html: clientHtml,
      }).catch((err) => console.warn('[EmailService] Client payment assistance email error:', err.message));
    }
  },
};

