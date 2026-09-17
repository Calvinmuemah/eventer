import crypto from 'crypto';
import { config } from '../config/env.js';

/**
 * Helper to check whether Paystack credentials in .env are configured with real values
 */
function isPaystackConfigured() {
  const key = config.paystack.secretKey;
  if (!key) return false;
  if (
    key.includes('placeholder') ||
    key.includes('your_paystack') ||
    key.includes('replace_with')
  ) {
    return false;
  }
  return true;
}

export const paystackService = {
  isConfigured: isPaystackConfigured,

  /**
   * Initializes a Paystack transaction and generates an authorization URL
   * @param {Object} params
   * @param {string} params.email - Customer email address
   * @param {number} params.amount - Amount in KES (will be converted to cents * 100)
   * @param {string} params.reference - Unique transaction reference
   * @param {string} params.callbackUrl - URL to redirect the user to after payment
   * @param {Object} [params.metadata] - Custom metadata stored with transaction
   * @param {Array<string>} [params.channels] - Supported channels e.g. ['card', 'mobile_money', 'bank_transfer']
   */
  async initializeTransaction({
    email,
    amount,
    reference,
    callbackUrl,
    metadata = {},
    channels = ['card', 'mobile_money', 'bank_transfer'],
  }) {
    // Check if real Paystack keys are mounted
    if (!isPaystackConfigured()) {
      console.log('\n======================================================');
      console.log('[PaystackService] SIMULATION MODE (No real PAYSTACK_SECRET_KEY in .env)');
      console.log(`[PaystackService] Ref: ${reference}`);
      console.log(`[PaystackService] Email: ${email} | Amount: KSh ${amount}`);
      console.log('[PaystackService] Notice: Replace PAYSTACK_SECRET_KEY & PAYSTACK_PUBLIC_KEY in backend/.env to activate live Paystack payments.');
      console.log('======================================================\n');

      return {
        isSimulation: true,
        reference,
        authorizationUrl: null,
        accessCode: null,
        message: 'Paystack is operating in simulated sandbox mode.',
      };
    }

    try {
      // Paystack expects amount in subunit/cents (multiply by 100 for KES)
      const subunitAmount = Math.round(Number(amount) * 100);

      const payload = {
        email: email.trim(),
        amount: subunitAmount,
        currency: config.paystack.currency || 'KES',
        reference,
        callback_url: callbackUrl,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: 'Brand',
              variable_name: 'brand',
              value: 'MC TITOE EVENTS AND DESIGNS',
            },
            ...(metadata.bookingReference
              ? [
                  {
                    display_name: 'Booking Reference',
                    variable_name: 'booking_reference',
                    value: metadata.bookingReference,
                  },
                ]
              : []),
          ],
        },
        channels,
      };

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.paystack.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        console.error('[PaystackService ERROR] Initialize transaction failed:', data);
        throw new Error(data.message || 'Paystack initialization failed.');
      }

      return {
        isSimulation: false,
        reference: data.data.reference,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
      };
    } catch (err) {
      console.error('[PaystackService ERROR]', err.message);
      throw err;
    }
  },

  /**
   * Verifies a Paystack transaction status by reference
   * @param {string} reference
   */
  async verifyTransaction(reference) {
    if (!isPaystackConfigured()) {
      console.log(`[PaystackService] Simulating transaction verification for reference: ${reference}`);
      return {
        isSimulation: true,
        success: true,
        status: 'success',
        reference,
        channel: 'simulated_card',
        paidAt: new Date().toISOString(),
        gatewayResponse: 'Successful Sandbox Transaction',
      };
    }

    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${config.paystack.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || 'Failed to verify Paystack transaction.');
      }

      const txData = result.data;
      const isSuccess = txData.status === 'success';

      return {
        isSimulation: false,
        success: isSuccess,
        status: txData.status,
        reference: txData.reference,
        amount: Number(txData.amount) / 100, // convert back from subunit
        currency: txData.currency,
        channel: txData.channel,
        paidAt: txData.paid_at,
        customer: txData.customer,
        authorization: txData.authorization,
        metadata: txData.metadata,
        gatewayResponse: txData.gateway_response,
      };
    } catch (err) {
      console.error('[PaystackService verifyTransaction ERROR]', err.message);
      throw err;
    }
  },

  /**
   * Validates Paystack HMAC SHA512 Webhook Signature
   * @param {string} signature - Header 'x-paystack-signature'
   * @param {string|Buffer} rawBody - Raw body buffer or JSON string
   */
  verifyWebhookSignature(signature, rawBody) {
    const secret = config.paystack.webhookSecret || config.paystack.secretKey;
    if (!secret || !signature) return false;

    const hash = crypto
      .createHmac('sha512', secret)
      .update(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
      .digest('hex');

    return hash === signature;
  },
};
