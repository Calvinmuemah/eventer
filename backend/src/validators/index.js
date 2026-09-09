import { badRequest } from '../utils/apiError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9\s\-().]{7,25}$/;

export const validateEventRequest = (body) => {
  const errors = {};

  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!body.email || !EMAIL_REGEX.test(body.email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!body.phone || !PHONE_REGEX.test(body.phone.trim())) {
    errors.phone = 'A valid phone number is required (at least 7 digits).';
  }

  if (!body.eventType || typeof body.eventType !== 'string' || body.eventType.trim().length < 2) {
    errors.eventType = 'Event type is required.';
  }

  if (!body.eventDate) {
    errors.eventDate = 'Event date is required.';
  } else {
    const d = new Date(body.eventDate);
    if (isNaN(d.getTime())) {
      errors.eventDate = 'Invalid event date.';
    }
  }

  if (!body.eventLocation || typeof body.eventLocation !== 'string' || body.eventLocation.trim().length < 2) {
    errors.eventLocation = 'Event location is required.';
  }

  const guestCount = parseInt(body.guestCount, 10);
  if (isNaN(guestCount) || guestCount <= 0) {
    errors.guestCount = 'Guest count must be a positive number.';
  }

  if (!Array.isArray(body.serviceIds) || body.serviceIds.length === 0) {
    errors.serviceIds = 'At least one service must be selected.';
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest('Validation failed for event request submission.', errors);
  }
};

export const validateContactMessage = (body) => {
  const errors = {};

  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!body.email || !EMAIL_REGEX.test(body.email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (body.phone && !PHONE_REGEX.test(body.phone.trim())) {
    errors.phone = 'Phone number format is invalid.';
  }

  if (!body.subject || typeof body.subject !== 'string' || body.subject.trim().length < 2) {
    errors.subject = 'Subject is required.';
  }

  if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters.';
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest('Validation failed for contact message.', errors);
  }
};

export const validatePaymentAssistance = (body) => {
  const errors = {};

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!body.email || !EMAIL_REGEX.test(body.email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (!body.phone || !PHONE_REGEX.test(body.phone.trim())) {
    errors.phone = 'A valid phone number is required.';
  }

  if (!body.bookingReference || typeof body.bookingReference !== 'string' || body.bookingReference.trim().length < 3) {
    errors.bookingReference = 'Booking reference is required.';
  }

  if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 5) {
    errors.message = 'Message must explain what assistance you require (at least 5 characters).';
  }

  if (Object.keys(errors).length > 0) {
    throw badRequest('Validation failed for payment assistance request.', errors);
  }
};
