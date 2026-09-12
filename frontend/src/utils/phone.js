/**
 * Kenyan phone number utility functions for MC Titoe Events & Designs.
 * Handles normalization to E.164 (+254...) before sending to backend/DB,
 * and format validation for Kenyan mobile prefixes (07... / 01...).
 */

/**
 * Normalizes a user-entered phone number into the +254 format.
 * Examples:
 *   "0712345678" -> "+254712345678"
 *   "0112345678" -> "+254112345678"
 *   "712345678"  -> "+254712345678"
 *   "254712345678" -> "+254712345678"
 *   "+254712345678" -> "+254712345678"
 *
 * @param {string} phone
 * @returns {string} E.164 formatted Kenyan phone number
 */
export const normalizeKenyanPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  
  // Remove spaces, hyphens, parentheses, and dots
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '').trim();
  if (!cleaned) return '';

  // Already starts with +254
  if (cleaned.startsWith('+254')) {
    return cleaned;
  }

  // Starts with 254 (without +)
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }

  // Starts with 07... or 01... (standard 10-digit Kenyan format)
  if (cleaned.startsWith('0') && cleaned.length >= 10) {
    return `+254${cleaned.slice(1)}`;
  }

  // Starts with 7... or 1... (9-digit Kenyan format without leading 0)
  if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
    return `+254${cleaned}`;
  }

  // Fallback: if it starts with a plus, keep it, else prefix with +254
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  return `+254${cleaned.replace(/^0+/, '')}`;
};

/**
 * Validates whether the given string is a valid Kenyan phone number.
 * Accepts formats:
 *  - 07XXXXXXXX or 01XXXXXXXX (10 digits)
 *  - 7XXXXXXXX or 1XXXXXXXX (9 digits)
 *  - 2547XXXXXXXX or 2541XXXXXXXX
 *  - +2547XXXXXXXX or +2541XXXXXXXX
 *
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidKenyanPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const normalized = normalizeKenyanPhone(phone);
  // Valid Kenyan mobile: +254 followed by 7 or 1 and 8 digits
  return /^\+254[17]\d{8}$/.test(normalized);
};

export const KENYAN_PHONE_PLACEHOLDER = '07... or 01... (e.g. 0712 345 678)';
