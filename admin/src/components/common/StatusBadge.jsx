import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  return (
    <span className={`admin-badge ${normalized}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
