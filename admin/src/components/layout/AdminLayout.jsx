import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { adminApi } from '../../api/adminApi';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingAssistanceCount, setPendingAssistanceCount] = useState(0);
  const location = useLocation();

  const fetchAssistanceCount = async () => {
    try {
      const res = await adminApi.getStats();
      if (res.data?.overview?.pending_assistance !== undefined) {
        setPendingAssistanceCount(parseInt(res.data.overview.pending_assistance, 10) || 0);
      }
    } catch (err) {
      // Non-blocking
    }
  };

  // Close mobile sidebar and refresh notifications on route change
  useEffect(() => {
    setSidebarOpen(false);
    fetchAssistanceCount();
  }, [location.pathname]);

  return (
    <div className="admin-wrapper">
      {sidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        pendingAssistanceCount={pendingAssistanceCount}
      />
      <div className="admin-main">
        <Topbar 
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)} 
          pendingAssistanceCount={pendingAssistanceCount}
        />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
