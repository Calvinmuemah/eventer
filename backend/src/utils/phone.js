/**
 * Normalizes Kenyan phone numbers into E.164 standard (+254...).
 * @param {string} phone 
 * @returns {string}
 */
export const normalizeKenyanPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return phone || '';
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '').trim();
  if (!cleaned) return '';

  if (cleaned.startsWith('+254')) return cleaned;
  if (cleaned.startsWith('254')) return `+${cleaned}`;
  if (cleaned.startsWith('0') && cleaned.length >= 10) return `+254${cleaned.slice(1)}`;
  if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) return `+254${cleaned}`;
  if (cleaned.startsWith('+')) return cleaned;
  return `+254${cleaned.replace(/^0+/, '')}`;
};
