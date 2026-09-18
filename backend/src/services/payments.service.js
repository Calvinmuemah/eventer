import db from '../db/index.js';
import { config } from '../config/env.js';
import { bookingsRepository } from '../repositories/bookings.repository.js';
import { paymentsRepository } from '../repositories/payments.repository.js';
import { paystackService } from './paystack.service.js';
import { emailService } from './email.service.js';
import { notFound, badRequest } from '../utils/apiError.js';

export const paymentsService = {
  /**
   * Retrieves booking details, payment history, and gateway status
   */
  async getPaymentDetails(bookingId) {
    const booking = await bookingsRepository.findById(bookingId);
    if (!booking) {
      throw notFound(`Booking with ID '${bookingId}' was not found.`);
    }
    const payments = await paymentsRepository.findByBookingId(bookingId);

    const isSandbox = !paystackService.isConfigured();

    return {
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      eventType: booking.event_type,
      eventDate: booking.event_date,
      eventLocation: booking.event_location,
      services: booking.services,
      totalAmount: parseFloat(booking.total_amount),
      amountPaid: parseFloat(booking.amount_paid),
      balance: parseFloat(booking.balance),
      paymentStatus: booking.payment_status,
      bookingStatus: booking.booking_status,
      payments,
      gateway: {
        provider: 'paystack',
        isSandbox,
        publicKey: config.paystack.publicKey,
        currency: config.paystack.currency,
      },
      availableMethods: [
        {
          id: 'paystack_mpesa',
          name: 'M-Pesa / Mobile Money',
          icon: 'Smartphone',
          subtitle: 'Instant STK prompt or paybill directly to your mobile phone',
        },
        {
          id: 'paystack_card',
          name: 'Credit / Debit Card (Visa, Mastercard, Amex)',
          icon: 'CreditCard',
          subtitle: 'Secure, 256-bit SSL encrypted card authorization',
        },
        {
          id: 'bank_transfer',
          name: 'Direct Bank Wire Transfer',
          icon: 'Building2',
          subtitle: 'Corporate wire & manual settlement verification',
        },
      ],
    };
  },

  /**
   * Initiates payment for a booking through Paystack
   * (Operates in sandbox simulation if PAYSTACK_SECRET_KEY is not yet populated)
   */
  async initiatePayment(bookingId, paymentData = {}) {
    const booking = await bookingsRepository.findById(bookingId);
    if (!booking) {
      throw notFound(`Booking with ID '${bookingId}' was not found.`);
    }

    const currentBalance = parseFloat(booking.balance);
    if (currentBalance <= 0 && booking.payment_status === 'Paid') {
      throw badRequest('This booking is already fully settled.');
    }

    const amountToPay = paymentData.amount ? parseFloat(paymentData.amount) : currentBalance;
    if (isNaN(amountToPay) || amountToPay <= 0) {
      throw badRequest('Invalid payment amount requested.');
    }

    const txRef =
      paymentData.reference ||
      `MCTITOE-${booking.booking_reference}-${Date.now().toString().slice(-6)}`;

    const callbackUrl =
      paymentData.callbackUrl ||
      `${config.frontendUrl}/payment/${booking.id}?reference=${txRef}`;

    // Target specific Paystack payment channel based on user selection
    const method = (paymentData.paymentMethod || '').toLowerCase();
    let channels = ['card', 'mobile_money', 'bank_transfer'];
    if (method.includes('mpesa') || method.includes('mobile')) {
      channels = ['mobile_money'];
    } else if (method.includes('card')) {
      channels = ['card'];
    } else if (method.includes('bank')) {
      channels = ['bank_transfer', 'bank'];
    }

    const paystackResult = await paystackService.initializeTransaction({
      email: booking.customer_email || 'client@mctitoeevents.com',
      amount: amountToPay,
      reference: txRef,
      callbackUrl,
      channels,
      metadata: {
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        customerName: booking.customer_name,
        eventType: booking.event_type,
        requestedMethod: paymentData.paymentMethod || 'paystack',
      },
    });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // 1. Simulation Mode (Fallback when Paystack API keys are not yet configured in .env)
      if (paystackResult.isSimulation) {
        const paymentRecord = await paymentsRepository.create(
          {
            bookingId: booking.id,
            transactionReference: txRef,
            amount: amountToPay,
            currency: config.paystack.currency || 'KES',
            provider: 'paystack_sandbox_simulation',
            paymentMethod: paymentData.paymentMethod || 'card',
            status: 'Paid',
            providerResponse: {
              mode: 'sandbox_simulation',
              note: 'Processed via Paystack sandbox simulation. Mount real PAYSTACK_SECRET_KEY in backend/.env for live checkout.',
              timestamp: new Date().toISOString(),
            },
          },
          client
        );

        const newAmountPaid = parseFloat(booking.amount_paid) + amountToPay;
        const newBalance = Math.max(0, parseFloat(booking.total_amount) - newAmountPaid);
        const newPaymentStatus = newBalance === 0 ? 'Paid' : 'Partial';
        const newBookingStatus = 'Confirmed';

        const updatedBooking = await bookingsRepository.updatePaymentState(
          booking.id,
          newPaymentStatus,
          newAmountPaid,
          newBalance,
          newBookingStatus,
          client
        );

        await client.query('COMMIT');

        // Send automated booking confirmation email
        if (booking.customer_email) {
          emailService.sendBookingConfirmationEmail({
            to: booking.customer_email,
            fullName: booking.customer_name,
            bookingReference: booking.booking_reference,
            quoteNumber: booking.quote_number,
            eventType: booking.event_type,
            eventDate: booking.event_date,
            eventLocation: booking.event_location,
            guestCount: booking.guest_count,
            totalAmount: booking.total_amount,
            amountPaid: newAmountPaid,
            balance: newBalance,
            bookingId: booking.id,
          }).catch((err) => {
            console.warn('[PaymentsService] Email dispatch warning:', err.message);
          });
        }

        return {
          isSandbox: true,
          reference: txRef,
          authorizationUrl: null,
          booking: updatedBooking,
          payment: paymentRecord,
          message: 'Sandbox payment processed successfully. Booking is now confirmed.',
        };
      }

      // 2. Live Paystack Gateway Mode
      const pendingPayment = await paymentsRepository.create(
        {
          bookingId: booking.id,
          transactionReference: txRef,
          amount: amountToPay,
          currency: config.paystack.currency || 'KES',
          provider: 'paystack',
          paymentMethod: paymentData.paymentMethod || 'paystack',
          status: 'Pending',
          providerResponse: {
            accessCode: paystackResult.accessCode,
            authorizationUrl: paystackResult.authorizationUrl,
            timestamp: new Date().toISOString(),
          },
        },
        client
      );

      await client.query('COMMIT');

      return {
        isSandbox: false,
        reference: txRef,
        authorizationUrl: paystackResult.authorizationUrl,
        accessCode: paystackResult.accessCode,
        payment: pendingPayment,
        message: 'Paystack authorization session created successfully.',
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Verifies payment status with Paystack and updates the booking ledger
   */
  async verifyPayment(bookingId, { reference }) {
    if (!reference) {
      throw badRequest('Transaction reference is required for verification.');
    }

    const booking = await bookingsRepository.findById(bookingId);
    if (!booking) {
      throw notFound(`Booking with ID '${bookingId}' was not found.`);
    }

    const verification = await paystackService.verifyTransaction(reference);

    if (!verification.success && verification.status !== 'success') {
      throw badRequest(`Payment verification failed. Status: ${verification.status || 'declined'}`);
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const existingPayment = await paymentsRepository.findByTransactionReference(reference);
      const paidAmount = verification.amount || parseFloat(existingPayment?.amount || booking.balance);

      let paymentRecord;
      if (existingPayment) {
        // Update payment record
        const updateQuery = `
          UPDATE payments
          SET status = 'Paid',
              provider_response = $2,
              payment_method = COALESCE($3, payment_method),
              updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `;
        const updateRes = await client.query(updateQuery, [
          existingPayment.id,
          JSON.stringify(verification),
          verification.channel || 'paystack',
        ]);
        paymentRecord = updateRes.rows[0];
      } else {
        paymentRecord = await paymentsRepository.create(
          {
            bookingId: booking.id,
            transactionReference: reference,
            amount: paidAmount,
            currency: config.paystack.currency || 'KES',
            provider: 'paystack',
            paymentMethod: verification.channel || 'paystack',
            status: 'Paid',
            providerResponse: verification,
          },
          client
        );
      }

      const newAmountPaid = parseFloat(booking.amount_paid) + paidAmount;
      const newBalance = Math.max(0, parseFloat(booking.total_amount) - newAmountPaid);
      const newPaymentStatus = newBalance === 0 ? 'Paid' : 'Partial';
      const newBookingStatus = 'Confirmed';

      const updatedBooking = await bookingsRepository.updatePaymentState(
        booking.id,
        newPaymentStatus,
        newAmountPaid,
        newBalance,
        newBookingStatus,
        client
      );

      await client.query('COMMIT');

      // Dispatch booking confirmation email upon successful payment verification
      if (booking.customer_email) {
        emailService.sendBookingConfirmationEmail({
          to: booking.customer_email,
          fullName: booking.customer_name,
          bookingReference: booking.booking_reference,
          quoteNumber: booking.quote_number,
          eventType: booking.event_type,
          eventDate: booking.event_date,
          eventLocation: booking.event_location,
          guestCount: booking.guest_count,
          totalAmount: booking.total_amount,
          amountPaid: newAmountPaid,
          balance: newBalance,
          bookingId: booking.id,
        }).catch((err) => {
          console.warn('[PaymentsService] Verification email warning:', err.message);
        });
      }

      return {
        success: true,
        isSandbox: verification.isSimulation || false,
        booking: updatedBooking,
        payment: paymentRecord,
        message: 'Payment verified and booking confirmed successfully.',
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Processes Paystack Webhook notifications
   */
  async handleWebhook(payload, signature, rawBody) {
    // Verify signature if secret key is present
    if (config.paystack.secretKey && !config.paystack.secretKey.includes('placeholder')) {
      const isValid = paystackService.verifyWebhookSignature(signature, rawBody);
      if (!isValid) {
        throw badRequest('Invalid Paystack webhook signature.');
      }
    }

    if (payload.event === 'charge.success') {
      const data = payload.data;
      const reference = data.reference;
      const bookingId = data.metadata?.bookingId;

      if (bookingId) {
        await this.verifyPayment(bookingId, { reference });
        console.log(`[Paystack Webhook] Successfully processed charge.success for booking: ${bookingId}`);
      }
    }

    return { received: true };
  },
};
