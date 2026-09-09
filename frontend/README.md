# EVENTA Frontend

A luxury event services & staging booking web application. Built with React, Vite, React Router, Framer Motion, Lucide Icons, and modern modular CSS.

## Features

- **High-End Editorial Design**: Midnight Navy, Rich Gold accents, Champagne, and Ivory palette with Cormorant Garamond serif and Plus Jakarta Sans pairing.
- **Dynamic Services Catalogue**: Services fetched live from `/api/v1/services` with loading and error states.
- **Multi-Step Event Planning Wizard**:
  - Step 1: Event & Contact Details (date, location, guest count, event type)
  - Step 2: Multi-Service Selection (MC, PA System, Musical Instruments, Planning, Decor/Lighting, More)
  - Step 3: Event Requirements & Budget Scope
  - Step 4: Review & Submission with instant Quotation generation
- **Quotation Workflow**:
  - Review itemized pricing schedule
  - Accept quotation to create booking
  - Request modifications / notes
- **Booking & Payment Interface**:
  - Booking ledger review
  - Flexible payment options (Card, Mobile Money / M-Pesa, Bank Wire)
  - Clear development/sandbox transaction simulation
  - Concierge payment assistance request form
- **Comprehensive Portfolio & Brand Pages**:
  - Filterable Gallery with Lightbox modal
  - Company Heritage & Philosophy (About)
  - 4-Step Operational Blueprint (How It Works)
  - Contact Concierge Form
  - Legal Policy Pages (Privacy & Terms)
  - Custom 404 Page

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

Environment variables can be specified in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```
