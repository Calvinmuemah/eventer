# EVENTA Admin Suite

Executive operations console for Eventa Event Services. Allows event managers, coordinators, and administrators to manage services, track event planning requests, administer quotations, monitor bookings, review transactions, and handle client inquiries.

## Features

- **Dashboard Metrics**: Real-time stats for revenue settled, total bookings, active services, event requests, and assistance inquiries.
- **Services Management**:
  - Full CRUD: Create, Edit, Deactivate/Delete services
  - Image, slug, description, sort order, and deliverables management
  - Instantly reflects on public website and event planner
- **Event Requests**:
  - Live feed of multi-service inquiries submitted by clients
  - Inline status management (`submitted`, `under_review`, `quoted`, `cancelled`)
  - Direct links to client quotation documents
- **Quotations Ledger**:
  - Review pricing schedules, subtotals, and discounts
  - Status updates (`Draft`, `Sent`, `Accepted`, `Rejected`, `Change Requested`, `Expired`)
- **Bookings Ledger**:
  - Monitor confirmed reservations, amount paid, and balances due
  - Dual status control (Booking status & Payment status)
- **Payments Audit**:
  - Transaction log with references, payment methods, and timestamps
- **Payment Assistance**:
  - Inquiries from customers needing wire or invoicing assistance
  - Triage statuses (`Pending`, `Contacted`, `Resolved`)
- **Client Messages**:
  - Inquiries submitted from public contact form with read/unread flags

## Running the Admin Suite

```bash
cd admin
npm install
npm run dev
```

The Admin Suite runs by default on `http://localhost:5174` (proxying API calls to backend at `http://localhost:5000`).
