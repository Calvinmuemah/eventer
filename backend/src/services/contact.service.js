import { contactRepository } from '../repositories/contact.repository.js';
import { emailService } from './email.service.js';

export const contactService = {
  async saveMessage(data) {
    const record = await contactRepository.create(data);

    // Send automated email confirmation to the user who contacted us
    if (record?.email) {
      emailService.sendContactConfirmationEmail({
        to: record.email,
        fullName: record.full_name,
        subject: record.subject,
        message: record.message,
      }).catch((err) => {
        console.warn('[ContactService] Background email dispatch warning:', err.message);
      });
    }

    return record;
  }
};

