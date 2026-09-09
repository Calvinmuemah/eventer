import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import ServicesAdminPage from './pages/ServicesAdminPage';
import EventRequestsAdminPage from './pages/EventRequestsAdminPage';
import QuotesAdminPage from './pages/QuotesAdminPage';
import BookingsAdminPage from './pages/BookingsAdminPage';
import PaymentsAdminPage from './pages/PaymentsAdminPage';
import PaymentAssistanceAdminPage from './pages/PaymentAssistanceAdminPage';
import MessagesAdminPage from './pages/MessagesAdminPage';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="services" element={<ServicesAdminPage />} />
        <Route path="event-requests" element={<EventRequestsAdminPage />} />
        <Route path="quotes" element={<QuotesAdminPage />} />
        <Route path="bookings" element={<BookingsAdminPage />} />
        <Route path="payments" element={<PaymentsAdminPage />} />
        <Route path="payment-assistance" element={<PaymentAssistanceAdminPage />} />
        <Route path="messages" element={<MessagesAdminPage />} />
      </Route>
    </Routes>
  );
};

export default App;
