import { contactRepository } from '../repositories/contact.repository.js';

export const contactService = {
  async saveMessage(data) {
    return await contactRepository.create(data);
  }
};
